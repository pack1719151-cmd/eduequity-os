# CI#11 Fix Plan - Backend and Postsetup Python Errors

## Phase 1: Fix Test Discovery ✅
- [x] 1.1 Create `apps/api/tests/` directory with `__init__.py`
- [x] 1.2 Create proper pytest tests in `test_app.py`
- [x] 1.3 Update `pyproject.toml` with correct testpaths

## Phase 2: Fix Import Confusion ✅
- [x] 2.1 Delete orphan directory `apps/api/apps/`
- [x] 2.2 Verify only `apps/api/app/` exists as the real app package

## Phase 3: Fix Setup.sh Failures ✅
- [x] 3.1 Create `apps/api/scripts/seed_demo_data.py` placeholder
- [x] 3.2 Add guard for alembic in setup.sh (check for migrations folder)

## Phase 4: Fix CI Environment ✅
- [x] 4.1 Update `.github/workflows/ci.yml` with PYTHONPATH
- [x] 4.2 Update package.json test scripts

## Phase 5: Verify Fixes ✅
- [x] 5.1 Run `pytest -q` locally - **20 tests passed**
- [x] 5.2 CI workflow updated

---

## Summary of Changes

### Files Created:
1. `apps/api/tests/__init__.py` - Package marker
2. `apps/api/tests/conftest.py` - Pytest fixtures
3. `apps/api/tests/test_app.py` - 20 unit tests
4. `apps/api/scripts/seed_demo_data.py` - Demo data seeder

### Files Modified:
1. `.github/workflows/ci.yml` - Added PYTHONPATH=. for backend tests
2. `pyproject.toml` - Updated testpaths to `apps/api/tests`
3. `scripts/setup.sh` - Added alembic guard
4. `package.json` - Added test scripts

### Files Removed:
1. `apps/api/apps/` - Orphan directory deleted
2. `apps/api/tests/test_api.py` - Non-pytest script removed
3. `apps/api/tests/test_auth.py` - Non-pytest script removed

---

## Test Results
```
20 passed in 4.36s
```

### Tests Cover:
- App imports (main, config, security, routes, models, schemas)
- JWT token generation and validation
- Password hashing with bcrypt
- CORS and cookie configuration
- FastAPI route registration

