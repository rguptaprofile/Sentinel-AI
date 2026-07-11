# MongoDB Migrations

Runtime persistence now uses MongoDB via `backend/database/connection.py` and document schemas in `backend/database/models.py`.

Use this folder for future Mongo migration scripts, for example:

- one-time collection backfills
- index changes beyond the startup indexes
- SQL-to-Mongo export/import utilities
