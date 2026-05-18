#!/bin/bash
# =============================================================================
# MedFlow OPD — PostgreSQL Automated Backup Script
# =============================================================================
# Usage:
#   ./scripts/backup.sh                     (manual backup)
#   ./scripts/backup.sh --type weekly       (weekly backup)
#   ./scripts/backup.sh --dry-run           (test without backing up)
#
# Setup cron (on host):
#   # Daily backup at 2:00 AM
#   0 2 * * * /path/to/medflow/scripts/backup.sh >> /var/log/medflow-backup.log 2>&1
#   # Weekly backup on Sunday at 3:00 AM
#   0 3 * * 0 /path/to/medflow/scripts/backup.sh --type weekly >> /var/log/medflow-backup.log 2>&1
#
# =============================================================================

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment variables if .env.production exists
if [ -f "$PROJECT_DIR/.env.production" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env.production" | xargs)
fi

# Override with direct environment variables if set
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-medflow_db}"
DB_USER="${POSTGRES_USER:-medflow}"
DB_PASS="${POSTGRES_PASSWORD:-}"

# Backup storage
BACKUP_ROOT="${BACKUP_DIR:-/var/backups/medflow}"
DAILY_DIR="$BACKUP_ROOT/daily"
WEEKLY_DIR="$BACKUP_ROOT/weekly"

# Retention
DAILY_RETENTION_DAYS=14    # Keep 2 weeks of daily backups
WEEKLY_RETENTION_WEEKS=8   # Keep 8 weeks of weekly backups

# Timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_LABEL=$(date +%Y-%m-%d)

# ── Parse Arguments ───────────────────────────────────────────────────────────
BACKUP_TYPE="daily"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --type) BACKUP_TYPE="$2"; shift 2 ;;
        --dry-run) DRY_RUN=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# ── Logging ───────────────────────────────────────────────────────────────────
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [BACKUP] $*"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2
}

# ── Pre-flight Checks ─────────────────────────────────────────────────────────
log "Starting MedFlow PostgreSQL backup — type: $BACKUP_TYPE"

if [ -z "$DB_PASS" ]; then
    error "POSTGRES_PASSWORD is not set. Cannot proceed."
    exit 1
fi

if ! command -v pg_dump &>/dev/null && ! command -v docker &>/dev/null; then
    error "Neither pg_dump nor docker is available. Cannot create backup."
    exit 1
fi

# ── Create Backup Directories ─────────────────────────────────────────────────
if [ "$BACKUP_TYPE" = "weekly" ]; then
    BACKUP_DIR_TARGET="$WEEKLY_DIR"
    BACKUP_FILENAME="medflow_weekly_${TIMESTAMP}.sql.gz"
else
    BACKUP_DIR_TARGET="$DAILY_DIR"
    BACKUP_FILENAME="medflow_daily_${TIMESTAMP}.sql.gz"
fi

if [ "$DRY_RUN" = false ]; then
    mkdir -p "$BACKUP_DIR_TARGET"
fi

BACKUP_PATH="$BACKUP_DIR_TARGET/$BACKUP_FILENAME"
log "Backup target: $BACKUP_PATH"

# ── Perform Backup ────────────────────────────────────────────────────────────
if [ "$DRY_RUN" = true ]; then
    log "[DRY RUN] Would execute pg_dump for $DB_NAME at $DB_HOST:$DB_PORT"
    log "[DRY RUN] Would write compressed backup to: $BACKUP_PATH"
    exit 0
fi

log "Connecting to PostgreSQL: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

# Try Docker exec first (if running in Docker environment)
if docker ps --filter "name=medflow_postgres" --format "{{.Names}}" 2>/dev/null | grep -q medflow_postgres; then
    log "Using Docker exec for backup..."
    PGPASSWORD="$DB_PASS" docker exec medflow_postgres \
        pg_dump -U "$DB_USER" -d "$DB_NAME" \
        --format=plain \
        --no-password \
        --verbose \
        --clean \
        --if-exists \
        --create \
        2>/dev/null | gzip > "$BACKUP_PATH"
else
    log "Using local pg_dump for backup..."
    PGPASSWORD="$DB_PASS" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --format=plain \
        --no-password \
        --verbose \
        --clean \
        --if-exists \
        --create \
        2>/dev/null | gzip > "$BACKUP_PATH"
fi

# Verify backup was created and has content
if [ ! -f "$BACKUP_PATH" ]; then
    error "Backup file was not created!"
    exit 1
fi

BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
if [ "$(stat -f%z "$BACKUP_PATH" 2>/dev/null || stat -c%s "$BACKUP_PATH")" -lt 1024 ]; then
    error "Backup file is suspiciously small (< 1KB). Backup may have failed."
    exit 1
fi

log "Backup created successfully: $BACKUP_FILENAME (size: $BACKUP_SIZE)"

# ── Create Latest Symlink ─────────────────────────────────────────────────────
LATEST_LINK="$BACKUP_DIR_TARGET/latest.sql.gz"
ln -sf "$BACKUP_PATH" "$LATEST_LINK"
log "Updated latest symlink: $LATEST_LINK → $BACKUP_PATH"

# ── Verify Backup Integrity (test gunzip) ─────────────────────────────────────
if gunzip -t "$BACKUP_PATH" 2>/dev/null; then
    log "Backup integrity check: PASSED"
else
    error "Backup integrity check: FAILED — backup file may be corrupted"
    exit 1
fi

# ── Retention Cleanup ─────────────────────────────────────────────────────────
log "Running retention cleanup..."

if [ "$BACKUP_TYPE" = "weekly" ]; then
    RETENTION_DAYS=$((WEEKLY_RETENTION_WEEKS * 7))
    log "Removing weekly backups older than $WEEKLY_RETENTION_WEEKS weeks ($RETENTION_DAYS days)..."
    find "$WEEKLY_DIR" -name "medflow_weekly_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete -print | \
        while read -r f; do log "Removed old backup: $(basename "$f")"; done
else
    log "Removing daily backups older than $DAILY_RETENTION_DAYS days..."
    find "$DAILY_DIR" -name "medflow_daily_*.sql.gz" -mtime +"$DAILY_RETENTION_DAYS" -delete -print | \
        while read -r f; do log "Removed old backup: $(basename "$f")"; done
fi

log "Retention cleanup complete."

# ── Summary ───────────────────────────────────────────────────────────────────
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "MedFlow Backup Complete"
log "  Type:     $BACKUP_TYPE"
log "  File:     $BACKUP_FILENAME"
log "  Size:     $BACKUP_SIZE"
log "  Path:     $BACKUP_PATH"
log "  Status:   SUCCESS"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
