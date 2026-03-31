#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
$(cat /tmp/schema_dump.sql)
EOSQL

echo "Database initialization completed successfully by init-db script."