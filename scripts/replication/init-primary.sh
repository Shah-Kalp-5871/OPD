#!/bin/bash
set -e

# =============================================================================
# MedFlow PostgreSQL Primary Setup — WAL Streaming Replication
# =============================================================================
echo "Starting replication user configuration on Postgres Primary..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER replication_user WITH REPLICATION PASSWORD 'super_secure_replication_password';
EOSQL

# Adjust WAL configuration for hot standby replication
echo "Adjusting primary postgresql.conf configs..."
cat <<EOF >> "$PGDATA/postgresql.conf"
wal_level = replica
max_wal_senders = 10
wal_keep_size = 64MB
hot_standby = on
EOF

# Allow replica nodes to connect via pg_hba.conf
echo "Adjusting pg_hba.conf configurations..."
echo "host replication replication_user 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"

echo "PostgreSQL primary replication configuration applied successfully."
