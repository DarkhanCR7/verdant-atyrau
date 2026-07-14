# Установка и настройка

## Требования

- Node.js 20+
- PostgreSQL 14+ (локально, в Docker, или управляемая БД — RDS/Neon/Supabase)
- npm

## 1. Переменные окружения

Скопируйте `.env.example` в `.env` и заполните:

```bash
cp .env.example .env
```

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `AUTH_SECRET` | Случайная строка ≥32 символов. Сгенерировать: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Публичный URL сайта (для cookie/редиректов) |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Настройки лимита запросов на публичные формы |
| `IP_HASH_SALT` | Соль для хэширования IP (не хранить IP в открытом виде) |

## 2. База данных

### Вариант А: Docker (рекомендуется для локальной разработки)

```bash
docker compose up -d db
```

### Вариант Б: локальный PostgreSQL

```sql
CREATE USER verdant WITH PASSWORD 'verdant';
CREATE DATABASE verdant_db OWNER verdant;
```

### Применить миграции и заполнить демо-данными

```bash
npm install
npm run db:migrate
npm run db:seed
```

`db:seed` создаёт:
- реальные услуги и цены клиники (из открытых источников)
- 3 демо-врачей (замените на реальных через админку `/admin/doctors`)
- аккаунт администратора: `admin@verdant-atyrau.kz` / `ChangeMe123!` —
  **обязательно смените пароль после первого входа** (регенерируйте
  хэш через `npm run db:seed` с `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`
  в окружении, либо создайте нового пользователя вручную).

## 3. Запуск в режиме разработки

```bash
npm run dev
```

Откройте http://localhost:3000

## 4. Проверки перед коммитом/деплоем

```bash
npm run lint        # ESLint, 0 ошибок
npx tsc --noEmit     # проверка типов
npm test             # unit-тесты (Vitest)
npm run build        # production-сборка
```

## Полезные команды

| Команда | Назначение |
|---|---|
| `npm run db:generate` | Сгенерировать новую миграцию после изменения `src/db/schema.ts` |
| `npm run db:migrate` | Применить миграции |
| `npm run db:studio` | Открыть Drizzle Studio (визуальный просмотр БД) |
| `npm run format` | Форматирование кода Prettier |
