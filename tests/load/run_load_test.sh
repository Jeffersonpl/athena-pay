#!/bin/bash
# ============================================
# Athena Pay - Load Test Runner
# ============================================

set -e

# Configuration
HOST=${HOST:-"http://localhost:8080"}
USERS=${USERS:-100}
SPAWN_RATE=${SPAWN_RATE:-10}
DURATION=${DURATION:-"5m"}
RESULTS_DIR=${RESULTS_DIR:-"./results"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --host)
            HOST="$2"
            shift 2
            ;;
        --users|-u)
            USERS="$2"
            shift 2
            ;;
        --spawn-rate|-r)
            SPAWN_RATE="$2"
            shift 2
            ;;
        --duration|-t)
            DURATION="$2"
            shift 2
            ;;
        --web)
            WEB_MODE=true
            shift
            ;;
        --tags)
            TAGS="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --host <url>        Target host (default: http://localhost:8080)"
            echo "  --users, -u <n>     Number of concurrent users (default: 100)"
            echo "  --spawn-rate, -r <n> Users to spawn per second (default: 10)"
            echo "  --duration, -t <t>  Test duration (default: 5m)"
            echo "  --web               Run with web UI instead of headless"
            echo "  --tags <tags>       Only run tests with these tags"
            echo "  --help, -h          Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 --host http://api.example.com --users 200 --duration 10m"
            echo "  $0 --tags 'health,balance' --duration 1m"
            echo "  $0 --web  # Run with web UI at http://localhost:8089"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create results directory
mkdir -p "$RESULTS_DIR"

log_info "============================================"
log_info "Athena Pay - Load Test"
log_info "============================================"
log_info "Host: $HOST"
log_info "Users: $USERS"
log_info "Spawn Rate: $SPAWN_RATE/s"
log_info "Duration: $DURATION"
log_info "Results: $RESULTS_DIR"
log_info "============================================"

# Check if locust is installed
if ! command -v locust &> /dev/null; then
    log_error "Locust is not installed. Run: pip install -r requirements.txt"
    exit 1
fi

# Health check
log_info "Checking target health..."
if ! curl -sf "$HOST/health" > /dev/null 2>&1; then
    log_warn "Health check failed. Target might not be running."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build locust command
LOCUST_CMD="locust -f locustfile.py --host=$HOST"

if [ "$WEB_MODE" = true ]; then
    log_info "Starting Locust with web UI at http://localhost:8089"
    LOCUST_CMD="$LOCUST_CMD"
else
    LOCUST_CMD="$LOCUST_CMD --headless"
    LOCUST_CMD="$LOCUST_CMD -u $USERS"
    LOCUST_CMD="$LOCUST_CMD -r $SPAWN_RATE"
    LOCUST_CMD="$LOCUST_CMD -t $DURATION"
    LOCUST_CMD="$LOCUST_CMD --csv=$RESULTS_DIR/load_test_$TIMESTAMP"
    LOCUST_CMD="$LOCUST_CMD --html=$RESULTS_DIR/report_$TIMESTAMP.html"
fi

if [ -n "$TAGS" ]; then
    LOCUST_CMD="$LOCUST_CMD --tags $TAGS"
fi

# Run locust
log_info "Starting load test..."
echo ""

eval $LOCUST_CMD

# Summary
if [ "$WEB_MODE" != true ]; then
    echo ""
    log_info "============================================"
    log_info "Load test complete!"
    log_info "Results saved to:"
    log_info "  - CSV: $RESULTS_DIR/load_test_${TIMESTAMP}_stats.csv"
    log_info "  - HTML: $RESULTS_DIR/report_$TIMESTAMP.html"
    log_info "============================================"
fi
