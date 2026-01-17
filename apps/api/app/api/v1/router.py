from fastapi import APIRouter

from app.api.v1.auth_routes import router as auth_router

api_router = APIRouter()

# Register auth router
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Placeholder routers for other modules
# These will be implemented in their respective modules
api_router_api = APIRouter()
api_router.include_router(api_router_api, prefix="/user", tags=["User"])

api_router_attendance = APIRouter()
api_router.include_router(api_router_attendance, prefix="/attendance", tags=["Attendance"])

api_router_quiz = APIRouter()
api_router.include_router(api_router_quiz, prefix="/quiz", tags=["Quiz"])

api_router_feed = APIRouter()
api_router.include_router(api_router_feed, prefix="/feed", tags=["Feed"])

api_router_reports = APIRouter()
api_router.include_router(api_router_reports, prefix="/reports", tags=["Reports"])

api_router_health = APIRouter()


@api_router_health.get("/health")
async def api_health_check():
    """Health check endpoint for API"""
    return {"status": "healthy", "api_version": "1.0.0"}


api_router.include_router(api_router_health, prefix="", tags=["Health"])

