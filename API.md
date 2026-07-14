# API

Все ответы — JSON. Ошибки валидации возвращают `422` с полем `details`
(объект `{ [field]: string[] }`). Публичные POST-эндпоинты защищены rate
limiting (по умолчанию 5 запросов/минуту с одного IP) и honeypot-полем
`website` (должно быть пустой строкой).

## Публичные эндпоинты

### `POST /api/appointments`
Создать запись на приём.

```jsonc
// Request body
{
  "patientName": "Асель Тестова",
  "phone": "+77771234567",
  "email": "optional@example.com",
  "serviceId": "uuid",
  "doctorId": "uuid | \"\"",       // необязательно
  "appointmentDate": "2026-07-15",   // YYYY-MM-DD, не в прошлом
  "appointmentTime": "10:00",        // HH:mm
  "comment": "необязательно",
  "website": ""                      // honeypot — должно быть пустым
}
```

Ответы: `201` успех, `409` слот уже занят этим врачом, `422` ошибка валидации,
`429` превышен лимит запросов.

### `GET /api/appointments/slots?doctorId=<uuid>&date=<YYYY-MM-DD>`
Вернуть занятые тайм-слоты врача на дату (используется формой записи для
отключения занятых опций).

```json
{ "taken": ["10:00", "10:30"] }
```

### `POST /api/contact`
Отправить сообщение через форму обратной связи. Тело: `{ name, phone, message, website }`.

## Админ-эндпоинты (требуют сессию сотрудника)

Все `/api/admin/*` защищены middleware — без валидной сессии возвращают `401`.
Мутации CRUD врачей/услуг требуют роль `ADMIN` (иначе `403`).

### `GET /api/admin/appointments`
Query-параметры: `date`, `status`, `doctorId`, `search`, `page`, `pageSize`.

### `PATCH /api/admin/appointments/:id`
Тело: `{ "status": "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" }`.
Записывается в `audit_logs`.

### `GET /api/admin/doctors` · `POST /api/admin/doctors` (ADMIN)
### `PATCH /api/admin/doctors/:id` · `DELETE /api/admin/doctors/:id` (ADMIN, soft-delete)

### `GET /api/admin/services` · `POST /api/admin/services` (ADMIN)
### `PATCH /api/admin/services/:id` · `DELETE /api/admin/services/:id` (ADMIN, soft-delete)

## Аутентификация

`POST /api/auth/callback/credentials` (через Auth.js) — используется формой
входа `/admin/login`. Сессия — JWT в httpOnly-cookie, срок жизни 8 часов.
