import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all API requests
    """
    def process_request(self, request):
        logger.info(f"{request.method} {request.path} - User: {request.user}")
        return None
    
    def process_response(self, request, response):
        logger.info(f"{request.method} {request.path} - Status: {response.status_code}")
        return response
