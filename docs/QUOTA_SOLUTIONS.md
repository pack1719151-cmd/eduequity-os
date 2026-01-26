# Blackbox AI Quota Solutions + Cloudflare Tunnel Commands

---

## A) FREE WAYS INSIDE BLACKBOX

### 1. Switch to Smaller Model
```bash
# Blackbox may offer model switching in settings
# Look for: Settings > Model > Select "smaller" or "faster" model
# This reduces token usage per request
```

### 2. Reduce Token Usage
```bash
# Use minimal prompts:
# Instead of: "Please help me with my complex issue..."
# Use: "cloudflared install + tunnel port 3000 nohup"

# Ask for concise answers:
# "Reply with code only, no explanations"

# Break large tasks into smaller chunks
```

### 3. Restart Session (Preserves Context)
```bash
# 1. Copy important code/errors before restarting
# 2. Refresh the browser page (F5)
# 3. Session context is preserved in most cases
# 4. If not, summarize your task in 2-3 sentences
```

---

## B) ALTERNATIVE TOOLS (FREE)

### Option 1: Ollama (Local LLM - No Quota)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama
sudo systemctl enable ollama

# Pull a small model (uses ~4GB RAM)
ollama pull llama3.2
# or smaller: ollama pull phi3
# or tiny: ollama pull tinyllama

# Start chat
ollama run llama3.2

# Use in terminal for DevOps help:
# $ ollama run llama3.2 "write bash script to install cloudflared"
```

### Option 2: Continue.dev (VS Code Extension)

```bash
# In VS Code:
# 1. Ctrl+Shift+X (Extensions)
# 2. Search "Continue"
# 3. Install "Continue - AI code assistant"

# Configure (Ctrl+Shift+P > Continue: Configure):
# - Uses GPT-4 free tier initially
# - Can connect to local Ollama
# - Free daily credits available
```

### Option 3: Codeium (VS Code Extension)

```bash
# In VS Code:
# 1. Ctrl+Shift+X
# 2. Search "Codeium"
# 3. Install "Codeium"

# Features:
# - Free unlimited autocomplete
# - Chat feature with generous limits
# - No login required for basic features
# - Works offline for autocomplete
```

### Option 4: ChatGPT Free Workflow

```bash
# 1. Go to chatgpt.com (free tier available)
# 2. Login with Microsoft/Google account
# 3. Use for simple DevOps questions
# 4. Copy commands to Ubuntu terminal

# Prompt format:
# "Write bash commands to: 1) install cloudflared, 2) run tunnel port 3000, 3) background process"
```

---

## C) CLOUDFLARE TUNNEL - EXACT COMMANDS

### ONE-CLICK COMMANDS - COPY AND PASTE

#### Immediate Fix (Fastest)
```bash
# Single command - install + run tunnel on port 3000
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared && chmod +x /tmp/cloudflared && sudo mv /tmp/cloudflared /usr/local/bin/cloudflared && cloudflared tunnel --url http://localhost:3000
```

#### Permanent Fix (Best Long-Term)
```bash
# Create systemd service for persistent tunnel

# 1. Install cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared
chmod +x /tmp/cloudflared
sudo mv /tmp/cloudflared /usr/local/bin/cloudflared

# 2. Create service file
sudo cat > /etc/systemd/system/cloudflare-tunnel.service << 'EOF'
[Unit]
Description=Cloudflare Tunnel for EduEquity
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloudflared tunnel --url http://localhost:3000
Restart=always
RestartSec=10
User=vinoth22

[Install]
WantedBy=multi-user.target
EOF

# 3. Enable and start
sudo systemctl daemon-reload
sudo systemctl enable cloudflare-tunnel.service
sudo systemctl start cloudflare-tunnel.service

# 4. Get URL
sudo journalctl -u cloudflare-tunnel.service | grep -o 'https://[^ ]*\.trycloudflare.com'
```

---

### PORT-SPECIFIC ONE-LINERS

#### Port 3000 (Next.js Web App)
```bash
# Quick tunnel
cloudflared tunnel --url http://localhost:3000

# Background with nohup
nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel3000.log 2>&1 &

# Verify
curl -s https://$(grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel3000.log | head -1) | head -10
```

#### Port 5173 (Vite Dev Server)
```bash
# Quick tunnel
cloudflared tunnel --url http://localhost:5173

# Background with nohup
nohup cloudflared tunnel --url http://localhost:5173 > /tmp/tunnel5173.log 2>&1 &

# Verify
curl -s https://$(grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel5173.log | head -1) | head -10
```

#### Port 8000 (Python FastAPI)
```bash
# Quick tunnel
cloudflared tunnel --url http://localhost:8000

# Background with nohup
nohup cloudflared tunnel --url http://localhost:8000 > /tmp/tunnel8000.log 2>&1 &

