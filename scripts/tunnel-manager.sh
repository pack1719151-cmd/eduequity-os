#!/bin/bash

# EduEquity Cloudflare Tunnel Manager
# Script to start/stop Next.js + Cloudflare Tunnel

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
WEB_DIR="$PROJECT_DIR/apps/web"
WEB_LOG="/tmp/eduequity-web.log"
TUNNEL_LOG="/tmp/eduequity-tunnel.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Kill old processes
kill_old() {
    log_info "Stopping old processes..."
    pkill -f "next-server" 2>/dev/null || true
    pkill -f cloudflared 2>/dev/null || true
    sleep 1
}

# Check if port 3000 is in use
check_port() {
    if ss -tlnp | grep -q ":3000"; then
        return 0
    else
        return 1
    fi
}

# Start Next.js web server
start_web() {
    if check_port; then
        log_warn "Port 3000 already in use. Use 'stop' first."
        return 1
    fi
    
    log_info "Starting Next.js on 127.0.0.1:3000..."
    cd "$WEB_DIR"
    nohup pnpm dev -- -H 127.0.0.1 -p 3000 > "$WEB_LOG" 2>&1 &
    
    # Wait for server to start
    for i in {1..10}; do
        if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
            log_info "Next.js started successfully!"
            return 0
        fi
        sleep 1
    done
    
    log_error "Next.js failed to start. Check $WEB_LOG"
    return 1
}

# Start Cloudflare tunnel
start_tunnel() {
    if ! check_port; then
        log_error "Next.js not running. Start web first."
        return 1
    fi
    
    log_info "Starting Cloudflare tunnel..."
    nohup cloudflared tunnel --url http://127.0.0.1:3000 > "$TUNNEL_LOG" 2>&1 &
    
    # Wait for tunnel to establish
    sleep 8
    
    # Multiple attempts to get URL with different patterns
    for attempt in {1..5}; do
        TUNNEL_URL=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$TUNNEL_LOG" 2>/dev/null | tail -1)
        if [ -n "$TUNNEL_URL" ]; then
            break
        fi
        sleep 2
    done
    
    if [ -n "$TUNNEL_URL" ]; then
        log_info "Tunnel established!"
        echo ""
        echo "================================"
        echo -e "${GREEN}🌐 PUBLIC URL:${NC}"
        echo "$TUNNEL_URL"
        echo "================================"
        echo ""
        return 0
    else
        log_error "Tunnel failed. Check $TUNNEL_LOG"
        return 1
    fi
}

# Stop all services
stop() {
    log_info "Stopping all services..."
    pkill -f "next-server" 2>/dev/null && log_info "Next.js stopped" || true
    pkill -f cloudflared 2>/dev/null && log_info "Tunnel stopped" || true
    log_info "All services stopped."
}

# Show status
status() {
    echo "================================"
    echo "EduEquity Services Status"
    echo "================================"
    
    if check_port; then
        echo -e "${GREEN}[✓]${NC} Next.js is running on 127.0.0.1:3000"
    else
        echo -e "${RED}[✗]${NC} Next.js is NOT running"
    fi
    
    if pgrep -f cloudflared > /dev/null; then
        echo -e "${GREEN}[✓]${NC} Cloudflare tunnel is running"
        if [ -f "$TUNNEL_LOG" ]; then
            TUNNEL_URL=$(grep -o 'https://[^ ]*\.trycloudflare.com' "$TUNNEL_LOG" 2>/dev/null | head -1)
            if [ -n "$TUNNEL_URL" ]; then
                echo -e "   ${GREEN}URL:${NC} $TUNNEL_URL"
            fi
        fi
    else
        echo -e "${RED}[✗]${NC} Cloudflare tunnel is NOT running"
    fi
    
    echo ""
    echo "Log files:"
    echo "  Web:    $WEB_LOG"
    echo "  Tunnel: $TUNNEL_LOG"
    echo "================================"
}

# Health check
health() {
    echo "================================"
    echo "Health Check"
    echo "================================"
    
    echo -n "Local (127.0.0.1:3000): "
    if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 | grep -q "200"; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
    fi
    
    if [ -f "$TUNNEL_LOG" ]; then
        TUNNEL_URL=$(grep -o 'https://[^ ]*\.trycloudflare.com' "$TUNNEL_LOG" 2>/dev/null | head -1)
        if [ -n "$TUNNEL_URL" ]; then
            echo -n "Public ($TUNNEL_URL): "
            if curl -s -o /dev/null -w "%{http_code}" "$TUNNEL_URL" | grep -q "200"; then
                echo -e "${GREEN}✓ OK${NC}"
            else
                echo -e "${RED}✗ FAIL${NC}"
            fi
        fi
    fi
    echo "================================"
}

# Show logs
logs() {
    echo "Showing tunnel logs (Ctrl+C to exit)..."
    tail -f "$TUNNEL_LOG"
}

# Print tunnel URL
url() {
    if [ -f "$TUNNEL_LOG" ]; then
        grep -o 'https://[^ ]*\.trycloudflare.com' "$TUNNEL_LOG" 2>/dev/null | head -1
    else
        log_error "No tunnel log found. Start tunnel first."
    fi
}

# Show help
help() {
    echo "EduEquity Cloudflare Tunnel Manager"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  start    - Start Next.js and Cloudflare tunnel"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  status   - Show service status"
    echo "  health   - Health check"
    echo "  logs     - Show tunnel logs"
    echo "  url      - Print tunnel URL"
    echo "  help     - Show this help"
}

# Main
case "${1:-help}" in
    start)
        kill_old
        start_web && start_tunnel
        ;;
    stop)
        stop
        ;;
    restart)
        kill_old
        start_web && start_tunnel
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    logs)
        logs
        ;;
    url)
        url
        ;;
    help|--help|-h)
        help
        ;;
    *)
        log_error "Unknown command: $1"
        help
        exit 1
        ;;
esac

