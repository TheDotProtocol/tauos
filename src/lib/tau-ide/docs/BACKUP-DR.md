# Tau IDE — Backup & Disaster Recovery

## PostgreSQL (Primary)

Tau IDE stores projects, files, AI memory, secrets, teams, and jobs in PostgreSQL.

### Recommended strategy (Supabase / managed PostgreSQL)

1. **Enable Point-in-Time Recovery (PITR)** on your Supabase/production project
2. **Daily automated backups** (Supabase Pro includes daily backups)
3. **Retention:** minimum 7 days for beta, 30 days for production

### Manual backup

```bash
pg_dump "$DATABASE_URL" --no-owner --format=custom --file=tau-ide-backup-$(date +%Y%m%d).dump
```

### Restore

```bash
pg_restore --clean --if-exists --dbname="$DATABASE_URL" tau-ide-backup-YYYYMMDD.dump
```

After restore, verify:

```bash
cd /Users/mac/Downloads/tauos && npm run tau-ide:setup
curl -s http://localhost:3000/api/tau-ide/status | python3 -m json.tool
```

## File fallback (`.data/tau-ide/`)

When `DATABASE_URL` is unavailable, server modules fall back to `.data/tau-ide/` on disk.

- **Backup:** include `.data/tau-ide/` in server filesystem backups
- **Not recommended for production** — use PostgreSQL

## Secrets

- Project secrets are encrypted with `TAU_IDE_SECRETS_KEY`
- **Critical:** back up the encryption key separately (password manager / secrets vault)
- Losing the key = secrets cannot be decrypted

## Recovery procedures

| Scenario | Action |
|----------|--------|
| DB corruption | Restore from PITR or latest dump |
| Lost encryption key | Re-enter project secrets (GITHUB_TOKEN, etc.) |
| Region outage | Failover to replica / restore in new region |
| Accidental project delete | Restore from version history (`tau_ide_project_versions`) |

## Verification schedule

- Weekly: confirm backup job succeeded
- Monthly: test restore to staging database
