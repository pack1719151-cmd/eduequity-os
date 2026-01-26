# VS Code Remote Tunnels Fix Guide for Ubuntu

## Section A: Diagnose (What Each Error Means)

### Error 1: 401 Unauthorized Tunnel Access
```
status: 401
title: "Request not permitted."
detail: "Anonymous has scopes []; expected one or more of [manage, manage:ports, host, inspect, connect]. 
Authenticate with scheme(s): github"
```

**Meaning**: VS Code is trying to create a tunnel but has no valid GitHub authentication token. The tunnel service requires GitHub OAuth with specific scopes (`manage`, `manage:ports`, `host`, `inspect`, `connect`) to authorize tunnel creation and port forwarding.

### Error 2: GitHub Token Check Failed
```
warn failed to check GitHub token: error sending request for url 
(https://api.github.com/user): error trying to connect: tcp connect error: 
Connection timed out (os error 110)
```

**Meaning**: Your machine cannot establish a TCP connection to `api.github.com` on port 443 (HTTPS). This is a network/DNS issue preventing GitHub API access. The timeout (error 110) indicates the connection attempt was dropped after the default timeout period.

### Root Cause Analysis

1. **No GitHub token** - VS Code needs a valid GitHub PAT (Personal Access Token) or OAuth session
2. **Network blocked** - DNS resolution failing or firewall blocking outbound HTTPS to GitHub
3. **Corrupted credentials** - Stale/invalid tokens stored in VS Code's credential store

---

## Section B: Quick Fix (5 Minutes)

### Step 1: Test GitHub Connectivity

```bash
# Test DNS resolution
nslookup api.github.com
# or
dig api.github.com

# Test HTTPS connectivity (port 443)
curl -v --connect-timeout 10 https://api.github.com/user

# Test ICMP ping (if firewall allows)
ping -c 4 api.github.com
```

### Step 2: Generate GitHub PAT

1. Go to **GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Set expiration (recommend: 90 days or custom)
4. Select these **required scopes**:
   - `repo` (full control of private repositories)
   - `read:user` (read user profile data)
   - `user:email` (read user email addresses)
