#!/bin/bash
set -e

# =============================================================================
# MedFlow PostgreSQL Standby Setup — WAL Streaming Replication
# =============================================================================
echo "Starting standby node replication backup bootstrap..."

# Wait until the primary database becomes healthy
until pg_isready -h medflow_postgres_primary -p 5432 -U medflow_user; do
  echo "Waiting for primary PostgreSQL master to start and accept connections..."
  sleep 3
done

# Wipe any pre-existing local data to prevent base backup conflicts
rm -rf /var/lib/postgresql/data/*

echo "Initiating base backup from primary database..."
PGPASSWORD=super_secure_replication_password pg_basebackup \
  -h medflow_postgres_primary \
  -D /var/lib/postgresql/data \
  -U replication_user \
  -v \
  -P \
  -X stream \
  -Fp \
  -R

echo "Replication standby base backup completed successfully."
echo "Activating hot_standby signal..."
touch /var/lib/postgresql/data/standby.signal

# Restart engine in standby replica mode
exec postgres -c hot_standby=on
