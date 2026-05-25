const { Pool } = require('pg');

// Строка подключения без sslmode — SSL настраиваем отдельно
const connectionString = 'postgresql://neondb_owner:npg_tLxSP3uwp7lZ@ep-sweet-thunder-ale35vy5.c-3.eu-central-1.aws.neon.tech/neondb';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false   // обязательно для Neon
    },
    idleTimeoutMillis: 20000,       // закрываем простаивающие соединения до того, как Neon их оборвет
    connectionTimeoutMillis: 15000,
    keepAlive: true,
    max: 10,
    allowExitOnIdle: false,         // не даём процессу завершиться, пока есть соединения
    reapIntervalMillis: 1000,       // быстрее обнаруживаем мёртвые сокеты
});

pool.on('connect', (client) => {
    client.on('error', (err) => {
        console.error('Ошибка соединения PostgreSQL:', err.message);
    });
});

pool.on('error', (err) => {
    console.error('Ошибка пула PostgreSQL:', err.message);
});

// Прогрев пула — первое соединение сразу при старте
const warmupPool = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('Пул прогрелся, первое соединение успешно');
    } catch (err) {
        console.error('Прогрев пула не удался:', err.message);
    }
};
warmupPool();

// Keep-alive каждые 20 секунд — не даём соединениям умереть
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
    } catch (err) {
        console.error('Keep-alive запрос не удался:', err.message);
    }
}, 20000);

// Простая инициализация таблиц и тестовых данных
const initializeDatabase = async () => {
    console.log('Запуск инициализации базы данных...');
    const client = await pool.connect().catch(err => {
        console.error('Не удалось подключиться к базе для инициализации:', err.message);
        return null;
    });
    if (!client) return;

    try {
        await client.query(`
            BEGIN;
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                employee_id VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'editor', 'user')),
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                content TEXT,
                category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                author_id UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
            COMMIT;
        `);
        console.log('Таблицы проверены/созданы');

        // Категории
        await client.query(`
            INSERT INTO categories (id, name) VALUES 
                (1, 'HR'), (2, 'IT'), (3, 'Финансы'), (4, 'Маркетинг')
            ON CONFLICT (id) DO NOTHING;
        `);

        // Администратор (пароль пока открытый, потом заменится хешем)
        await client.query(`
            INSERT INTO users (employee_id, password_hash, role) 
            VALUES ('OBL-0001', 'admin123', 'admin')
            ON CONFLICT (employee_id) DO NOTHING;
        `);
        console.log('Администратор проверен/создан');

        // Статьи, если таблица пуста
        const { rows: [{ count }] } = await client.query('SELECT COUNT(*) FROM articles');
        if (parseInt(count) === 0) {
            const adminId = (await client.query(`SELECT id FROM users WHERE employee_id = 'OBL-0001'`)).rows[0].id;

            const articles = [
                ['Как подключиться к корпоративной сети Wi-Fi', '1. Включите Wi-Fi на устройстве.\n2. Выберите сеть Company_Staff.\n3. Введите пароль, указанный в приветственном письме.\n4. При возникновении проблем обратитесь в IT-отдел.', 2, adminId],
                ['Политика отпусков и отгулов', 'Каждый сотрудник имеет право на 28 календарных дней оплачиваемого отпуска в год. Отпуск можно разделить на части, одна из которых не менее 14 дней. Заявление подаётся за 2 недели.', 1, adminId],
                ['Регламент работы с конфиденциальной информацией', 'Документы с грифом «Конфиденциально» запрещено выносить за пределы офиса. Пересылка осуществляется только через защищённые каналы. При нарушении – дисциплинарное взыскание.', 2, adminId],
                ['Инструкция по заполнению табеля рабочего времени', '1. Откройте корпоративный портал. 2. Перейдите в раздел «Учёт времени». 3. Выберите период. 4. Внесите часы и сохраните. Табель отправляется в бухгалтерию до 25 числа каждого месяца.', 1, adminId],
                ['Руководство по брендированию презентаций', 'Все презентации должны использовать корпоративный шаблон с логотипом в правом верхнем углу. Основные цвета: синий #005BAA и серый #6D6E71. Загрузить шаблон можно по ссылке в общем доступе.', 4, adminId],
                ['Как оформить командировку', 'Заявление на командировку подаётся через HR-портал. Приложите служебную записку и приблизительную смету расходов. Срок оформления – 3 рабочих дня. Билеты приобретаются централизованно через отдел закупок.', 1, adminId],
                ['Часто задаваемые вопросы по зарплатному проекту', 'Q: Когда приходит зарплата? A: Два раза в месяц – 15-го (аванс) и последнего числа. Q: Как получить справку 2-НДФЛ? A: Запросить в бухгалтерии или скачать в личном кабинете. Q: Куда обращаться по ошибкам в начислениях? A: Написать на payroll@company.ru.', 3, adminId],
                ['Настройка корпоративной почты на мобильном устройстве', '1. Установите приложение Outlook. 2. Добавьте учётную запись с email сотрудника. 3. Введите пароль. 4. Сервер: outlook.office365.com. 5. Используйте SSL. Подробная инструкция с картинками во вложении.', 2, adminId],
                ['Правила оформления заявок в IT-поддержку', 'При создании заявки обязательно укажите: 1. Номер кабинета. 2. Описание проблемы. 3. Скриншот ошибки. 4. Срочность (низкая/средняя/высокая). Заявки без скриншота обрабатываются дольше.', 2, adminId],
                ['Кодекс корпоративной этики', 'Уважайте коллег, соблюдайте дресс-код, не используйте ненормативную лексику. Обо всех нарушениях можно сообщить через форму «Сообщить о нарушении» в личном кабинете.', 4, adminId]
            ];

            const insertSQL = 'INSERT INTO articles (title, content, category_id, author_id) VALUES ($1, $2, $3, $4)';
            for (const a of articles) {
                await client.query(insertSQL, a);
            }
            console.log('Стартовые статьи добавлены');
        } else {
            console.log('Статьи уже существуют, вставка пропущена');
        }

        console.log('Инициализация базы данных завершена');
    } catch (err) {
        console.error('Ошибка инициализации базы данных:', err.message);
    } finally {
        client.release();
    }
};

// Запуск инициализации после прогрева пула
initializeDatabase();

// Корректное завершение
process.on('SIGTERM', async () => {
    await pool.end();
    process.exit(0);
});
process.on('SIGINT', async () => {
    await pool.end();
    process.exit(0);
});

module.exports = pool;