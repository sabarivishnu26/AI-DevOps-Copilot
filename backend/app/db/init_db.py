from app.db.database import engine, Base
from app.db.models import Incident

def init_db():
    Base.metadata.create_all(bind=engine)
    # Check if details_json column exists, if not add it dynamically (migration safety)
    try:
        with engine.connect() as conn:
            cursor = conn.execute("PRAGMA table_info(incidents);")
            columns = [row[1] for row in cursor.fetchall()]
            if columns and "details_json" not in columns:
                conn.execute("ALTER TABLE incidents ADD COLUMN details_json TEXT;")
    except Exception as e:
        print(f"Database migration check skipped or failed: {e}")