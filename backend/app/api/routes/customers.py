from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.deps import get_db, get_current_active_user, require_manager_or_admin
from app.db.models import Customer
from app.schemas.customer import CustomerCreate, CustomerRead, CustomerUpdate

router = APIRouter(prefix='/customers', tags=['customers'])

@router.post('/', response_model=CustomerRead)
async def create_customer(payload: CustomerCreate, db: AsyncSession = Depends(get_db), current_user=Depends(require_manager_or_admin)):
    customer = Customer(**payload.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer

@router.get('/', response_model=list[CustomerRead])
async def list_customers(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_active_user)):
    result = await db.execute(select(Customer).order_by(Customer.created_at.desc()))
    return result.scalars().all()

@router.get('/{customer_id}', response_model=CustomerRead)
async def get_customer(customer_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_active_user)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail='Customer not found')
    return customer

@router.put('/{customer_id}', response_model=CustomerRead)
async def update_customer(customer_id: int, payload: CustomerUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(require_manager_or_admin)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail='Customer not found')
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer

@router.delete('/{customer_id}')
async def delete_customer(customer_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_manager_or_admin)):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail='Customer not found')
    await db.delete(customer)
    await db.commit()
    return {'detail': 'Customer deleted'}
