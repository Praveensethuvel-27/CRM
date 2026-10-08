from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, DECIMAL, Boolean, func
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Role(Base):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    users = relationship('User', back_populates='role')

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    role = relationship('Role', back_populates='users')
    leads = relationship('Lead', back_populates='assignee')
    customers = relationship('Customer', back_populates='owner')
    deals = relationship('Deal', back_populates='owner')
    tasks = relationship('Task', back_populates='assignee')
    quotations = relationship('Quotation', back_populates='creator')
    invoices = relationship('Invoice', back_populates='creator')
    activities = relationship('Activity', back_populates='user')
    notifications = relationship('Notification', back_populates='user')

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    industry = Column(String(128))
    address = Column(Text)
    email = Column(String(255))
    phone = Column(String(50))
    owner_id = Column(Integer, ForeignKey('users.id'))
    status = Column(String(50), default='active')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    owner = relationship('User', back_populates='customers')
    contacts = relationship('Contact', back_populates='customer', cascade='all, delete')
    leads = relationship('Lead', back_populates='customer')
    deals = relationship('Deal', back_populates='customer')
    quotations = relationship('Quotation', back_populates='customer')
    invoices = relationship('Invoice', back_populates='customer')

class Contact(Base):
    __tablename__ = 'contacts'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    first_name = Column(String(128), nullable=False)
    last_name = Column(String(128))
    email = Column(String(255))
    phone = Column(String(50))
    job_title = Column(String(128))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    customer = relationship('Customer', back_populates='contacts')

class Lead(Base):
    __tablename__ = 'leads'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    source = Column(String(128))
    status = Column(String(64), default='new')
    value = Column(DECIMAL(12, 2), default=0)
    assigned_to = Column(Integer, ForeignKey('users.id'))
    customer_id = Column(Integer, ForeignKey('customers.id'))
    converted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    assignee = relationship('User', back_populates='leads')
    customer = relationship('Customer', back_populates='leads')

class Deal(Base):
    __tablename__ = 'deals'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    stage = Column(String(64), default='prospecting')
    amount = Column(DECIMAL(12, 2), default=0)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    owner_id = Column(Integer, ForeignKey('users.id'))
    close_date = Column(Date)
    status = Column(String(64), default='open')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    customer = relationship('Customer', back_populates='deals')
    owner = relationship('User', back_populates='deals')

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_to = Column(Integer, ForeignKey('users.id'))
    due_date = Column(Date)
    status = Column(String(64), default='pending')
    priority = Column(String(32), default='medium')
    related_type = Column(String(50))
    related_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    assignee = relationship('User', back_populates='tasks')

class Quotation(Base):
    __tablename__ = 'quotations'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    reference = Column(String(128), nullable=False)
    total = Column(DECIMAL(12, 2), default=0)
    valid_until = Column(Date)
    status = Column(String(64), default='draft')
    created_by = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    customer = relationship('Customer', back_populates='quotations')
    creator = relationship('User', back_populates='quotations')

class Invoice(Base):
    __tablename__ = 'invoices'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    reference = Column(String(128), nullable=False)
    total = Column(DECIMAL(12, 2), default=0)
    due_date = Column(Date)
    status = Column(String(64), default='unpaid')
    issued_at = Column(Date)
    created_by = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    customer = relationship('Customer', back_populates='invoices')
    creator = relationship('User', back_populates='invoices')
    payments = relationship('Payment', back_populates='invoice', cascade='all, delete')

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey('invoices.id'), nullable=False)
    amount = Column(DECIMAL(12, 2), nullable=False)
    method = Column(String(64))
    paid_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    invoice = relationship('Invoice', back_populates='payments')

class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    subject = Column(String(255))
    details = Column(Text)
    related_type = Column(String(50))
    related_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship('User', back_populates='activities')

class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship('User', back_populates='notifications')

class Setting(Base):
    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), default='CRM Portal')
    company_address = Column(Text)
    company_phone = Column(String(50))
    company_email = Column(String(255))
    logo_url = Column(String(255))
    currency = Column(String(16), default='USD')
    timezone = Column(String(64), default='UTC')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
