from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config.config import DB_CONFIG
from sqlalchemy.sql import text

def get_db_engine():
    connection_string = (
        f"mssql+pytds://{DB_CONFIG['USERNAME']}:{DB_CONFIG['PASSWORD']}"
        f"@{DB_CONFIG['HOST']}/{DB_CONFIG['DATABASE']}?applicationName=tag-flow-pro?MultipleActiveResultSets=True&Max+Pool+Size=200&TrustServerCertificate=True"
    )
    
    engine = create_engine(connection_string)
    return engine

def get_session():
    engine = get_db_engine()
    Session = sessionmaker(bind=engine)
    
    return Session()

def test_db_connection():
    engine = get_db_engine()
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 AS test"))
            for row in result:
                print(f"Test Query Result: {row[0]}")
        print("Database connection successful!")
    except Exception as e:
        print(f"Error connecting to the database: {e}")

test_db_connection()


