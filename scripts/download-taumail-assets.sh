#!/usr/bin/env bash
# Download Tau Mail Figma assets locally
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$ROOT/public/taumail"
FIGMA_BASE="https://www.figma.com/api/mcp/asset"

download() {
  local url="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL "$url" -o "$dest"
  echo "  ✓ $(basename "$dest")"
}

echo "Downloading Tau Mail assets to public/taumail/..."

# Brand
download "$FIGMA_BASE/bfda8728-c666-4d88-899e-291a910ac77e.png" "$BASE/brand/logo-icon.png"
download "$FIGMA_BASE/a5e6dcd6-667b-4ab2-adfb-20395edcd80f.svg" "$BASE/auth/glow-backdrop.svg"
download "$FIGMA_BASE/e4c38363-14a2-47c5-b0df-aeea994682a4.svg" "$BASE/auth/checkmark.svg"
download "$FIGMA_BASE/c9aca06b-d21d-4d63-8893-e5811c598a96.svg" "$BASE/shared/line.svg"

# Avatars
download "$FIGMA_BASE/4f4560ff-f940-44b6-8ba5-367340483411.png" "$BASE/avatars/user-sidebar.png"
download "$FIGMA_BASE/6daccde4-dd40-420f-ab0e-5e9acb035997.png" "$BASE/avatars/user-topbar.png"
download "$FIGMA_BASE/3214bbbd-4f15-48ba-a4dc-da2390ed50eb.png" "$BASE/avatars/sender-1.png"
download "$FIGMA_BASE/cca7aa87-8984-4e8f-a6d9-d25e8d9b9efe.png" "$BASE/avatars/sender-2.png"
download "$FIGMA_BASE/4df5864e-70a0-4dbc-b8a5-bedd0bb64936.png" "$BASE/avatars/sender-3.png"
download "$FIGMA_BASE/6670c6a3-9eda-4a31-bb17-c6450f4760a8.png" "$BASE/avatars/sender-4.png"
download "$FIGMA_BASE/73909669-dd3a-46ff-9918-2ca7af804b3a.png" "$BASE/avatars/sender-large.png"

# Nav icons
download "$FIGMA_BASE/8c727bff-9541-4605-be51-6f78aef93af2.svg" "$BASE/icons/chart-column.svg"
download "$FIGMA_BASE/fe317f4d-caa8-4bb8-a6f8-701f03202c54.svg" "$BASE/icons/mail.svg"
download "$FIGMA_BASE/b5aa868c-3cb0-4ef0-aa18-2ad04a9bdbb7.svg" "$BASE/icons/edit-3.svg"
download "$FIGMA_BASE/1c596adb-fa83-4a14-a188-3581b3a2d21f.svg" "$BASE/icons/calendar.svg"
download "$FIGMA_BASE/0fdf0a81-2699-409d-bd12-44a87ef368d6.svg" "$BASE/icons/users-round.svg"
download "$FIGMA_BASE/9bbc985d-8c0c-496d-9131-b76e5d73858a.svg" "$BASE/icons/list-checks.svg"
download "$FIGMA_BASE/baf8677c-25f3-4a26-b70b-521db16ba07f.svg" "$BASE/icons/wand-sparkles.svg"
download "$FIGMA_BASE/ad5d90ac-81ed-4309-a7eb-dfd5d6ba348c.svg" "$BASE/icons/database.svg"
download "$FIGMA_BASE/721a4463-fce3-49c9-a436-d7d74a822d96.svg" "$BASE/icons/settings.svg"
download "$FIGMA_BASE/06c0aed2-fd48-4916-8ec2-80718bef69e5.svg" "$BASE/icons/bell-ring.svg"

# UI icons
download "$FIGMA_BASE/e2aaa5ec-b3fe-4338-8380-0cd55d6b198d.svg" "$BASE/icons/ellipse-gold.svg"
download "$FIGMA_BASE/c26539aa-07c3-4c32-8845-3f6367592eab.svg" "$BASE/shared/divider-line.svg"
download "$FIGMA_BASE/eac549fc-25d2-459a-b049-ff10723e3d37.svg" "$BASE/icons/search.svg"
download "$FIGMA_BASE/aecccb98-6891-43ea-9b00-5674aeebe6d3.svg" "$BASE/icons/ellipse-status.svg"
download "$FIGMA_BASE/18f7d86f-683f-43fb-8d9d-7e7313b3061a.svg" "$BASE/icons/bell-dot.svg"
download "$FIGMA_BASE/1f92afcd-48bc-439d-8c83-aee7f99094ea.svg" "$BASE/icons/star.svg"
download "$FIGMA_BASE/bc31ac44-2f7a-4b1d-be93-c483cb92bd91.svg" "$BASE/icons/paperclip.svg"
download "$FIGMA_BASE/ed3f52c6-3724-4feb-b100-88616718654a.svg" "$BASE/icons/arrow-up-left.svg"
download "$FIGMA_BASE/3fffb613-d5e6-4986-b1be-94cdca05ea70.svg" "$BASE/icons/arrow-up-right.svg"
download "$FIGMA_BASE/5cc6461b-0d96-4ec9-9109-731fc0952296.svg" "$BASE/icons/package.svg"
download "$FIGMA_BASE/dea0d6c8-c697-42df-9f4b-7959735f28ae.svg" "$BASE/icons/trash.svg"
download "$FIGMA_BASE/fa61195f-3796-41de-b69e-ff58cc4e4dd2.svg" "$BASE/icons/star-off.svg"
download "$FIGMA_BASE/92a01b74-bb52-4f8d-8f5c-1f0cd7bdcfee.svg" "$BASE/icons/sparkles.svg"
download "$FIGMA_BASE/f35f5b6b-1aa8-44e9-91e4-dd7e53e2834f.svg" "$BASE/icons/file.svg"

