#!/bin/bash
# EduEquity Quick Start: Next.js + Cloudflare Tunnel
# All-in-one script with proper process management

set -e

WEB_DIR="/home/vinoth22/eduequity/eduequity-os/apps/web"
WEB_LOG="/tmp/web.log"
TUNNEL_LOG="/tmp/tunnel.log"

echo "=========================================="
echo "EduEquity Quick Start"
echo "=========================================="

# 1. Kill old processes
echo "[1/6] Killing old processes..."
pkill -f "next-server" 2>/dev/null || true
pkill -f cloudflared 2>/dev/null || true
sleep 2

# 2. Start Next.js on 127.0.0.1:3000
echo "[2/6] Starting Next.js on 127.0.0.1:3000..."
cd "$WEB_DIR"
nohup pnpm dev -- -H 127.0.0.1 -p 3000 > "$WEB_LOG" 2>&1 &

# 3. Confirm port 3000 is listening
echo "[3/6] Confirming port 3000 is listening..."
for i in {1..15}; do
    if ss -tlnp | grep -q ":3000"; then
        echo "✓ Port 3000 is listening on 127.0.0.1"
        break
    fi
    sleep 1
done

# 4. Start Cloudflare tunnel
echo "[4/6] Starting Cloudflare tunnel..."
nohup cloudflared tunnel --url http://127.0.0.1:3000 > "$TUNNEL_LOG" 2>&1 &

# 5. Print tunnel URL using grep from logs
echo "[5/6] Getting tunnel URL..."
sleep 8
TUNNEL_URL=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$TUNNEL_LOG" 2>/dev/null | tail -1)
echo ""
echo "=========================================="
echo "🌐 PUBLIC URL: $TUNNEL_URL"
echo "=========================================="
echo ""

# 6. Verify using curl -I both local and public
echo "[6/6] Health verification..."
echo -n "Local (127.0.0.1:3000): "
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 | grep -q "200" && echo "✓ HTTP 200" || echo "✗ FAILED"

echo -n "Public ($TUNNEL_URL): "
curl -s -o /dev/null -w "%{http_code}" "$TUNNEL_URL" | grep -q "200" && echo "✓ HTTP 200" || echo "✗ FAILED"

echo ""
echo "=========================================="
echo "Logs:"
echo "  Web:    $WEB_LOG"
echo "  Tunnel: $TUNNEL_LOG"
echo "=========================================="

