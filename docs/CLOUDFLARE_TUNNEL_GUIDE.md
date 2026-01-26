# Cloudflare Tunnel Guide for Ubuntu (FREE Public URL)

## How to Identify Which Port Your App Uses

Run these commands to find your running services:

```bash
# Check what's running on common ports
ss -tlnp | grep -E "(3000|5173|8000)"

# Or check process names
ps aux | grep -E "next|vite|uvicorn|fastapi|node|python" | head -20

# Alternative: check netstat
netstat -tlnp 2>/dev/null | grep -E "(3000|5173|8000)"
```

**Port Guide for EduEquity Project:**
| Port | Service | Framework | Command to Start |
|------|---------|-----------|------------------|
| 3000 | Next.js Web App | React/Next.js | `pnpm dev` or `npm run dev` (in apps/web) |
| 5173 | Vite Dev Server | Vite/React | `pnpm dev` or `npm run dev` |
| 8000 | Python API | FastAPI/Uvicorn | `uvicorn app.main:app --reload` (in apps/api) |

---

## Step 1: Install cloudflared

```bash
# Download the latest release
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared

# Make it executable
chmod +x /tmp/cloudflared

# Move to system PATH (requires sudo)
sudo mv /tmp/cloudflared /usr/local/bin/cloudflared

# Verify installation
cloudflared --version

# Expected output: cloudflared version X.XX.X
```

**Alternative: Install via apt (if available)**
```bash
# Add Cloudflare repository (optional, more work)
# The wget method above is simpler for quick setup
```

---

## Step 2: Login / Setup (Only If Required)

### Method A: Quick Tunnel (NO LOGIN REQUIRED)

For quick temporary tunnels, **you don't need to login**. Just run the tunnel command directly.

```bash
# No login needed - skip to Step 3
```

### Method B: Persistent Tunnel with Your Domain (FREE)

**Note:** Using your own domain requires:
- A domain you own
- Cloudflare as your DNS provider (FREE)
- A Cloudflare account (FREE)

```bash
# Login to Cloudflare (opens browser)
cloudflared tunnel login

# Follow the browser prompts to authorize
# Select your Cloudflare zone (domain)
# Allow the connection

# Verify login succeeded
cloudflared tunnel list

# Expected output: No tunnels found. (but login is active)
```

**Setup your domain DNS:**
```bash
# After login, your credentials are stored at:
ls ~/.cloudflared/

# Expected files:
# - cert.pem  (your zone credentials)
# - <tunnel-id>.json  (tunnel credentials after creation)
```

---

## Step 3: Start Tunnel

### For Port 3000 (Next.js Web App)

```bash
# Terminal 1: Start your Next.js app (if not running)
cd /home/vinoth22/eduequity/eduequity-os/apps/web
pnpm dev

# Terminal 2: Start cloudflared tunnel
cloudflared tunnel --url http://localhost:3000

# Expected output:
# 2024-01-01T00:00:00Z INF Starting tunnel
# 2024-01-01T00:00:00Z INF Tunnel established at https://random-name.trycloudflare.com
#          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# COPY THIS URL - it's your public link!
```

### For Port 5173 (Vite Dev Server)

```bash
# Terminal 1: Start your Vite app (if not running)
cd /home/vinoth22/eduequity/eduequity-os/apps/web
pnpm dev

# Terminal 2: Start cloudflared tunnel
cloudflared tunnel --url http://localhost:5173

# Expected output:
# 2024-01-01T00:00:00Z INF Starting tunnel
# 2024-01-01T00:00:00Z INF Tunnel established at https://random-name.trycloudflare.com
```

### For Port 8000 (Python FastAPI)

```bash
# Terminal 1: Start your API (if not running)
cd /home/vinoth22/eduequity/eduequity-os/apps/api
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start cloudflared tunnel
cloudflared tunnel --url http://localhost:8000

# Expected output:
# 2024-01-01T00:00:00Z INF Starting tunnel
# 2024-01-01T00:00:00Z INF Tunnel established at https://random-name.trycloudflare.com
```

### Method B: Tunnel with Your Own Domain (Persistent)

```bash
# Create a named tunnel
cloudflared tunnel create eduequity-web

# Expected output:
# 2024-01-01T00:00:00Z INF Created tunnel eduequity-web with id abc123-uuid

# Create config file
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: eduequity-web
credentials-file: /home/vinoth22/.cloudflared/eduequity-web.json

ingress:
  - service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF

# Create DNS record (run in Cloudflare dashboard or via API)
# Type: CNAME, Name: tunnel.yourdomain.com, Target: <tunnel-id>.cfargotunnel.com

# Start the tunnel
cloudflared tunnel run eduequity-web

# Your URL: https://tunnel.yourdomain.com
```

