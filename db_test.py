import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables from .env file
load_dotenv()

# Get database credentials from environment
db_user = os.getenv("DB_USER", "postgres")
db_password = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME", "postgres")

# Build connection string
database_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

try:
    # Create engine and connect
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print("✅ Successfully connected to PostgreSQL!")
        print(f"\n📊 Server Version:\n{version}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("\n💡 Make sure:")
    print("  1. PostgreSQL is running")
    print("  2. .env file has correct DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME")
