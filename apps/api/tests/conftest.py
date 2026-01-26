#!/usr/bin/env python3
"""
Pytest configuration for EduEquity OS API tests.
"""
import pytest
import sys
from pathlib import Path

# Add the apps/api directory to the path for imports
API_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(API_DIR))

# Default base URL for tests
BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"


@pytest.fixture(scope="session")
def base_url():
    """Base URL fixture for API tests"""
    return "http://localhost:8000"


@pytest.fixture(scope="session")
def api_v1(base_url):
    """API v1 prefix fixture"""
    return f"{base_url}/api/v1"