---

## Step 4: Confirm with curl/browser

### Test 1: Verify Tunnel is Active

```bash
# From SAME machine (tests local connection)
curl -s http://localhost:3000 | head -20

# Expected: HTML content of your app

# From REMOTE machine (tests public URL)
curl -I https://random-name.trycloudflare.com

# Expected:
# HTTP/2 200
# content-type: text/html; charset=utf-8
```

### Test 2: Browser Verification

1. Open browser to: `https://random-name.trycloudflare.com`
2. You should see your Next.js/Vite/FastAPI app
3. Check browser DevTools → Network tab
4. All requests should show `cloudflare.com` in the host column

### Test 3: API Endpoint Test (Port 8000)

```bash
# Test health endpoint
curl https://random-name.trycloudflare.com/api/health

# Expected: JSON response from your FastAPI app
# {"status": "healthy"}

# Test another endpoint
curl https://random-name.trycloudflare.com/api/v1/users
```

### Test 4: WebSocket Test (if using websockets)

```bash
# Check WebSocket connection works
wss://random-name.trycloudflare.com/ws

# In browser console:
# const ws = new WebSocket('wss://random-name.trycloudflare.com/ws');
# ws.onopen = () => console.log('WebSocket connected!');
```

---

## Step 5: Keep Tunnel Running in Background

### Method A: Using nohup (Simple)

```bash
# Start tunnel in background
nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel.log 2>&1 &

# Check it's running
ps aux | grep cloudflared

# Expected: cloudflared tunnel --url http://localhost:3000

# View logs
tail -f /tmp/tunnel.log

# Get the URL
grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel.log
```

### Method B: Using screen (Recommended)

```bash
# Install screen (if not installed)
sudo apt install screen

# Create a new named session
screen -S cloudflare-tunnel

# Inside screen session:
cloudflared tunnel --url http://localhost:3000

# Detach from session: Ctrl+A, then D

# Reattach later:
screen -r cloudflare-tunnel

# List all sessions:
screen -ls
```

### Method C: Using tmux (Modern Alternative)

```bash
# Install tmux (if not installed)
sudo apt install tmux

# Create new tmux session
tmux new-session -s cloudflare -d "cloudflared tunnel --url http://localhost:3000"

# Check logs
tmux capture-pane -t cloudflare -p

# Attach to session
tmux attach-session -t cloudflare

# Kill session when done
tmux kill-session -t cloudflare
```

### Method D: Systemd Service (Production - Persistent Reboot)

```bash
# Create systemd service file
sudo nano /etc/systemd/system/cloudflare-tunnel.service
```

```ini
[Unit]
Description=Cloudflare Tunnel for EduEquity
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloudflared tunnel --url http://localhost:3000
Restart=always
RestartSec=10
User=vinoth22
Environment=HOME=/home/vinoth22

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable cloudflare-tunnel.service
sudo systemctl start cloudflare-tunnel.service

# Check status
sudo systemctl status cloudflare-tunnel.service

# View logs
sudo journalctl -u cloudflare-tunnel.service -f

# Get URL
sudo journalctl -u cloudflare-tunnel.service | grep -o 'https://[^ ]*\.trycloudflare.com'
```

### Method E: Docker (If Using Docker)

```bash
# Run cloudflared in Docker
docker run -d \
  --name cloudflare-tunnel \
  -p 3000:3000 \
  cloudflare/cloudflared:latest \
  tunnel --url http://host.docker.internal:3000

# Check logs
docker logs -f cloudflare-tunnel

# Stop tunnel
docker stop cloudflare-tunnel
```

---

## Production Tips (CORS, WebSockets, Vite/Next.js)

### CORS Configuration

**For Next.js (port 3000):**

Create/Edit `apps/web/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Or your specific domain
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

**For Vite (port 5173):**

Edit `apps/web/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    origin: 'https://your-trycloudflare-url.trycloudflare.com',
  },
});
```

**For FastAPI (port 8000):**

Edit `apps/api/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or your specific Cloudflare URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### WebSocket Support

Cloudflare supports WebSockets out of the box. No extra config needed.

**For Next.js WebSockets (Socket.io):**

```bash
# Install socket.io
cd apps/web
npm install socket.io socket.io-client

# In your Next.js component
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function WebSocketTest() {
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    const socket = io('https://your-tunnel-url.trycloudflare.com', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setStatus('Connected');
      socket.emit('message', 'Hello from client!');
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>WebSocket Status: {status}</div>;
}
```

