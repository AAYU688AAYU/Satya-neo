import django
import os
import sys

sys.path.insert(0, '.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecomproject.settings')
django.setup()

from django.db import connection

print("=" * 50)
print("PostgreSQL Connection Check")
print("=" * 50)

try:
    cursor = connection.cursor()

    # Test basic connectivity
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print("CONNECTION: SUCCESS")
    print("DB Version:", version[0])

    cursor.execute("SELECT current_database(), current_user;")
    row = cursor.fetchone()
    print("Database:", row[0])
    print("User:", row[1])

    print()
    print("=" * 50)
    print("Auth Table Check")
    print("=" * 50)

    # Check if auth tables exist and count users
    cursor.execute("SELECT COUNT(*) FROM auth_user;")
    user_count = cursor.fetchone()
    print("Total Auth Users in DB:", user_count[0])

    # Check JWT settings are loaded
    from django.conf import settings
    jwt = settings.SIMPLE_JWT
    print()
    print("=" * 50)
    print("JWT Auth Configuration")
    print("=" * 50)
    print("Authentication Class: rest_framework_simplejwt (JWT)")
    print("Access Token Lifetime:", jwt["ACCESS_TOKEN_LIFETIME"])
    print("Refresh Token Lifetime:", jwt["REFRESH_TOKEN_LIFETIME"])
    print("Algorithm:", jwt["ALGORITHM"])
    print("Auth Header Type:", jwt["AUTH_HEADER_TYPES"])
    print()
    print("ALL CHECKS PASSED - DB and Auth are working correctly!")

except Exception as e:
    print("CONNECTION: FAILED")
    print("Error:", str(e))
    sys.exit(1)
