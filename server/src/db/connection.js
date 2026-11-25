import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databaseDir = path.resolve(__dirname, '../../../database');
const dbPath = path.join(databaseDir, 'rikkei_lab.db');

let dbInstance = null;

function ensureSchemaAndSeed(db) {
  const columns = db.prepare('PRAGMA table_info(borrowings)').all();
  const hasFinePaid = columns.some((col) => col.name === 'fine_paid');
  if (!hasFinePaid) {
    db.exec(
      'ALTER TABLE borrowings ADD COLUMN fine_paid INTEGER NOT NULL DEFAULT 0 CHECK (fine_paid >= 0);'
    );
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS staffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      date_of_birth DATE,
      password TEXT NOT NULL,
      address TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

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

    CREATE TABLE IF NOT EXISTS settings (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

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

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL CHECK (length(trim(full_name)) > 0),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff')),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_borrow_tickets_status ON borrow_tickets(penalty_status);
    CREATE INDEX IF NOT EXISTS idx_penalty_payments_borrow_id ON penalty_payments(borrow_id);
    CREATE INDEX IF NOT EXISTS idx_penalty_payments_staff_id ON penalty_payments(staff_id);
    CREATE INDEX IF NOT EXISTS idx_reservations_equipment_id ON reservations(equipment_id);
  `);

  db.prepare(
    "INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES ('fine_rate', '5000')"
  ).run();
  db.prepare(
    "INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES ('base_collected_fine', '1180000')"
  ).run();

  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0) {
    db.prepare(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES ('Nguyễn Văn An', 'an@rikkei.edu', '123456', 'student')"
    ).run();
    db.prepare(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES ('Hoàng Thu Hà', 'ha@rikkei.edu', '123456', 'staff')"
    ).run();
  }

  const staffCount = db.prepare('SELECT COUNT(*) AS count FROM staffs').get().count;
  if (staffCount === 0) {
    const seedSql = fs.readFileSync(path.join(databaseDir, 'seed.sql'), 'utf8');
    const staffMatch = seedSql.match(/INSERT INTO staffs[\s\S]*?;\s*(?=--|\n\n|$)/i);
    const ticketMatch = seedSql.match(/INSERT INTO borrow_tickets[\s\S]*?;\s*(?=--|\n\n|$)/i);
    const paymentMatch = seedSql.match(/INSERT INTO penalty_payments[\s\S]*?;\s*(?=--|\n\n|$)/i);
    if (staffMatch) db.exec(staffMatch[0]);
    if (ticketMatch) db.exec(ticketMatch[0]);
    if (paymentMatch) db.exec(paymentMatch[0]);
  }
}

export function getDb() {
  if (dbInstance) return dbInstance;

  const isNewDb = !fs.existsSync(dbPath);
  dbInstance = new DatabaseSync(dbPath);
  dbInstance.exec('PRAGMA foreign_keys = ON;');

  if (isNewDb) {
    const schemaSql = fs.readFileSync(
      path.join(databaseDir, 'schema.sqlite.sql'),
      'utf8'
    );
    const seedSql = fs.readFileSync(path.join(databaseDir, 'seed.sql'), 'utf8');
    dbInstance.exec(schemaSql);
    dbInstance.exec(seedSql);
  } else {
    ensureSchemaAndSeed(dbInstance);
  }

  return dbInstance;
}

export function getLocalTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLocalNowDateTimeSQL() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}
