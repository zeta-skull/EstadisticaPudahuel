from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Crear usuario administrador por defecto
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrador",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin) 