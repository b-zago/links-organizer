FROM postgres:18

COPY schema_dump.sql /tmp/schema_dump.sql

COPY init-db.sh /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh