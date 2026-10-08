from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.db.models import User
from sqlalchemy import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get('sub'))
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials')
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials')
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Inactive user')
    return current_user

async def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role.name != 'Admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Admin privileges required')
    return current_user

async def require_manager_or_admin(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role.name not in ('Admin', 'Manager'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Manager or Admin privileges required')
    return current_user
