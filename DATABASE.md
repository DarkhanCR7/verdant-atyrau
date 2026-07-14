# Схема базы данных

ORM: Drizzle (`src/db/schema.ts`). Миграции — в `drizzle/`.

## `doctors`
| Колонка | Тип | Примечание |
|---|---|---|
| id | uuid PK | |
| full_name | varchar(200) | |
| specialization | varchar(200) | |
| experience_years | int | |
| bio | text | |
| photo_url | varchar(500) | |
| is_active | boolean | soft-delete флаг |
| created_at / updated_at | timestamptz | |

## `services`
| Колонка | Тип | Примечание |
|---|---|---|
| id | uuid PK | |
| name | varchar(200) | |
| description | text | |
| price_kzt | int | цена в тенге |
| duration_minutes | int | |
| category | varchar(100) | |
| is_active | boolean | soft-delete флаг |

## `appointments`
| Колонка | Тип | Примечание |
|---|---|---|
| id | uuid PK | |
| patient_name | varchar(200) | |
| phone | varchar(32) | |
| email | varchar(255) | nullable |
| service_id | uuid FK → services.id | `ON DELETE RESTRICT` |
| doctor_id | uuid FK → doctors.id | nullable, `ON DELETE SET NULL` |
| appointment_date | date | |
| appointment_time | time | |
| status | enum | `PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW` |
| comment | text | |
| source_ip_hash | varchar(128) | SHA-256, не хранит сырой IP |
| created_at / updated_at | timestamptz | |

**Индексы:**
- `appointments_date_idx` — по `appointment_date` (быстрая фильтрация по дате)
- `appointments_doctor_date_idx` — составной `(doctor_id, appointment_date)`
- `appointments_status_idx` — по `status`
- `appointments_doctor_slot_unique` — **уникальный** `(doctor_id, appointment_date, appointment_time)`,
  гарантирует отсутствие двойного бронирования на уровне БД (race-safe даже
  при параллельных запросах)

## `staff_users`
| Колонка | Тип | Примечание |
|---|---|---|
| id | uuid PK | |
| email | varchar(255) | уникальный индекс |
| password_hash | varchar(255) | bcrypt |
| full_name | varchar(200) | |
| role | enum | `ADMIN, STAFF` |
| is_active | boolean | |

## `audit_logs`
| Колонка | Тип | Примечание |
|---|---|---|
| id | uuid PK | |
| staff_user_id | uuid FK → staff_users.id | nullable, `ON DELETE SET NULL` |
| action | varchar(100) | напр. `UPDATE_STATUS`, `CREATE`, `DEACTIVATE` |
| entity_type | varchar(100) | `appointment` / `doctor` / `service` |
| entity_id | uuid | |
| details | text | |
| created_at | timestamptz | |

## Диаграмма связей

```
staff_users 1───* audit_logs

doctors  1───* appointments *───1 services
```