# Verify
curl -s https://$(grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel8000.log | head -1)/api/health
```

---

### BACKGROUND PROCESS COMMANDS

#### Method 1: nohup (Simplest)
```bash
# Start in background
nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel.log 2>&1 &

# Get URL
tail -1 /tmp/tunnel.log

# Stop
pkill -f "cloudflared tunnel"

# Restart
pkill -f "cloudflared tunnel" && nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel.log 2>&1 &
```

#### Method 2: screen (Recommended for SSH)
```bash
# Install
sudo apt install screen -y

# Create session
screen -S cloudflare -d -m cloudflared tunnel --url http://localhost:3000

# Check logs
screen -r cloudflare -X hardcopy /tmp/tunnel_output.txt
cat /tmp/tunnel_output.txt

# List sessions
screen -ls

# Kill
screen -S cloudflare -X quit
```

#### Method 3: systemd (Survives Reboot)
```bash
# Create service
sudo nano /etc/systemd/system/cloudflare-tunnel.service
```
```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloudflared tunnel --url http://localhost:3000
Restart=always
User=vinoth22

[Install]
WantedBy=multi-user.target
```
```bash
# Enable
sudo systemctl daemon-reload
sudo systemctl enable cloudflare-tunnel
sudo systemctl start cloudflare-tunnel

# Commands
sudo systemctl status cloudflare-tunnel    # Check status
sudo systemctl restart cloudflare-tunnel   # Restart
sudo journalctl -u cloudflare-tunnel -f    # View logs
```

---

### VERIFICATION COMMANDS

#### Check Local App is Running
```bash
# Port 3000 (Next.js)
curl -s http://localhost:3000 | head -5

# Port 5173 (Vite)
curl -s http://localhost:5173 | head -5

# Port 8000 (FastAPI)
curl -s http://localhost:8000/health
```

#### Get Tunnel URL
```bash
# From nohup log
grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel.log

# From systemd journal
sudo journalctl -u cloudflare-tunnel | grep "Tunnel established" | tail -1

# From process
ps aux | grep cloudflared
```

#### Test Public URL
```bash
# Replace YOUR_URL with the trycloudflare.com URL
curl -I https://YOUR_URL.trycloudflare.com

# Expected output:
# HTTP/2 200
# server: cloudflare

# Test in browser - should show your app
# https://YOUR_URL.trycloudflare.com
```

---

### FULL AUTOMATION SCRIPT

```bash
# Save as: ~/start-tunnel.sh
#!/bin/bash

PORT=${1:-3000}
LOG_FILE="/tmp/tunnel_${PORT}.log"

echo "Starting Cloudflare tunnel for port $PORT..."

# Kill existing tunnel on this port
pkill -f "cloudflared.*$PORT" 2>/dev/null

# Start new tunnel
nohup cloudflared tunnel --url http://localhost:$PORT > "$LOG_FILE" 2>&1 &

# Wait for URL
sleep 3

# Get URL
URL=$(grep -o 'https://[^ ]*\.trycloudflare.com' "$LOG_FILE" | head -1)

if [ -n "$URL" ]; then
    echo "✓ Tunnel active: $URL"
    echo "URL saved to: $LOG_FILE"
    echo "Test: curl -I $URL"
else
    echo "✗ Tunnel failed to start. Check: tail $LOG_FILE"
fi
```

```bash
# Usage
chmod +x ~/start-tunnel.sh

# For port 3000
~/start-tunnel.sh 3000

# For port 5173
~/start-tunnel.sh 5173

# For port 8000
~/start-tunnel.sh 8000
```

---

### EDUEQUITY PROJECT QUICK START

```bash
# One command to start everything
cd /home/vinoth22/eduequity/eduequity-os

# Start web app in background
cd apps/web && nohup pnpm dev > /tmp/web.log 2>&1 &

# Start API in background
cd apps/api && nohup uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/api.log 2>&1 &

# Start cloudflare tunnel
nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel.log 2>&1 &

# Get URL
sleep 5 && grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel.log

# Verify
curl -I $(grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel.log)
```

---

## QUICK REFERENCE TABLE

| Task | Command |
|------|---------|
| Install cloudflared | `wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared && chmod +x /tmp/cloudflared && sudo mv /tmp/cloudflared /usr/local/bin/cloudflared` |
| Tunnel port 3000 | `cloudflared tunnel --url http://localhost:3000` |
| Tunnel port 5173 | `cloudflared tunnel --url http://localhost:5173` |
| Tunnel port 8000 | `cloudflared tunnel --url http://localhost:8000` |
| Background tunnel | `nohup cloudflared tunnel --url http://localhost:3000 > /tmp/tunnel.log 2>&1 &` |
| Get tunnel URL | `grep -o 'https://[^ ]*\.trycloudflare.com' /tmp/tunnel.log` |
| Stop tunnel | `pkill -f cloudflared` |
| Install Ollama | `curl -fsSL https://ollama.ai/install.sh | sh` |

