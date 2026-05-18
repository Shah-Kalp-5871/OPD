#!/bin/bash
# =============================================================================
# MedFlow OPD — Automated Out-of-Region Backup Sync Script
# Syncs local encrypted database backups to secure, HIPAA-compliant S3 / R2 buckets.
# =============================================================================
# Usage:
#   ./scripts/backup-sync.sh
#
# Setup cron:
#   # Sync hourly / daily backups to object storage at 2:30 AM (after local backup)
#   30 2 * * * /path/to/medflow/scripts/backup-sync.sh >> /var/log/medflow-backup-sync.log 2>&1
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
BACKUP_ROOT="${BACKUP_DIR:-/var/backups/medflow}"
S3_BUCKET="${BACKUP_S3_BUCKET:-medflow-vault-backups}"
S3_REGION="${BACKUP_S3_REGION:-us-east-1}"
S3_ENDPOINT="${BACKUP_S3_ENDPOINT:-}" # Supports custom Cloudflare R2/MinIO endpoints
DRY_RUN="${SYNC_DRY_RUN:-false}"

# ── Logging ───────────────────────────────────────────────────────────────────
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SYNC] $*"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2
}

# ── Pre-flight Checks ─────────────────────────────────────────────────────────
log "Starting MedFlow out-of-region backup sync..."

if ! command -v aws &>/dev/null; then
    error "AWS CLI (aws) is not installed. Unable to sync backups."
    exit 1
fi

if [ -z "$S3_BUCKET" ]; then
    error "BACKUP_S3_BUCKET environment variable is not defined. Cannot proceed."
    exit 1
fi

# ── Construct AWS CLI arguments ────────────────────────────────────────────────
AWS_ARGS=()
if [ -n "$S3_ENDPOINT" ]; then
    AWS_ARGS+=(--endpoint-url "$S3_ENDPOINT")
fi
if [ -n "$S3_REGION" ]; then
    AWS_ARGS+=(--region "$S3_REGION")
fi

# ── Perform Syncing ───────────────────────────────────────────────────────────
# We sync both daily/ and weekly/ folders to the bucket subdirectories
for TYPE in "daily" "weekly"; do
    LOCAL_DIR="$BACKUP_ROOT/$TYPE"
    S3_TARGET="s3://$S3_BUCKET/$TYPE"

    if [ ! -d "$LOCAL_DIR" ]; then
        log "Local directory $LOCAL_DIR does not exist. Skipping."
        continue
    fi

    log "Syncing local $TYPE backups to $S3_TARGET..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "[DRY RUN] Would execute: aws s3 sync \"$LOCAL_DIR\" \"$S3_TARGET\" ${AWS_ARGS[*]} --exclude \"*\" --include \"*.enc\" --include \"*.sql.gz\""
    else
        # We only sync .enc (encrypted) or .gz files, avoiding syncing symlinks or temp files
        if aws s3 sync "$LOCAL_DIR" "$S3_TARGET" "${AWS_ARGS[@]}" \
            --exclude "*" \
            --include "*.enc" \
            --include "*.sql.gz" \
            --no-follow-symlinks; then
            log "Successfully synchronized $TYPE backups."
        else
            error "Failed to sync $TYPE backups to S3 storage!"
            exit 1
        fi
    fi
done

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "MedFlow Out-of-Region Backup Sync Complete"
log "  Target Bucket:  $S3_BUCKET"
log "  Status:         SUCCESS"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
