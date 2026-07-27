#!/bin/bash
# Tau Mail — Vultr production Postfix setup (multi-domain → Vercel API)
# Run as root on Ubuntu 22.04: bash vultr-production-mail-setup.sh
set -euo pipefail

TAUMAIL_API_URL="${TAUMAIL_API_URL:-https://www.tauos.org/api/taumail/smtp/incoming}"
HOSTNAME="${HOSTNAME_FQDN:-mail.tauos.org}"
RELAY_USER="${RELAY_USER:-taumail-relay}"
RELAY_PASS="${RELAY_PASS:-$(openssl rand -base64 24)}"

DOMAINS=(
  tauos.org
  taumail.org
  thearholdings.group
  estayshotels.com
  globaldotbank.com
  onenumbr.com
  kibouor.com
  tauphones.com
  easaanfoundation.com
  projectgrayscale.com
  thedotprotocol.com
  asktrabaajo.com
)

echo "=============================================="
echo " Tau Mail — Vultr Postfix Setup"
echo " Hostname: $HOSTNAME"
echo " Inbound API: $TAUMAIL_API_URL"
echo " Domains: ${DOMAINS[*]}"
echo "=============================================="

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y postfix postfix-pcre libsasl2-modules sasl2-bin \
  opendkim opendkim-tools certbot python3 curl ca-certificates

hostnamectl set-hostname "$HOSTNAME"

# --- SASL for outbound relay (Vercel → :587) ---
# Use printf (not echo) — echo adds a newline that breaks SASL password checks
printf '%s' "$RELAY_PASS" | saslpasswd2 -c -p -u "$HOSTNAME" "$RELAY_USER"
mkdir -p /etc/postfix/sasl /etc/sasl2
cat > /etc/postfix/sasl/smtpd.conf <<EOF
pwcheck_method: auxprop
auxprop_plugin: sasldb
mech_list: PLAIN LOGIN
EOF
cp /etc/postfix/sasl/smtpd.conf /etc/sasl2/smtpd.conf
chown root:sasl /etc/sasldb2 2>/dev/null || true
chmod 640 /etc/sasldb2 2>/dev/null || true
usermod -aG sasl postfix 2>/dev/null || true
chmod 700 /etc/postfix/sasl
postfix set-permissions

# smtpd on :587 must read sasldb (copy into chroot as well)
mkdir -p /var/spool/postfix/etc/sasl2
cp /etc/sasldb2 /var/spool/postfix/etc/sasldb2
cp /etc/sasl2/smtpd.conf /var/spool/postfix/etc/sasl2/smtpd.conf
chown root:sasl /var/spool/postfix/etc/sasldb2
chmod 640 /var/spool/postfix/etc/sasldb2

DOMAIN_LIST=$(IFS=,; echo "${DOMAINS[*]}")

# --- Postfix main.cf ---
cat > /etc/postfix/main.cf <<EOF
# Tau Mail production — $(date -Iseconds)
smtpd_banner = \$myhostname ESMTP Tau Mail TAU CORE
biff = no
append_dot_mydomain = no
readme_directory = no
compatibility_level = 3.6

myhostname = $HOSTNAME
myorigin = tauos.org
mydestination = localhost
mynetworks = 127.0.0.0/8 [::1]/128
inet_interfaces = all
inet_protocols = ipv4

# Hosted domains — inbound accepted, stored via API pipe
virtual_mailbox_domains = $DOMAIN_LIST
virtual_mailbox_maps = pcre:/etc/postfix/virtual_mailbox.pcre
virtual_transport = taumail
virtual_minimum_uid = 65534
virtual_uid_maps = static:65534
virtual_gid_maps = static:65534

# Outbound TLS
smtp_tls_security_level = may
smtp_tls_CApath = /etc/ssl/certs
smtpd_tls_security_level = may
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key

# Submission auth (port 587) for Vercel relay
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = cyrus
smtpd_sasl_path = smtpd
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = \$myhostname
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination

# Size limits
message_size_limit = 26214400
mailbox_size_limit = 0

maillog_file = /var/log/mail.log
EOF

# Catch-all virtual mailboxes for hosted domains
cat > /etc/postfix/virtual_mailbox.pcre <<'PCRE'
# Accept any local part on hosted domains
/^(?i)([^@]+@tauos.org)$/          tauos/$1
/^(?i)([^@]+@taumail.org)$/        taumail/$1
/^(?i)([^@]+@thearholdings.group)$/ ar/$1
/^(?i)([^@]+@estayshotels.com)$/    estays/$1
/^(?i)([^@]+@globaldotbank.com)$/  gdb/$1
/^(?i)([^@]+@onenumbr.com)$/        onenumbr/$1
/^(?i)([^@]+@kibouor.com)$/         kibouor/$1
PCRE

# --- Inbound pipe transport ---
install -m 755 "$(dirname "$0")/taumail-inbound.py" /usr/local/bin/taumail-inbound.py

grep -q '^taumail' /etc/postfix/master.cf || cat >> /etc/postfix/master.cf <<'EOF'

# Tau Mail — pipe inbound to Vercel API
taumail   unix  -       n       n       -       -       pipe
  flags=FRX user=nobody argv=/usr/local/bin/taumail-inbound.py ${recipient} ${sender}
EOF

# Ensure submission port 587 is enabled
grep -q '^submission' /etc/postfix/master.cf || cat >> /etc/postfix/master.cf <<'EOF'

submission inet n       -       n       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
EOF

# Environment for inbound script
cat > /etc/default/taumail-inbound <<EOF
TAUMAIL_INBOUND_URL=$TAUMAIL_API_URL
EOF
# Postfix pipe doesn't load /etc/default — set in script wrapper
cat > /usr/local/bin/taumail-inbound-wrapper.sh <<WRAP
#!/bin/bash
export TAUMAIL_INBOUND_URL="$TAUMAIL_API_URL"
exec /usr/local/bin/taumail-inbound.py "\$@"
WRAP
chmod 755 /usr/local/bin/taumail-inbound-wrapper.sh
sed -i 's|argv=/usr/local/bin/taumail-inbound.py|argv=/usr/local/bin/taumail-inbound-wrapper.sh|' /etc/postfix/master.cf

postfix check
systemctl enable postfix
systemctl restart postfix

# Save credentials for Vercel
CREDS_FILE=/root/taumail-smtp-credentials.txt
cat > "$CREDS_FILE" <<EOF
# Add these to Vercel → Settings → Environment Variables (Production)
MAIL_TRANSPORT=smtp
SMTP_HOST=$(curl -4 -s ifconfig.me || hostname -I | awk '{print $1}')
SMTP_PORT=587
SMTP_USER=$RELAY_USER
SMTP_REALM=$HOSTNAME
SMTP_PASS=$RELAY_PASS
SMTP_SECURE=false

# Inbound API (already configured on this server)
TAUMAIL_INBOUND_URL=$TAUMAIL_API_URL
EOF
chmod 600 "$CREDS_FILE"

echo ""
echo "=============================================="
echo " SETUP COMPLETE"
echo "=============================================="
echo ""
echo "SMTP relay credentials saved to: $CREDS_FILE"
echo ""
cat "$CREDS_FILE"
echo ""
echo "Next steps:"
echo "  1. Add SMTP_* vars to Vercel and redeploy"
echo "  2. Remove OLD MX record pointing to 136.244.83.147 (if still present)"
echo "  3. Run: npm run mail:setup (from your Mac)"
echo "  4. Test: register at /taumail, send mail"
echo ""
postfix status