**For FastAPI WebSockets:**

```python
from fastapi import WebSocket
from fastapi.websockets import WebSocketClose

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketClose:
        print("WebSocket closed")
```

### Vite/Next.js Development Settings

**For Vite (port 5173):**

```bash
# Configure Vite for external access
cd apps/web
vim vite.config.ts

# Add host option
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  # Allow external connections
    port: 5173,
    cors: true,
  },
});
```

**For Next.js (port 3000):**

```bash
# Next.js 13+ allows external access by default
# Run with:
cd apps/web
npm run dev -- -H 0.0.0.0

# Or in package.json:
# "dev": "next dev -H 0.0.0.0 -p 3000"
```

**For FastAPI (port 8000):**

```bash
# Uvicorn with host exposed
cd apps/api
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Common Errors and Fixes

### Error 1: "Tunnel failed to start"

```bash
# Error: Cannot determine default configuration path

# Fix: Create config directory
mkdir -p ~/.cloudflared
cd ~/.cloudflared
```

### Error 2: "Connection refused" on localhost

```bash
# Error: curl: (7) Failed to connect to localhost:3000

# Fix 1: Check if your app is running
curl http://localhost:3000

# Fix 2: Check correct port
ss -tlnp | grep LISTEN

# Fix 3: Start your app first
cd /home/vinoth22/eduequity/eduequity-os/apps/web
pnpm dev
```

### Error 3: "Tunnel restarted repeatedly"

```bash
# Check logs for specific error
journalctl -u cloudflare-tunnel.service -n 100

# Common causes:
# - Wrong port in config
# - App not running
# - Firewall blocking

# Fix: Verify port matches your running app
cloudflared tunnel --url http://localhost:YOUR_PORT
```

### Error 4: SSL Certificate Error

```bash
# Error: x509: certificate is valid for domain, not localhost

# This is expected - cloudflared uses its own certificate
# Your browser will show "Not Secure" but it's actually secure
# Click "Advanced" → "Proceed to site"

# Or use noTLSVerify in config for testing:
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: eduequity-web
credentials-file: /home/vinoth22/.cloudflared/eduequity-web.json
ingress:
  - service: http://localhost:3000
    originRequest:
      noTLSVerify: true
EOF
```

### Error 5: CORS Errors in Browser

```bash
# Error: Access to XMLHttpRequest blocked by CORS policy

# Fix: Configure CORS in your app (see Section 5 above)
# Or add header in cloudflared:
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: eduequity-web
credentials-file: /home/vinoth22/.cloudflared/eduequity-web.json
ingress:
  - service: http://localhost:3000
    originRequest:
      noTLSVerify: true
      httpHostHeader: "localhost"
EOF
```

### Error 6: Slow Loading / Timeout

```bash
# Check if your local server is responsive
curl -v http://localhost:3000

# Check cloudflared logs
journalctl -u cloudflare-tunnel.service -f

# Try increasing timeout:
cloudflared tunnel --url http://localhost:3000 --tcp-upstream
```

### Error 7: WebSocket Disconnects

```bash
# Cloudflare has a 100-minute WebSocket timeout
# For longer connections, use:

# Option A: Periodic ping from client
setInterval(() => {
  socket.emit('ping');
}, 60000); // Every 60 seconds

# Option B: Use Server-Sent Events (SSE) instead
# SSE has no timeout
```

---

## Quick Reference Commands

```bash
# 1. Install
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared
chmod +x /tmp/cloudflared
sudo mv /tmp/cloudflared /usr/local/bin/cloudflared

# 2. Quick tunnel (no login)
cloudflared tunnel --url http://localhost:3000

# 3. Background with nohup
nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel.log 2>&1 &

# 4. Get URL
grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel.log

# 5. Check status
ps aux | grep cloudflared

# 6. Stop tunnel
pkill -f cloudflared

# 7. Systemd service
sudo systemctl start cloudflare-tunnel.service
sudo systemctl status cloudflare-tunnel.service
```

---

## Testing Your EduEquity Project

```bash
# Start all services in background
cd /home/vinoth22/eduequity/eduequity-os

# Terminal 1: Web app
cd apps/web
nohup pnpm dev > /tmp/web.log 2>&1 &

# Terminal 2: API
cd apps/api
nohup uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/api.log 2>&1 &

# Terminal 3: Cloudflare tunnel
cloudflared tunnel --url http://localhost:3000

# Test in browser
# https://random-name.trycloudflare.com

# Test API directly
# https://random-name.trycloudflare.com/api/v1/...
```

