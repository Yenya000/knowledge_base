// backend/fix-passwords.js
const bcrypt = require('bcrypt');
const { query } = require('./db');

async function fixPasswords() {
    console.log('→ Исправление паролей...\n');

    // Пароли для каждого пользователя
    const users = [
        { employee_id: 'OBL-0001', plainPassword: 'admin123' },
        { employee_id: 'OBL-EDITOR1', plainPassword: 'editor123' },
        { employee_id: 'OBL-USER1', plainPassword: 'user123' }
    ];

    for (const user of users) {
        // Генерируем хеш
        const hashedPassword = await bcrypt.hash(user.plainPassword, 10);

        // Обновляем в БД
        await query(
            `UPDATE users SET password_hash = $1 WHERE employee_id = $2`,
            [hashedPassword, user.employee_id]
        );

        console.log(`✅ ${user.employee_id} - пароль обновлен (хеш: ${hashedPassword.substring(0, 30)}...)`);
    }

    console.log('\n✅ Готово! Теперь пользователи могут войти.');
    process.exit();
}

fixPasswords();