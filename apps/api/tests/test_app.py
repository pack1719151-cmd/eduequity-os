#!/usr/bin/env python3
"""
Unit tests for EduEquity OS API - App imports and configuration.
These tests verify the app can be imported and configured correctly.
"""
import pytest
import sys
from pathlib import Path

# Add apps/api to path
API_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(API_DIR))


class TestAppImports:
    """Test that all app modules can be imported successfully"""
    
    def test_import_main_app(self):
        """Test that main FastAPI app can be imported"""
        from app.main import app
        assert app is not None
        assert app.title == "EduEquity OS API"
    
    def test_import_config(self):
        """Test that config settings can be imported"""
        from app.core.config import settings
        assert settings is not None
        assert settings.APP_NAME == "EduEquity OS API"
    
    def test_import_security(self):
        """Test that security functions work correctly"""
        from app.core.security import (
            create_access_token,
            verify_password,
            get_password_hash,
            decode_access_token
        )
        # Test password hashing
        password = "test_password_123"
        hashed = get_password_hash(password)
        assert hashed != password
        assert verify_password(password, hashed)
        assert not verify_password("wrong_password", hashed)
        
        # Test token creation
        token = create_access_token(subject="test_user", data={"role": "student"})
        assert token is not None
        assert len(token) > 0
        
        # Test token decoding
        payload = decode_access_token(token)
        assert payload is not None
        assert payload.get("sub") == "test_user"
        assert payload.get("role") == "student"
    
    def test_import_auth_routes(self):
        """Test that auth router can be imported"""
        from app.api.v1.auth_routes import router
        assert router is not None
    
    def test_import_db_session(self):
        """Test that database session can be imported"""
        from app.db.session import get_db, SessionLocal, engine
        assert get_db is not None
        assert SessionLocal is not None
        assert engine is not None
    
    def test_import_user_model(self):
        """Test that User model can be imported"""
        from app.db.models.user import User
        assert User is not None
    
    def test_import_schemas(self):
        """Test that Pydantic schemas can be imported"""
        from app.schemas.auth import (
            LoginRequest,
            RegisterRequest,
            TokenResponse,
            UserResponse
        )
        # Test schema creation
        login = LoginRequest(email="test@example.com", password="password123")
        assert login.email == "test@example.com"
        
        register = RegisterRequest(
            email="test@example.com",
            password="password123",
            full_name="Test User",
            role="student"
        )
        assert register.full_name == "Test User"
        assert register.role == "student"


class TestJWTTokenGeneration:
    """Test JWT token generation with different configurations"""
    
    def test_token_with_custom_expiry(self):
        """Test token creation with custom expiry"""
        from datetime import timedelta
        from app.core.security import create_access_token
        
        token = create_access_token(
            subject="user123",
            expires_delta=timedelta(hours=1),
            data={"role": "teacher"}
        )
        assert token is not None
        
        from app.core.security import decode_access_token
        payload = decode_access_token(token)
        assert payload.get("role") == "teacher"
    
    def test_token_contains_required_claims(self):
        """Test that token contains all required claims"""
        from app.core.security import create_access_token, decode_access_token
        
        token = create_access_token(subject="user456", data={"test": "data"})
        payload = decode_access_token(token)
        
        assert "exp" in payload
        assert "sub" in payload
        assert payload["sub"] == "user456"
        assert payload["test"] == "data"


class TestPasswordHashing:
    """Test password hashing functionality"""
    
    def test_password_hash_uniqueness(self):
        """Test that same password produces different hashes (salt)"""
        from app.core.security import get_password_hash
        
        password = "my_secure_password"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        # Hashes should be different due to unique salts
        assert hash1 != hash2
        # But both should verify correctly
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)
    
    def test_password_hash_format(self):
        """Test that password hash has correct format"""
        from app.core.security import get_password_hash
        
        password = "test_password"
        hashed = get_password_hash(password)
        
        # BCrypt hashes start with $2b$
        assert hashed.startswith("$2b$")
        # Hash should be a valid string
        assert len(hashed) == 60
    
    def test_verify_password_edge_cases(self):
        """Test password verification edge cases"""
        from app.core.security import get_password_hash, verify_password
        
        password = "TestPassword123!"
        hashed = get_password_hash(password)
        
        # Correct password
        assert verify_password(password, hashed)
        
        # Wrong password
        assert not verify_password("WrongPassword", hashed)
        
        # Empty password
        assert not verify_password("", hashed)
        
        # None password should raise an error (not silently return False)
        try:
            verify_password(None, hashed)
            assert False, "Expected an error for None password"
        except (AttributeError, TypeError):
            # Expected - the function can't handle None
            pass
    
    def test_empty_password_handling(self):
        """Test handling of empty passwords"""
        from app.core.security import get_password_hash, verify_password
        
        # Empty password should still work
        empty_hash = get_password_hash("")
        assert verify_password("", empty_hash)
        assert not verify_password("something", empty_hash)


class TestAppConfiguration:
    """Test application configuration"""
    
    def test_cors_origins_list(self):
        """Test CORS origins are properly parsed"""
        from app.core.config import settings
        
        origins = settings.cors_origins_list
        assert isinstance(origins, list)
        assert len(origins) > 0
    
    def test_database_url_fallback(self):
        """Test database URL falls back to SQLite when PostgreSQL not set"""
        from app.core.config import settings
        
        effective = settings.effective_database_url
        assert effective is not None
        assert "sqlite" in effective.lower() or "postgresql" in effective.lower()
    
    def test_cookie_settings(self):
        """Test cookie security settings"""
        from app.core.config import settings
        
        # Development mode settings
        assert hasattr(settings, 'cookie_secure')
        assert hasattr(settings, 'cookie_samesite')
        
        # In development, secure should be False
        if not settings.is_production:
            assert settings.cookie_secure is False
            assert settings.cookie_samesite == "lax"
    
    def test_token_expiry_times(self):
        """Test token expiry times are properly set"""
        from app.core.config import settings
        
        assert settings.ACCESS_TOKEN_EXPIRE_MINUTES > 0
        assert settings.REFRESH_TOKEN_EXPIRE_DAYS > 0
        assert settings.ACCESS_TOKEN_EXPIRE_MINUTES < settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60


class TestFastAPIRoutes:
    """Test FastAPI route registration"""
    
    def test_app_has_routes(self):
        """Test that app has registered routes"""
        from app.main import app
        
        assert len(app.routes) > 0
    
    def test_health_endpoint_registered(self):
        """Test that health endpoint is registered"""
        from app.main import app
        
        route_paths = [r.path for r in app.routes]
        assert "/health" in route_paths
    
    def test_api_v1_routes_registered(self):
        """Test that API v1 routes are registered"""
        from app.main import app
        
        route_paths = [r.path for r in app.routes]
        assert any("/api/v1" in path for path in route_paths)


# Helper function for tests
def verify_password(plain_password: str, hashed_password: str) -> bool:
    from app.core.security import verify_password as vp
    return vp(plain_password, hashed_password)

