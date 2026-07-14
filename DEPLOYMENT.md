# Деплой

## Вариант 1: Docker / docker-compose (VPS, свой сервер)

Подходит для деплоя на любой VPS (например, в Казахстане/СНГ — Selectel,
timeweb, VK Cloud и т.п.) с Docker.

```bash
# 1. Задайте секреты
export AUTH_SECRET=$(openssl rand -base64 32)
export IP_HASH_SALT=$(openssl rand -hex 16)
export NEXTAUTH_URL="https://verdant-atyrau.kz"

# 2. Соберите и запустите
docker compose up -d --build

# 3. Примените миграции внутри контейнера
docker compose exec app node -e "require('child_process')" # (см. ниже — миграции)
```

Миграции удобнее прогонять отдельным шагом (перед стартом приложения), из CI
или вручную:

```bash
DATABASE_URL="postgresql://verdant:verdant@<host>:5432/verdant_db" npx drizzle-kit migrate
DATABASE_URL="postgresql://verdant:verdant@<host>:5432/verdant_db" npx tsx src/db/seed.ts
```

Поставьте реверс-прокси (nginx/Caddy/Traefik) перед контейнером `app` для
TLS-терминации (Let's Encrypt) — приложение слушает `0.0.0.0:3000`.

### Nginx-пример (фрагмент)

```nginx
server {
    listen 443 ssl http2;
    server_name verdant-atyrau.kz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Вариант 2: Vercel + управляемая PostgreSQL

1. Импортируйте репозиторий в Vercel.
2. Создайте PostgreSQL (Vercel Postgres, Neon, Supabase — любой провайдер с
   поддержкой `postgresql://` connection string).
3. В настройках проекта Vercel добавьте переменные окружения:
   `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `IP_HASH_SALT`,
   `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`.
4. Перед первым деплоем примените миграции и сид локально, указав
   `DATABASE_URL` на продовую БД:
   ```bash
   DATABASE_URL="<прод-строка>" npx drizzle-kit migrate
   DATABASE_URL="<прод-строка>" npx tsx src/db/seed.ts
   ```
5. Задеплойте (`vercel --prod` или через Git push).

> ⚠️ Важно: `output: "standalone"` в `next.config.ts` предназначен для Docker.
> На Vercel эта опция не мешает — Vercel игнорирует её и использует свою
> serverless-сборку.

## Чек-лист перед продакшеном

- [ ] Сменён пароль администратора, созданного при сиде
- [ ] `AUTH_SECRET` — уникальный случайный секрет (не тот, что в `.env.example`)
- [ ] `NEXTAUTH_URL` указывает на реальный HTTPS-домен (нужно для `__Host-` cookie)
- [ ] Настроен HTTPS (реверс-прокси/Vercel — автоматически)
- [ ] `NODE_ENV=production`
- [ ] Резервное копирование БД настроено на стороне хостинг-провайдера
- [ ] `RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW_MS` подобраны под реальную нагрузку
- [ ] Реальные фото/описания врачей загружены через `/admin/doctors`
