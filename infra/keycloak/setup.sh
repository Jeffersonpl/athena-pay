#!/bin/sh
set -e

KCADM=/opt/keycloak/bin/kcadm.sh
SERVER=http://keycloak:8080

echo "[KC-SETUP] Waiting for Keycloak (kcadm login loop)..."
until $KCADM config credentials --server "$SERVER" --realm master --user "$KEYCLOAK_ADMIN" --password "$KEYCLOAK_ADMIN_PASSWORD" >/dev/null 2>&1; do
  sleep 2
done
echo "[KC-SETUP] Connected to Keycloak."

# Create realm athena if missing
if ! $KCADM get realms/athena >/dev/null 2>&1; then
  echo "[KC-SETUP] Creating realm athena"
  $KCADM create realms -s realm=athena -s enabled=true
fi

ensure_client () {
  CID="$1"
  REDIR="$2"

  CID_INTERNAL=$($KCADM get clients -r athena -q clientId="$CID" | grep '"id" : "' | head -n1 | sed -E 's/.*"id" : "([^"]+)".*/\1/')
  if [ -z "$CID_INTERNAL" ]; then
    echo "[KC-SETUP] Creating client $CID"
    $KCADM create clients -r athena -s clientId="$CID" -s protocol=openid-connect -s publicClient=true -s standardFlowEnabled=true -s directAccessGrantsEnabled=true
    CID_INTERNAL=$($KCADM get clients -r athena -q clientId="$CID" | grep '"id" : "' | head -n1 | sed -E 's/.*"id" : "([^"]+)".*/\1/')
  fi
  if [ -n "$CID_INTERNAL" ]; then
    echo "[KC-SETUP] Updating client $CID ($CID_INTERNAL) redirects/origins"
    $KCADM update clients/$CID_INTERNAL -r athena       -s "redirectUris=[\"$REDIR/*\"]"       -s 'webOrigins=["+"]'       -s 'attributes={"post.logout.redirect.uris":"+"}'
  else
    echo "[KC-SETUP] WARN: could not resolve internal id for $CID"
  fi
}

ensure_client "web-client" "http://localhost:5174"
ensure_client "admin-web" "http://localhost:5173"
ensure_client "mobile-app" "athenapay://"

# Users (DEV)
ensure_user () {
  U="$1"; P="$2"
  FOUND=$($KCADM get users -r athena -q username="$U" | grep -c '"username" : "' || true)
  if [ "$FOUND" -eq 0 ]; then
    echo "[KC-SETUP] Creating user $U"
    $KCADM create users -r athena -s username="$U" -s enabled=true -s email="$U@example.com" -s emailVerified=true || true
  fi
  KC_USER_ID=$($KCADM get users -r athena -q username="$U" | grep '"id" : "' | head -n1 | sed -E 's/.*"id" : "([^"]+)".*/\1/')
  if [ -n "$KC_USER_ID" ]; then
    $KCADM set-password -r athena --userid "$KC_USER_ID" --new-password "$P" --temporary=false
  else
    echo "[KC-SETUP] WARN: no id for user $U"
  fi
}

ensure_user "admin-dev" "Admin#123"
ensure_user "user-dev" "User#123"

# Headers (DEV) via JSON payload for compatibility
cat >/tmp/kc_headers.json <<'JSON'
{ "browserSecurityHeaders": {
    "xContentTypeOptions": "nosniff",
    "xRobotsTag": "none",
    "xFrameOptions": "",
    "contentSecurityPolicy": "frame-ancestors 'self' http://localhost:5173 http://localhost:5174"
  }
}
JSON
$KCADM update realms/athena -f /tmp/kc_headers.json

echo "[KC-SETUP] Done."
