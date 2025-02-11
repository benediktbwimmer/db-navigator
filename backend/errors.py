# backend/errors.py
from fastapi import HTTPException, status

class DatabaseNavigatorError(Exception):
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class ConnectionError(DatabaseNavigatorError):
    def __init__(self, message: str):
        super().__init__(message, status_code=503)

class QueryError(DatabaseNavigatorError):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)