# Dashboard / compose / auth extras
download "$FIGMA_BASE/00ea2731-6462-4285-938b-317cfe505760.svg" "$BASE/icons/edit.svg"
download "$FIGMA_BASE/e69ec7c6-4bbe-496d-af63-4f77a835360e.svg" "$BASE/icons/calendar-plus.svg"
download "$FIGMA_BASE/8972d33f-a6ff-45c2-adac-4d9ca3a40d98.svg" "$BASE/icons/check-square.svg"
download "$FIGMA_BASE/cbbb9569-923f-4ac5-bbdf-f837cffcd8a5.svg" "$BASE/icons/clock.svg"
download "$FIGMA_BASE/24cde001-ad68-4884-89e9-b55790e14be3.svg" "$BASE/icons/toggle.svg"
download "$FIGMA_BASE/cf92682a-549b-4034-89fb-78ce7b1528cb.svg" "$BASE/icons/status-success.svg"
download "$FIGMA_BASE/8fae3552-534e-4393-a824-9f926720cad0.svg" "$BASE/icons/status-danger.svg"
download "$FIGMA_BASE/44b5cf6b-b0e0-4c6c-b85f-3805dad75e51.svg" "$BASE/auth/nodes-tl.svg"
download "$FIGMA_BASE/83f20573-9535-4a02-a08e-d53099efaf13.svg" "$BASE/auth/nodes-br.svg"
download "$FIGMA_BASE/17965030-c765-4af3-9adf-d3821e644baa.svg" "$BASE/icons/lock.svg"
download "$FIGMA_BASE/737e618e-b271-4f3a-b34b-2fdb6b728022.svg" "$BASE/icons/shield-alert.svg"
download "$FIGMA_BASE/e29a3799-1d55-46f8-82ab-b4c6c7e7413b.svg" "$BASE/icons/send.svg"
download "$FIGMA_BASE/8be90510-904b-4839-b636-337253de89d8.svg" "$BASE/icons/chevron-down.svg"
download "$FIGMA_BASE/fc610cc3-1611-4710-b37e-2d369b40fee5.svg" "$BASE/icons/x-circle.svg"
download "$FIGMA_BASE/126bfd2c-0d11-4bdb-ad7c-0b0a11ba4ab2.svg" "$BASE/icons/bold.svg"
download "$FIGMA_BASE/947b6050-bb75-4965-aa78-67e0394ea6e7.svg" "$BASE/icons/italic.svg"
download "$FIGMA_BASE/50794087-8e56-4cda-865e-1276678be409.svg" "$BASE/icons/underline.svg"
download "$FIGMA_BASE/ea31d20e-2a2e-4224-a736-83efae4bad2f.svg" "$BASE/icons/strikethrough.svg"
download "$FIGMA_BASE/e104c961-fbdf-4e98-a559-049c5e539c1a.svg" "$BASE/icons/align-left.svg"
download "$FIGMA_BASE/e6fadd39-4646-47a4-8fab-cdb5ccb48856.svg" "$BASE/icons/align-center.svg"
download "$FIGMA_BASE/a6ef8d7d-4619-43a5-af85-02af06095f7f.svg" "$BASE/icons/align-right.svg"
download "$FIGMA_BASE/ac5e313e-eba8-482a-b388-8092c35cc340.svg" "$BASE/icons/list.svg"
download "$FIGMA_BASE/1af4c12d-432d-4d78-aedb-8894ffbcd366.svg" "$BASE/icons/list-ordered.svg"
download "$FIGMA_BASE/f2044387-856b-4e17-b067-9d873aff63d2.svg" "$BASE/icons/link.svg"
download "$FIGMA_BASE/311660b3-31fb-43a6-9a9b-bc074a5a1200.svg" "$BASE/icons/image.svg"
download "$FIGMA_BASE/91300a67-1df5-4752-b5ad-4486529c19fd.svg" "$BASE/icons/badge-check.svg"

echo "Done. $(find "$BASE" -type f | wc -l | tr -d ' ') assets downloaded."
