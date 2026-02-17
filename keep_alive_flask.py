#!/usr/bin/env python3
"""
Flask Keep Alive Service for Render Backend
Provides a web interface and automatically pings the API every 30 seconds
"""

from flask import Flask, render_template_string, jsonify
import requests
import threading
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
API_URL = "https://nova-library-backend.onrender.com/api/v1/health/"
PING_INTERVAL = 30  # seconds
TIMEOUT = 10  # seconds

# Statistics
stats = {
    'total_pings': 0,
    'successful_pings': 0,
    'failed_pings': 0,
    'last_ping_time': None,
    'last_ping_status': None,
    'last_response_time': None,
    'started_at': datetime.now(),
    'is_running': False
}

app = Flask(__name__)

# HTML Template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keep Alive Monitor - Nova Library</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 800px;
            width: 100%;
        }
        
        h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 32px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        
        .status-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 10px;
            animation: pulse 2s infinite;
        }
        
        .status-running {
            background: #10b981;
        }
        
        .status-stopped {
            background: #ef4444;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .stat-label {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .stat-value {
            color: #1e293b;
            font-size: 28px;
            font-weight: bold;
        }
        
        .stat-small {
            font-size: 20px;
        }
        
        .info-section {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            color: #64748b;
            font-weight: 500;
        }
        
        .info-value {
            color: #1e293b;
            font-family: monospace;
        }
        
        .success {
            color: #10b981;
            font-weight: bold;
        }
        
        .error {
            color: #ef4444;
            font-weight: bold;
        }
        
        .footer {
            text-align: center;
            color: #94a3b8;
            font-size: 14px;
            margin-top: 30px;
        }
        
        .refresh-note {
            background: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
        }
    </style>
    <script>
        // Auto-refresh every 5 seconds
        setTimeout(function() {
            location.reload();
        }, 5000);
    </script>
</head>
<body>
    <div class="container">
        <h1>🚀 Keep Alive Monitor</h1>
        <p class="subtitle">Nova Library Backend - Render API</p>
        
        <div class="status-card">
            <h2 style="margin-bottom: 15px;">
                <span class="status-indicator {{ 'status-running' if is_running else 'status-stopped' }}"></span>
                {{ 'Service Running' if is_running else 'Service Stopped' }}
            </h2>
            <p style="font-size: 18px; opacity: 0.9;">
                Pinging every {{ interval }} seconds
            </p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Pings</div>
                <div class="stat-value">{{ total_pings }}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Successful</div>
                <div class="stat-value success">{{ successful_pings }}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Failed</div>
                <div class="stat-value error">{{ failed_pings }}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Success Rate</div>
                <div class="stat-value stat-small">{{ success_rate }}%</div>
            </div>
        </div>
        
        <div class="info-section">
            <div class="info-row">
                <span class="info-label">API URL</span>
                <span class="info-value">{{ api_url }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Started At</span>
                <span class="info-value">{{ started_at }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Last Ping</span>
                <span class="info-value">{{ last_ping_time or 'Not yet' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Last Status</span>
                <span class="info-value {{ 'success' if last_ping_status == 'Success' else 'error' }}">
                    {{ last_ping_status or 'N/A' }}
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Response Time</span>
                <span class="info-value">{{ last_response_time or 'N/A' }}</span>
            </div>
        </div>
        
        <div class="refresh-note">
            ⚡ Page auto-refreshes every 5 seconds
        </div>
        
        <div class="footer">
            Nova Library Management System © 2026
        </div>
    </div>
</body>
</html>
"""

def ping_api():
    """Ping the API to keep it alive"""
    try:
        start_time = time.time()
        response = requests.get(API_URL, timeout=TIMEOUT)
        response_time = time.time() - start_time
        
        stats['last_ping_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        stats['last_response_time'] = f"{response_time:.2f}s"
        
        if response.status_code == 200:
            stats['successful_pings'] += 1
            stats['last_ping_status'] = 'Success'
            logger.info(f"✓ Ping successful - Status: {response.status_code} - Response time: {response_time:.2f}s")
            return True
        else:
            stats['failed_pings'] += 1
            stats['last_ping_status'] = f'Failed ({response.status_code})'
            logger.warning(f"⚠ Ping returned status: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        stats['failed_pings'] += 1
        stats['last_ping_status'] = 'Timeout'
        stats['last_ping_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        logger.error(f"✗ Timeout after {TIMEOUT} seconds")
        return False
    except requests.exceptions.ConnectionError:
        stats['failed_pings'] += 1
        stats['last_ping_status'] = 'Connection Error'
        stats['last_ping_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        logger.error("✗ Connection error - API might be down")
        return False
    except Exception as e:
        stats['failed_pings'] += 1
        stats['last_ping_status'] = f'Error: {str(e)[:30]}'
        stats['last_ping_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        logger.error(f"✗ Error: {str(e)}")
        return False

def ping_loop():
    """Background thread to ping API continuously"""
    stats['is_running'] = True
    logger.info("=" * 60)
    logger.info("Keep Alive Service Started")
    logger.info(f"Target: {API_URL}")
    logger.info(f"Interval: {PING_INTERVAL} seconds")
    logger.info("=" * 60)
    
    while True:
        stats['total_pings'] += 1
        logger.info(f"\n[Ping #{stats['total_pings']}] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        ping_api()
        time.sleep(PING_INTERVAL)

@app.route('/')
def index():
    """Main dashboard page"""
    success_rate = 0
    if stats['total_pings'] > 0:
        success_rate = round((stats['successful_pings'] / stats['total_pings']) * 100, 1)
    
    return render_template_string(
        HTML_TEMPLATE,
        api_url=API_URL,
        interval=PING_INTERVAL,
        total_pings=stats['total_pings'],
        successful_pings=stats['successful_pings'],
        failed_pings=stats['failed_pings'],
        success_rate=success_rate,
        last_ping_time=stats['last_ping_time'],
        last_ping_status=stats['last_ping_status'],
        last_response_time=stats['last_response_time'],
        started_at=stats['started_at'].strftime('%Y-%m-%d %H:%M:%S'),
        is_running=stats['is_running']
    )

@app.route('/api/stats')
def api_stats():
    """API endpoint to get statistics as JSON"""
    success_rate = 0
    if stats['total_pings'] > 0:
        success_rate = round((stats['successful_pings'] / stats['total_pings']) * 100, 1)
    
    return jsonify({
        'total_pings': stats['total_pings'],
        'successful_pings': stats['successful_pings'],
        'failed_pings': stats['failed_pings'],
        'success_rate': success_rate,
        'last_ping_time': stats['last_ping_time'],
        'last_ping_status': stats['last_ping_status'],
        'last_response_time': stats['last_response_time'],
        'started_at': stats['started_at'].strftime('%Y-%m-%d %H:%M:%S'),
        'is_running': stats['is_running']
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'keep-alive'})

if __name__ == '__main__':
    # Start ping loop in background thread
    ping_thread = threading.Thread(target=ping_loop, daemon=True)
    ping_thread.start()
    
    # Start Flask app
    logger.info("\n🌐 Starting Flask web interface on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
