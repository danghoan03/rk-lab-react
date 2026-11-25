-- Cơ sở dữ liệu Rikkei Lab (MySQL 8.0+)

CREATE DATABASE IF NOT EXISTS rikkei_lab
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rikkei_lab;

-- Bảng quản lý thiết bị
CREATE TABLE IF NOT EXISTS equipments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NULL,
  total_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_equipments_code UNIQUE (code),
  CONSTRAINT chk_equipments_total_quantity CHECK (total_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng quản lý phiếu mượn thiết bị
CREATE TABLE IF NOT EXISTS borrowings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT UNSIGNED NOT NULL,
  borrower_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  returned_at DATETIME NULL DEFAULT NULL,
  note TEXT NULL,
  fine_paid INT NOT NULL DEFAULT 0,

  CONSTRAINT chk_borrowings_quantity CHECK (quantity > 0),
  CONSTRAINT chk_borrowings_fine_paid CHECK (fine_paid >= 0),
  CONSTRAINT fk_borrowings_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng nhân viên
CREATE TABLE IF NOT EXISTS staffs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_staffs_username UNIQUE (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng phiếu mượn & công nợ phạt (borrow_tickets)
CREATE TABLE IF NOT EXISTS borrow_tickets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_code VARCHAR(50) NOT NULL,
  equipment_id INT UNSIGNED NOT NULL,
  borrower_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  returned_at DATETIME NULL DEFAULT NULL,
  penalty_rate_per_day INT NOT NULL DEFAULT 5000,
  penalty_amount INT NOT NULL DEFAULT 0,
  penalty_paid_amount INT NOT NULL DEFAULT 0,
  penalty_status ENUM('NONE', 'UNPAID', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'NONE',

  CONSTRAINT uq_borrow_tickets_code UNIQUE (ticket_code),
  CONSTRAINT chk_bt_quantity CHECK (quantity > 0),
  CONSTRAINT chk_bt_rate CHECK (penalty_rate_per_day >= 0),
  CONSTRAINT chk_bt_amount CHECK (penalty_amount >= 0),
  CONSTRAINT chk_bt_paid CHECK (penalty_paid_amount >= 0),
  CONSTRAINT fk_bt_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng lịch sử giao dịch thu tiền phạt (penalty_payments)
CREATE TABLE IF NOT EXISTS penalty_payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  borrow_id INT UNSIGNED NOT NULL,
  staff_id INT UNSIGNED NOT NULL,
  amount_paid INT NOT NULL,
  payment_method ENUM('CASH', 'BANK_TRANSFER') NOT NULL,
  note TEXT NULL,
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_pp_amount CHECK (amount_paid > 0),
  CONSTRAINT fk_pp_borrow_ticket
    FOREIGN KEY (borrow_id) REFERENCES borrow_tickets(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_pp_staff
    FOREIGN KEY (staff_id) REFERENCES staffs(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng cấu hình hệ thống
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng đặt trước và hàng chờ
CREATE TABLE IF NOT EXISTS reservations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT UNSIGNED NOT NULL,
  requester_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  status ENUM('ready', 'waiting', 'cancelled') NOT NULL DEFAULT 'waiting',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_reservations_quantity CHECK (quantity > 0),
  CONSTRAINT fk_reservations_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'staff') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_equipments_category ON equipments(category);
CREATE INDEX idx_borrowings_equipment_id ON borrowings(equipment_id);
CREATE INDEX idx_borrowings_due_returned ON borrowings(due_date, returned_at);
CREATE INDEX idx_borrow_tickets_status ON borrow_tickets(penalty_status);
CREATE INDEX idx_penalty_payments_borrow_id ON penalty_payments(borrow_id);
CREATE INDEX idx_penalty_payments_staff_id ON penalty_payments(staff_id);
CREATE INDEX idx_reservations_equipment_id ON reservations(equipment_id);
