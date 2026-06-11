-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'editor', 'user')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Добавить тестового админа
INSERT INTO users (email, password_hash, role)
VALUES ('admin@oblivion.com', 'временный_пароль', 'admin');