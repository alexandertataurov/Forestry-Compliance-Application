-- Создание схемы logs
CREATE SCHEMA IF NOT EXISTS logs;

-- Предоставление прав пользователю postgres
GRANT ALL PRIVILEGES ON SCHEMA logs TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA logs TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA logs TO postgres;

-- Создание расширений PostgreSQL
SELECT 'Database initialized successfully' as status;