5. Click **Generate token** and **copy it immediately** (won't be shown again)

### Step 3: Configure VS Code with GitHub Token

**Method 1: VS Code Command Palette**

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `Remote-Tunnels: Add GitHub Authentication Token`
3. Paste your PAT when prompted

**Method 2: Environment Variable (Quick)**

```bash
# Add to ~/.bashrc or ~/.zshrc
export GITHUB_TOKEN="ghp_your_generated_token_here"

# Apply immediately
source ~/.bashrc
```

**Method 3: VS Code Settings (JSON)**

```json
{
  "remote.tunnels.auth": "github",
  "remote.tunnels.token": "ghp_your_generated_token_here"
}
```

### Step 4: Create a Tunnel

```bash
# From your project directory
cd /home/vinoth22/eduequity/eduequity-os

# Start tunnel with specific port (e.g., 3000 for Next.js dev server)
code tunnel --port 3000 --name eduequity-dev

# Or for existing running service
code tunnel --port 8000 --name eduequity-api
```

---

## Section C: Full Fix (Clean + Permanent)

### Step 1: Remove Corrupted GitHub Credentials

#### Clear VS Code Credential Store

```bash
# Find and remove VS Code credentials
rm -rf ~/.config/Code/User/globalStorage/storage.json
rm -rf ~/.config/Code/User/globalStorage/state.vscdb
rm -rf ~/.config/Code/CachedData/*

# Clear keyring if using GNOME Keyring
rm -rf ~/.local/share/keyrings/

# Reset VS Code extensions
rm -rf ~/.vscode/extensions/
```

#### Clear GitHub CLI Credentials (if installed)

```bash
# Check if gh is installed
which gh

# If installed, re-authenticate
gh auth logout
gh auth login
```

### Step 2: Fix DNS/Network Issues

#### Configure DNS to Use Reliable Servers

```bash
# Backup current resolv.conf
sudo cp /etc/resolv.conf /etc/resolv.conf.backup

# Use Google DNS (8.8.8.8, 8.8.4.4) or Cloudflare DNS (1.1.1.1)
cat > /etc/resolv.conf << 'EOF'
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 1.1.1.1
options timeout:2 attempts:3
EOF

# Verify DNS is working
nslookup api.github.com
```

#### Fix Firewall Rules (ufw)

```bash
# Check firewall status
sudo ufw status

# Ensure outbound HTTPS is allowed
sudo ufw allow out 443/tcp
sudo ufw allow out 53/udp

# Enable if disabled
sudo ufw enable
```

#### Test Without Proxy/VPN

```bash
# Check environment variables
echo $HTTP_PROXY
echo $HTTPS_PROXY
echo $http_proxy
echo $https_proxy

# If set, unset temporarily
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy
```

### Step 3: Reinstall VS Code (Clean Install)

```bash
# Remove current VS Code
sudo apt remove code
sudo rm -rf ~/.vscode

# Install fresh
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/
sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'

sudo apt update
sudo apt install code
```

### Step 4: Configure VS Code Settings for Tunnels

**Settings JSON (`~/.config/Code/User/settings.json`):**

```json
{
  "remote.tunnels.auth": "github",
  "remote.tunnels.proxy": "",
  "remote.tunnels.host": "auto",
  
  "remote.forwardedPorts.visibility": "public",
  "remote.portManagement.autoForwardNonHttpLocal": true,
  
  "github.authenticationProvider": "github",
  
  "remote.tunnels.logLevel": "debug",
  "remote.tunnels.log": true
}
```

### Step 5: Set Up Persistent Tunnel Service

```bash
# Create systemd service for auto-restart
cat > ~/.config/systemd/user/code-tunnel.service << 'EOF'
[Unit]
Description=VS Code Remote Tunnel
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/code tunnel --port 3000 --name eduequity-tunnel --accept-server-license-terms
Restart=always
RestartSec=10
Environment=GITHUB_TOKEN=ghp_your_token_here

[Install]
WantedBy=default.target
EOF

# Enable and start service
systemctl --user daemon-reload
systemctl --user enable code-tunnel.service
systemctl --user start code-tunnel.service

# Check status
systemctl --user status code-tunnel.service
```

---

## Section D: Validation Checklist (Exact Commands & Expected Results)

### Checklist 1: Network Connectivity

```bash
# 1. DNS Resolution Test
$ nslookup api.github.com
Server:         8.8.8.8
Address:        8.8.8.8#53
Non-authoritative answer:
Name:   api.github.com
Address: 140.82.114.6  # ← Should show IP, not timeout

# 2. HTTPS Connectivity Test
$ curl -s --connect-timeout 10 https://api.github.com/user -H "Authorization: token ghp_test"
{"login":"your_username","id":12345,...}  # ← Should return JSON user data

# 3. Port 443 Open Test
$ nc -zv api.github.com 443
Connection to api.github.com 443 port [tcp/https] succeeded!
```

### Checklist 2: GitHub Token Validation

```bash
# Test token has correct scopes
curl -s -H "Authorization: token ghp_your_token" \
  https://api.github.com/user | jq '.login, .id'

# Expected output: Your GitHub username and user ID

# Verify token scopes
curl -s -H "Authorization: token ghp_your_token" \
  https://api.github.com/user/repos | jq '.[].clone_url' | head -3
```

### Checklist 3: VS Code Tunnel Status

```bash
# Check tunnel is running
ps aux | grep "code tunnel"

# Expected output: Should show /usr/bin/code tunnel process

# Check tunnel URL (from logs)
journalctl --user -u code-tunnel.service -n 50 --no-pager

# Expected: Look for line like "Tunnel is active at: https://vscode.dev/tunnel/..."
```

### Checklist 4: Port Forwarding Test

```bash
# From VS Code terminal or on the server
# Forward port 3000 (Next.js dev)
code tunnel --port 3000 --name eduequity-web

# Forward port 8000 (Python API)  
code tunnel --port 8000 --name eduequity-api

# Verify port is listening
ss -tlnp | grep -E "(3000|8000)"
# Expected: LISTEN on 127.0.0.1:3000 and 127.0.0.1:8000

# Test from browser
# Navigate to: https://vscode.dev/tunnel/localhost:3000
# Should show your Next.js app
```

### Complete Validation Script

```bash
#!/bin/bash
# save as: ~/validate-tunnel.sh

echo "=== VS Code Tunnel Validation ==="

echo -e "\n[1] DNS Check:"
nslookup api.github.com > /dev/null 2>&1 && echo "✓ DNS OK" || echo "✗ DNS FAIL"

echo -e "\n[2] GitHub API Check:"
curl -s --connect-timeout 5 https://api.github.com > /dev/null && echo "✓ GitHub API OK" || echo "✗ GitHub API FAIL"

echo -e "\n[3] VS Code Process:"
pgrep -f "code tunnel" > /dev/null && echo "✓ Tunnel running" || echo "✗ Tunnel not running"

echo -e "\n[4] Port Forwarding:"
ss -tlnp 2>/dev/null | grep -E "(3000|8000)" && echo "✓ Ports forwarded" || echo "✗ No ports forwarded"

echo -e "\n[5] Tunnel URL Check:"
journalctl --user -u code-tunnel.service -n 1 --no-pager 2>/dev/null | grep -o "https://[a-zA-Z0-9./-]*" && echo "✓ URL found" || echo "✗ No URL"
```

---

## Section E: Fallback Options (If VS Code Tunnels Still Fail)

### Option 1: Cloudflare Tunnel (Zero Trust)

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# Authenticate (browser opens)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create eduequity-tunnel

# Create config: ~/.cloudflared/config.yml
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: eduequity-tunnel
credentials-file: /home/vinoth22/.cloudflared/eduequity-tunnel.json

ingress:
  - service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  - service: http://localhost:8000
    originRequest:
      noTLSVerify: true  
  - service: http_status:404
EOF

# Run tunnel
cloudflared tunnel run eduequity-tunnel

# Get public URL (shows in output)
# Example: https://eduequity-tunnel.trycloudflare.com
```

### Option 2: ngrok (Free Tier)

```bash
# Install ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

# Connect account (free signup at ngrok.com)
ngrok config add-authtoken YOUR_NGROK_TOKEN

# Start tunnel
ngrok http 3000 --url=eduequity.ngrok.io  # Custom subdomain (requires paid)

# Or random URL (free)
ngrok http 3000

# Output:
# Forwarding https://abcd1234.ngrok.io -> http://localhost:3000
```

### Option 3: localtunnel (Node.js)

```bash
# Install localtunnel globally
npm install -g localtunnel

# Start tunnel to port 3000
lt --port 3000 --subdomain eduequity-web

# Output:
# your url is: https://eduequity-web.loca.lt
```

### Option 4: SSH Tunnel (Server You Control)

```bash
# On your Ubuntu machine (local)
ssh -R 80:localhost:3000 user@your-vps.com

# On VPS (nginx reverse proxy)
# server {
#     listen 80;
#     server_name eduequity.yourdomain.com;
#     location / {
#         proxy_pass http://localhost:8080;
#     }
# }
```

---

## Summary Commands for Quick Reference

```bash
# One-liner to start VS Code tunnel with port 3000
cd /home/vinoth22/eduequity/eduequity-os && \
  export GITHUB_TOKEN="ghp_your_token" && \
  code tunnel --port 3000 --name eduequity-os

# Check tunnel status
systemctl --user status code-tunnel.service

# View tunnel logs
journalctl --user -u code-tunnel.service -f

# Stop tunnel
systemctl --user stop code-tunnel.service

# Restart tunnel
systemctl --user restart code-tunnel.service
```

---

## Port Forwarding for EduEquity Project

Based on the project structure, here are the specific port forwards:

### Development Servers

```bash
# Next.js Web App (port 3000)
code tunnel --port 3000 --name eduequity-web

# Python API (port 8000)
code tunnel --port 8000 --name eduequity-api
```

### Accessing Forwarded Ports

Once the tunnel is active, access your services at:
- Web App: `https://vscode.dev/tunnel/localhost:3000`
- API: `https://vscode.dev/tunnel/localhost:8000`

Or share the full tunnel URL for public access.

---

## Troubleshooting Common Issues

### Issue: "Connection timed out" persists

```bash
# Check if behind corporate proxy
env | grep -i proxy

# If yes, configure VS Code to use proxy
# Settings > Application > Proxy
```

### Issue: Token keeps getting rejected

```bash
# Regenerate token with fresh scopes
# Ensure no special characters in token

# Clear VS Code cache
rm -rf ~/.vscode/. insiders/
```

### Issue: Tunnel creates but port not accessible

```bash
# Verify service is running locally
curl http://localhost:3000

# Check VS Code port visibility setting
# Settings > Remote > Forwarded Ports > Visibility > Public
```

