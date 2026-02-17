#!/usr/bin/env python3
"""
Keep Alive Script for Render Backend
Pings the API every 30 seconds to prevent it from spinning down
"""

import requests
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

def ping_api():
    """Ping the API to keep it alive"""
    try:
        response = requests.get(API_URL, timeout=TIMEOUT)
        
        if response.status_code == 200:
            logger.info(f"✓ Ping successful - Status: {response.status_code} - Response time: {response.elapsed.total_seconds():.2f}s")
            return True
        else:
            logger.warning(f"⚠ Ping returned status: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        logger.error(f"✗ Timeout after {TIMEOUT} seconds")
        return False
    except requests.exceptions.ConnectionError:
        logger.error("✗ Connection error - API might be down")
        return False
    except Exception as e:
        logger.error(f"✗ Error: {str(e)}")
        return False

def main():
    """Main loop to keep pinging the API"""
    logger.info("=" * 60)
    logger.info("Keep Alive Script Started")
    logger.info(f"Target: {API_URL}")
    logger.info(f"Interval: {PING_INTERVAL} seconds")
    logger.info("=" * 60)
    
    ping_count = 0
    success_count = 0
    
    try:
        while True:
            ping_count += 1
            logger.info(f"\n[Ping #{ping_count}] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            if ping_api():
                success_count += 1
            
            # Show statistics every 10 pings
            if ping_count % 10 == 0:
                success_rate = (success_count / ping_count) * 100
                logger.info(f"\n📊 Statistics: {success_count}/{ping_count} successful ({success_rate:.1f}%)")
            
            # Wait before next ping
            time.sleep(PING_INTERVAL)
            
    except KeyboardInterrupt:
        logger.info("\n" + "=" * 60)
        logger.info("Keep Alive Script Stopped")
        logger.info(f"Total Pings: {ping_count}")
        logger.info(f"Successful: {success_count}")
        logger.info(f"Failed: {ping_count - success_count}")
        if ping_count > 0:
            logger.info(f"Success Rate: {(success_count / ping_count) * 100:.1f}%")
        logger.info("=" * 60)

if __name__ == "__main__":
    main()
