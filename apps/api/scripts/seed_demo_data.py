#!/usr/bin/env python3
"""
Seed Demo Data Script for EduEquity OS
Creates demo users for testing and development.
"""
import sys
from pathlib import Path

# Add apps/api to path
API_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(API_DIR))

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.db.models.user import User


def seed_demo_data():
    """Create demo users for testing"""
    print("Seeding demo data...")
    
    db = SessionLocal()
    try:
        # Check if users already exist
        existing_admin = db.query(User).filter(User.email == "admin@eduequity.local").first()
        if existing_admin:
            print("Demo data already exists, skipping...")
            return True
        
        # Create admin user
        admin = User(
            email="admin@eduequity.local",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role="admin",
            is_active=True
        )
        db.add(admin)
        
        # Create demo teacher
        teacher = User(
            email="teacher@eduequity.local",
            hashed_password=get_password_hash("teacher123"),
            full_name="Demo Teacher",
            role="teacher",
            is_active=True
        )
        db.add(teacher)
        
        # Create demo student
        student = User(
            email="student@eduequity.local",
            hashed_password=get_password_hash("student123"),
            full_name="Demo Student",
            role="student",
            is_active=True
        )
        db.add(student)
        
        db.commit()
        print("✅ Demo data seeded successfully!")
        print("   Admin: admin@eduequity.local / admin123")
        print("   Teacher: teacher@eduequity.local / teacher123")
        print("   Student: student@eduequity.local / student123")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding demo data: {e}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    success = seed_demo_data()
    sys.exit(0 if success else 1)

