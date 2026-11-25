import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'rikkei_lab.db');
const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sqlite.sql'), 'utf8');
const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

let db;
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    db = new DatabaseSync(dbPath);
  } catch (err) {
    if (err.code !== 'EBUSY') throw err;
    db = new DatabaseSync(dbPath);
    db.exec(
      'DROP TABLE IF EXISTS penalty_payments; DROP TABLE IF EXISTS borrow_tickets; DROP TABLE IF EXISTS staffs; DROP TABLE IF EXISTS reservations; DROP TABLE IF EXISTS borrowings; DROP TABLE IF EXISTS equipments; DROP TABLE IF EXISTS settings; DROP TABLE IF EXISTS users;'
    );
  }
} else {
  db = new DatabaseSync(dbPath);
}

db.exec(schemaSql);
db.exec(seedSql);

const eqCount = db.prepare('SELECT COUNT(*) AS count FROM equipments').get().count;
const brCount = db.prepare('SELECT COUNT(*) AS count FROM borrowings').get().count;
const btCount = db.prepare('SELECT COUNT(*) AS count FROM borrow_tickets').get().count;
const ppCount = db.prepare('SELECT COUNT(*) AS count FROM penalty_payments').get().count;
const stCount = db.prepare('SELECT COUNT(*) AS count FROM staffs').get().count;
const resCount = db.prepare('SELECT COUNT(*) AS count FROM reservations').get().count;
const usrCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

console.log(`Initialized ${dbPath}`);
console.log(
  `equipments: ${eqCount}, borrowings: ${brCount}, borrow_tickets: ${btCount}, penalty_payments: ${ppCount}, staffs: ${stCount}, reservations: ${resCount}, users: ${usrCount}`
);

// Verify constraints
const expectFail = (label, fn) => {
  try {
    fn();
    throw new Error(`Expected constraint failure for: ${label}`);
  } catch (err) {
    if (err.message.startsWith('Expected constraint failure')) throw err;
    console.log(`OK [constraint enforced] ${label}`);
  }
};

expectFail('duplicate equipments.code', () => {
  db.prepare("INSERT INTO equipments (code, name, total_quantity) VALUES ('LAB-001', 'Test', 1)").run();
});
expectFail('negative equipments.total_quantity', () => {
  db.prepare("INSERT INTO equipments (code, name, total_quantity) VALUES ('LAB-999', 'Test', -1)").run();
});
expectFail('missing equipments.name', () => {
  db.prepare("INSERT INTO equipments (code, name, total_quantity) VALUES ('LAB-998', '', 1)").run();
});
expectFail('invalid borrowings.equipment_id FK', () => {
  db.prepare("INSERT INTO borrowings (equipment_id, borrower_name, quantity, due_date) VALUES (9999, 'Tester', 1, '2026-12-01')").run();
});
expectFail('zero borrowings.quantity', () => {
  db.prepare("INSERT INTO borrowings (equipment_id, borrower_name, quantity, due_date) VALUES (1, 'Tester', 0, '2026-12-01')").run();
});
expectFail('null borrowings.borrower_name', () => {
  db.prepare("INSERT INTO borrowings (equipment_id, borrower_name, quantity, due_date) VALUES (1, NULL, 1, '2026-12-01')").run();
});
expectFail('invalid penalty_payments.payment_method', () => {
  db.prepare("INSERT INTO penalty_payments (borrow_id, staff_id, amount_paid, payment_method) VALUES (1, 1, 10000, 'CARD')").run();
});

db.close();
