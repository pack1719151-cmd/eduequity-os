# Backend Fixes TODO

## Task A: Add missing __init__.py files ✅ DONE
- [x] Create `apps/api/app/api/__init__.py`
- [x] Create `apps/api/app/api/v1/__init__.py`
- [x] Create `apps/api/app/db/models/__init__.py`

## Task B: Clean up dependencies.py ✅ DONE
- [x] Remove duplicate code and fix import ordering
- [x] Keep only clean dependency functions

## Task C: Clean up auth_routes.py ✅ DONE
- [x] Remove inline dependency functions (get_current_user, require_roles)
- [x] Import from core.dependencies instead

## Task D: Add root "/" endpoint in main.py ✅ DONE
- [x] Add @app.get("/") for browser access

## Task E: Verify everything works
- [ ] Test API endpoints work correctly

