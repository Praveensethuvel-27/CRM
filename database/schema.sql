CREATE DATABASE IF NOT EXISTS crm_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crm_portal;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(128),
    address TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    owner_id INT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128),
    email VARCHAR(255),
    phone VARCHAR(50),
    job_title VARCHAR(128),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(128),
    status VARCHAR(64) DEFAULT 'new',
    value DECIMAL(12,2) DEFAULT 0,
    assigned_to INT,
    customer_id INT DEFAULT NULL,
    converted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    stage VARCHAR(64) DEFAULT 'prospecting',
    amount DECIMAL(12,2) DEFAULT 0,
    customer_id INT,
    owner_id INT,
    close_date DATE,
    status VARCHAR(64) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT,
    due_date DATE,
    status VARCHAR(64) DEFAULT 'pending',
    priority VARCHAR(32) DEFAULT 'medium',
    related_type VARCHAR(50),
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    reference VARCHAR(128) NOT NULL,
    total DECIMAL(12,2) DEFAULT 0,
    valid_until DATE,
    status VARCHAR(64) DEFAULT 'draft',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    reference VARCHAR(128) NOT NULL,
    total DECIMAL(12,2) DEFAULT 0,
    due_date DATE,
    status VARCHAR(64) DEFAULT 'unpaid',
    issued_at DATE DEFAULT CURRENT_DATE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(64),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255),
    details TEXT,
    related_type VARCHAR(50),
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) DEFAULT 'CRM Portal',
    company_address TEXT,
    company_phone VARCHAR(50),
    company_email VARCHAR(255),
    logo_url VARCHAR(255),
    currency VARCHAR(16) DEFAULT 'USD',
    timezone VARCHAR(64) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('Admin', 'Full access to all CRM features'),
('Manager', 'Manage sales operations and teams'),
('Employee', 'Standard user with limited access');

INSERT INTO users (email, full_name, hashed_password, role_id, is_active) VALUES
('admin@crm.local', 'Platform Admin', '$2b$12$kpotFUW9sL0XT7VpGNoYBOpEzCG5pivTH1Y2ouUbSu.8y5PMd8e9G', 1, 1);
