-- Cơ sở dữ liệu Rikkei Lab (SQLite 3)

PRAGMA foreign_keys = ON;

-- Bảng quản lý thiết bị
CREATE TABLE IF NOT EXISTS equipments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  category TEXT,
  total_quantity INTEGER NOT NULL DEFAULT 0 CHECK (total_quantity >= 0),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng quản lý phiếu mượn thiết bị (Phần 1)
CREATE TABLE IF NOT EXISTS borrowings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  borrower_name TEXT NOT NULL CHECK (length(trim(borrower_name)) > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  returned_at DATETIME DEFAULT NULL,
  note TEXT DEFAULT NULL,
  fine_paid INTEGER NOT NULL DEFAULT 0 CHECK (fine_paid >= 0),

  FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Bảng nhân viên
CREATE TABLE IF NOT EXISTS staffs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  date_of_birth DATE,
  password TEXT NOT NULL,
  address TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng phiếu mượn & công nợ phạt (borrow_tickets)
CREATE TABLE IF NOT EXISTS borrow_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_code TEXT NOT NULL UNIQUE,
  equipment_id INTEGER NOT NULL,
  borrower_name TEXT NOT NULL CHECK (length(trim(borrower_name)) > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  returned_at DATETIME DEFAULT NULL,
  penalty_rate_per_day INTEGER NOT NULL DEFAULT 5000 CHECK (penalty_rate_per_day >= 0),
  penalty_amount INTEGER NOT NULL DEFAULT 0 CHECK (penalty_amount >= 0),
  penalty_paid_amount INTEGER NOT NULL DEFAULT 0 CHECK (penalty_paid_amount >= 0),
  penalty_status TEXT NOT NULL DEFAULT 'NONE' CHECK (penalty_status IN ('NONE', 'UNPAID', 'PARTIAL', 'PAID')),

  FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Bảng lịch sử giao dịch thu tiền phạt (penalty_payments)
CREATE TABLE IF NOT EXISTS penalty_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  borrow_id INTEGER NOT NULL,
  staff_id INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL CHECK (amount_paid > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'BANK_TRANSFER')),
  note TEXT DEFAULT NULL,
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (borrow_id) REFERENCES borrow_tickets(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (staff_id) REFERENCES staffs(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Bảng cấu hình hệ thống
CREATE TABLE IF NOT EXISTS settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đặt trước và hàng chờ
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  requester_name TEXT NOT NULL CHECK (length(trim(requester_name)) > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('ready', 'waiting', 'cancelled')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL CHECK (length(trim(full_name)) > 0),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipments_category ON equipments(category);
CREATE INDEX IF NOT EXISTS idx_borrowings_equipment_id ON borrowings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_due_returned ON borrowings(due_date, returned_at);
CREATE INDEX IF NOT EXISTS idx_borrow_tickets_status ON borrow_tickets(penalty_status);
CREATE INDEX IF NOT EXISTS idx_penalty_payments_borrow_id ON penalty_payments(borrow_id);
CREATE INDEX IF NOT EXISTS idx_penalty_payments_staff_id ON penalty_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_reservations_equipment_id ON reservations(equipment_id);
