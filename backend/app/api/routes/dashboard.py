from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.api.deps import get_db, get_current_active_user
from app.db.models import Customer, Lead, Deal, Activity

router = APIRouter(prefix='/dashboard', tags=['dashboard'])

@router.get('/')
async def dashboard_stats(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_active_user)):
    total_customers = await db.scalar(select(func.count(Customer.id)))
    total_leads = await db.scalar(select(func.count(Lead.id)))
    active_deals = await db.scalar(select(func.count(Deal.id)).where(Deal.status == 'open'))
    recent_activities = (await db.execute(select(Activity).order_by(Activity.created_at.desc()).limit(5))).scalars().all()
    revenue_overview = await db.scalar(select(func.coalesce(func.sum(Deal.amount), 0)))
    return {
        'total_customers': total_customers,
        'total_leads': total_leads,
        'active_deals': active_deals,
        'revenue_overview': float(revenue_overview or 0),
        'recent_activities': recent_activities,
    }
