from datetime import timedelta
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import verify_password, create_access_token
from app.db.models import User

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(self, email: str, password: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Inactive user')
        return user

    def create_token(self, user: User) -> dict[str, str]:
        access_token = create_access_token(subject=user.id, expires_delta=timedelta(minutes=60))
        return {'access_token': access_token, 'token_type': 'bearer'}
