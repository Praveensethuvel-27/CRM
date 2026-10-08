from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from app.api.deps import get_db, get_current_active_user, require_manager_or_admin
from app.db.models import Lead
from app.schemas.lead import LeadCreate, LeadRead, LeadUpdate

router = APIRouter(prefix='/leads', tags=['leads'])

@router.post('/', response_model=LeadRead)
async def create_lead(payload: LeadCreate, db: AsyncSession = Depends(get_db), current_user=Depends(require_manager_or_admin)):
    lead = Lead(**payload.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead

@router.get('/', response_model=list[LeadRead])
async def list_leads(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_active_user)):
    result = await db.execute(select(Lead).order_by(Lead.created_at.desc()))
    return result.scalars().all()

@router.get('/{lead_id}', response_model=LeadRead)
async def get_lead(lead_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_active_user)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail='Lead not found')
    return lead

@router.put('/{lead_id}', response_model=LeadRead)
async def update_lead(lead_id: int, payload: LeadUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(require_manager_or_admin)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail='Lead not found')
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead

@router.delete('/{lead_id}')
async def delete_lead(lead_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(require_manager_or_admin)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail='Lead not found')
    await db.delete(lead)
    await db.commit()
    return {'detail': 'Lead deleted'}
