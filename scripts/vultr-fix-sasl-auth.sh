#!/bin/bash
# Fix Postfix SASL auth on port 587 (run as root on Vultr mail server)
set -euo pipefail

HOSTNAME="${HOSTNAME_FQDN:-mail.tauos.org}"
RELAY_USER="${RELAY_USER:-taumail-relay}"
RELAY_PASS="${RELAY_PASS:-}"

if [[ -z "$RELAY_PASS" && -f /root/taumail-smtp-credentials.txt ]]; then
  RELAY_PASS=$(grep '^SMTP_PASS=' /root/taumail-smtp-credentials.txt | cut -d= -f2-)
fi

if [[ -z "$RELAY_PASS" ]]; then
  echo "Set RELAY_PASS or ensure /root/taumail-smtp-credentials.txt exists."
  exit 1
fi

echo "==> Recreating SASL user (no trailing newline)"
saslpasswd2 -d -u "$HOSTNAME" "$RELAY_USER" 2>/dev/null || true
printf '%s' "$RELAY_PASS" | saslpasswd2 -c -p -u "$HOSTNAME" "$RELAY_USER"
sasldblistusers2

echo "==> SASL config"
mkdir -p /etc/postfix/sasl /etc/sasl2
cat > /etc/postfix/sasl/smtpd.conf <<'EOF'
pwcheck_method: auxprop
auxprop_plugin: sasldb
mech_list: PLAIN LOGIN
EOF
cp /etc/postfix/sasl/smtpd.conf /etc/sasl2/smtpd.conf

chown root:sasl /etc/sasldb2
chmod 640 /etc/sasldb2
usermod -aG sasl postfix 2>/dev/null || true

echo "==> Disable chroot on submission (587) so smtpd can read sasldb"
if grep -q '^submission inet' /etc/postfix/master.cf; then
  sed -i '/^submission inet/s/\t y \t/\t n \t/; /^submission inet/s/ -       y / -       n /' /etc/postfix/master.cf
else
  cat >> /etc/postfix/master.cf <<'EOF'

submission inet n       -       n       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
EOF
fi

echo "==> Copy sasldb into Postfix chroot (belt-and-suspenders)"
mkdir -p /var/spool/postfix/etc/sasl2
cp /etc/sasldb2 /var/spool/postfix/etc/sasldb2
cp /etc/sasl2/smtpd.conf /var/spool/postfix/etc/sasl2/smtpd.conf
chown root:sasl /var/spool/postfix/etc/sasldb2
chmod 640 /var/spool/postfix/etc/sasldb2

postfix check
systemctl restart postfix

echo ""
echo "==> Test with swaks:"
echo "swaks --to test@gmail.com --from test@tauos.org \\"
echo "  --server 127.0.0.1:587 \\"
echo "  --auth-user ${RELAY_USER}@${HOSTNAME} \\"
echo "  --auth-password '<SMTP_PASS>' --tls"
