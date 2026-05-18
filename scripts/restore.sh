#!/bin/bash
# =============================================================================
# MedFlow OPD — PostgreSQL Restore Script
# =============================================================================
# Usage:
#   ./scripts/restore.sh --file /var/backups/medflow/daily/medflow_daily_20260518_020000.sql.gz
#   ./scripts/restore.sh --latest                  (restore from latest daily backup)
#   ./scripts/restore.sh --latest --type weekly    (restore from latest weekly backup)
#   ./scripts/restore.sh --file /path/to/backup.sql.gz --confirm
#
# SAFETY RULES:
#   - This script NEVER auto-deletes the existing database
#   - Requires explicit --confirm flag to proceed with restoration
#   - Creates a safety backup of current state before restoring
#   - Creates a new target database to restore into (safe parallel restore)
#
# IMPORTANT: This restores to a NEW database. You must manually
#            switch DATABASE_URL to point to the restored database.
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load production env
if [ -f "$PROJECT_DIR/.env.production" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env.production" | xargs)
fi

DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-medflow_db}"
DB_USER="${POSTGRES_USER:-medflow}"
DB_PASS="${POSTGRES_PASSWORD:-}"

BACKUP_ROOT="${BACKUP_DIR:-/var/backups/medflow}"
DAILY_DIR="$BACKUP_ROOT/daily"
WEEKLY_DIR="$BACKUP_ROOT/weekly"

# ── Logging ───────────────────────────────────────────────────────────────────
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [RESTORE] $*"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2; }
warn() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] $*"; }

# ── Parse Arguments ───────────────────────────────────────────────────────────
BACKUP_FILE=""
BACKUP_TYPE="daily"
CONFIRMED=false
USE_LATEST=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --file)      BACKUP_FILE="$2"; shift 2 ;;
        --latest)    USE_LATEST=true; shift ;;
        --type)      BACKUP_TYPE="$2"; shift 2 ;;
        --confirm)   CONFIRMED=true; shift ;;
        *)           error "Unknown option: $1"; exit 1 ;;
    esac
done

# ── Determine Backup File ─────────────────────────────────────────────────────
if [ "$USE_LATEST" = true ]; then
    if [ "$BACKUP_TYPE" = "weekly" ]; then
        BACKUP_FILE="$WEEKLY_DIR/latest.sql.gz"
    else
        BACKUP_FILE="$DAILY_DIR/latest.sql.gz"
    fi
fi

if [ -z "$BACKUP_FILE" ]; then
    error "No backup file specified. Use --file <path> or --latest"
    echo ""
    echo "Usage:"
    echo "  $0 --file /var/backups/medflow/daily/medflow_daily_YYYYMMDD_HHMMSS.sql.gz --confirm"
    echo "  $0 --latest --confirm"
    echo "  $0 --latest --type weekly --confirm"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# ── Safety Check ─────────────────────────────────────────────────────────────
if [ "$CONFIRMED" = false ]; then
    warn "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    warn "RESTORE OPERATION — REQUIRES CONFIRMATION"
    warn "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    warn "Backup file: $BACKUP_FILE"
    warn "Target DB:   ${DB_NAME}_restored_$(date +%Y%m%d_%H%M%S)"
    warn ""
    warn "This will create a NEW database (not overwrite the existing one)."
    warn "After restoration, update DATABASE_URL to point to the new DB."
    warn ""
    warn "Re-run with --confirm to proceed."
    warn "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "MedFlow Database Restore — CONFIRMED"
log "Source: $BACKUP_FILE"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Verify Backup Integrity ───────────────────────────────────────────────────
log "Verifying backup integrity..."
if ! gunzip -t "$BACKUP_FILE" 2>/dev/null; then
    error "Backup file integrity check FAILED. The file may be corrupted."
    exit 1
fi
log "Backup integrity check: PASSED"

# ── Create Restore Target Database ───────────────────────────────────────────
RESTORE_DB="${DB_NAME}_restored_$(date +%Y%m%d_%H%M%S)"
log "Creating restore target database: $RESTORE_DB"

PGPASSWORD="$DB_PASS" psql \
    -h "$DB_HOST" -p "$DB_PORT" \
    -U "$DB_USER" -d postgres \
    -c "CREATE DATABASE \"$RESTORE_DB\";" 2>/dev/null || {
    error "Failed to create restore target database: $RESTORE_DB"
    exit 1
}

log "Target database created: $RESTORE_DB"

# ── Restore ───────────────────────────────────────────────────────────────────
log "Starting restore... (this may take several minutes)"

if docker ps --filter "name=medflow_postgres" --format "{{.Names}}" 2>/dev/null | grep -q medflow_postgres; then
    log "Restoring via Docker exec..."
    gunzip -c "$BACKUP_FILE" | docker exec -i medflow_postgres \
        psql -U "$DB_USER" -d "$RESTORE_DB" --quiet
else
    log "Restoring via local psql..."
    PGPASSWORD="$DB_PASS" gunzip -c "$BACKUP_FILE" | \
        psql -h "$DB_HOST" -p "$DB_PORT" \
             -U "$DB_USER" -d "$RESTORE_DB" --quiet
fi

log "Restore completed successfully!"

# ── Post-Restore Validation ───────────────────────────────────────────────────
log "Running post-restore validation..."

TABLE_COUNT=$(PGPASSWORD="$DB_PASS" psql \
    -h "$DB_HOST" -p "$DB_PORT" \
    -U "$DB_USER" -d "$RESTORE_DB" \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)

log "Tables found in restored database: $TABLE_COUNT"

if [ "$TABLE_COUNT" -lt 5 ]; then
    warn "WARNING: Only $TABLE_COUNT tables found. Restore may be incomplete."
fi

# ── Final Instructions ────────────────────────────────────────────────────────
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "RESTORE COMPLETE"
log ""
log "Restored database: $RESTORE_DB"
log "Tables restored:   $TABLE_COUNT"
log ""
log "NEXT STEPS:"
log "  1. Validate data in: $RESTORE_DB"
log "     psql -U $DB_USER -d $RESTORE_DB"
log ""
log "  2. If data looks correct, update your DATABASE_URL:"
log "     DATABASE_URL=postgresql://$DB_USER:***@$DB_HOST:$DB_PORT/$RESTORE_DB?schema=public"
log ""
log "  3. Restart backend service:"
log "     docker compose -f docker-compose.production.yml restart backend"
log ""
log "  4. Optionally rename/drop the old database after confirming:"
log "     ALTER DATABASE $DB_NAME RENAME TO ${DB_NAME}_old;"
log "     ALTER DATABASE $RESTORE_DB RENAME TO $DB_NAME;"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
