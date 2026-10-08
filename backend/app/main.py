from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, dashboard, leads, customers

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth")
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}")
app.include_router(leads.router, prefix=f"{settings.API_V1_STR}")
app.include_router(customers.router, prefix=f"{settings.API_V1_STR}")

@app.get('/')
def root():
    return {'message': 'CRM Portal Backend'}
