-- Cơ sở dữ liệu Rikkei Lab (PostgreSQL 14+)

-- Bảng quản lý thiết bị
CREATE TABLE IF NOT EXISTS equipments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  total_quantity INTEGER NOT NULL DEFAULT 0 CHECK (total_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng quản lý phiếu mượn thiết bị
CREATE TABLE IF NOT EXISTS borrowings (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  equipment_id INTEGER NOT NULL REFERENCES equipments(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  borrower_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  borrowed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  returned_at TIMESTAMPTZ NULL,
  note TEXT NULL,
  fine_paid INTEGER NOT NULL DEFAULT 0 CHECK (fine_paid >= 0)
);

-- Bảng nhân viên
CREATE TABLE IF NOT EXISTS staffs (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng phiếu mượn & công nợ phạt (borrow_tickets)
CREATE TABLE IF NOT EXISTS borrow_tickets (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket_code VARCHAR(50) NOT NULL UNIQUE,
  equipment_id INTEGER NOT NULL REFERENCES equipments(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  borrower_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  borrowed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  returned_at TIMESTAMPTZ NULL,
  penalty_rate_per_day INTEGER NOT NULL DEFAULT 5000 CHECK (penalty_rate_per_day >= 0),
  penalty_amount INTEGER NOT NULL DEFAULT 0 CHECK (penalty_amount >= 0),
  penalty_paid_amount INTEGER NOT NULL DEFAULT 0 CHECK (penalty_paid_amount >= 0),
  penalty_status VARCHAR(20) NOT NULL DEFAULT 'NONE' CHECK (penalty_status IN ('NONE', 'UNPAID', 'PARTIAL', 'PAID'))
);

-- Bảng lịch sử giao dịch thu tiền phạt (penalty_payments)
CREATE TABLE IF NOT EXISTS penalty_payments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  borrow_id INTEGER NOT NULL REFERENCES borrow_tickets(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  staff_id INTEGER NOT NULL REFERENCES staffs(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  amount_paid INTEGER NOT NULL CHECK (amount_paid > 0),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('CASH', 'BANK_TRANSFER')),
  note TEXT NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng cấu hình hệ thống
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đặt trước và hàng chờ
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  equipment_id INTEGER NOT NULL REFERENCES equipments(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  requester_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('ready', 'waiting', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipments_category ON equipments(category);
CREATE INDEX IF NOT EXISTS idx_borrowings_equipment_id ON borrowings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_due_returned ON borrowings(due_date, returned_at);
CREATE INDEX IF NOT EXISTS idx_borrow_tickets_status ON borrow_tickets(penalty_status);
CREATE INDEX IF NOT EXISTS idx_penalty_payments_borrow_id ON penalty_payments(borrow_id);
CREATE INDEX IF NOT EXISTS idx_penalty_payments_staff_id ON penalty_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_reservations_equipment_id ON reservations(equipment_id);
