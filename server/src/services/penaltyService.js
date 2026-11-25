import {
  getDb,
  getLocalNowDateTimeSQL,
  getLocalTodayISO,
} from '../db/connection.js';
import { AppError } from '../utils/apiResponse.js';

const VALID_PENALTY_STATUSES = ['ALL', 'NONE', 'UNPAID', 'PARTIAL', 'PAID'];
const VALID_PAYMENT_METHODS = ['CASH', 'BANK_TRANSFER'];

function diffDaysISO(startISO, endISO) {
  const start = new Date(`${startISO}T00:00:00Z`);
  const end = new Date(`${endISO}T00:00:00Z`);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function computeOverdueDays(dueDate, returnedAt, todayISO = getLocalTodayISO()) {
  if (!dueDate) return 0;
  const compareDate = returnedAt ? String(returnedAt).slice(0, 10) : todayISO;
  return Math.max(0, diffDaysISO(dueDate, compareDate));
}

export function computePenaltyStatus(penaltyAmount, paidAmount) {
  if (penaltyAmount <= 0) return 'NONE';
  if (paidAmount <= 0) return 'UNPAID';
  if (paidAmount < penaltyAmount) return 'PARTIAL';
  return 'PAID';
}

function syncTicketsPenaltyState(db) {
  const todayISO = getLocalTodayISO();
  const tickets = db
    .prepare(
      'SELECT id, quantity, due_date, returned_at, penalty_rate_per_day, penalty_amount, penalty_paid_amount, penalty_status FROM borrow_tickets'
    )
    .all();

  const updateStmt = db.prepare(
    'UPDATE borrow_tickets SET penalty_amount = ?, penalty_status = ? WHERE id = ?'
  );

  for (const t of tickets) {
    const overdueDays = computeOverdueDays(t.due_date, t.returned_at, todayISO);
    const calculatedAmount = overdueDays * t.penalty_rate_per_day * t.quantity;
    const calculatedStatus = computePenaltyStatus(
      calculatedAmount,
      t.penalty_paid_amount
    );

    if (
      calculatedAmount !== t.penalty_amount ||
      calculatedStatus !== t.penalty_status
    ) {
      updateStmt.run(calculatedAmount, calculatedStatus, t.id);
    }
  }
}

function enrichTicketRow(row, todayISO) {
  const overdueDays = computeOverdueDays(row.due_date, row.returned_at, todayISO);
  const remainingDebt = Math.max(0, row.penalty_amount - row.penalty_paid_amount);
  const borrowStatus = row.returned_at
    ? 'returned'
    : overdueDays > 0
    ? 'overdue'
    : 'borrowing';

  return {
    ...row,
    overdue_days: overdueDays,
    is_overdue: overdueDays > 0,
    remaining_debt: remainingDebt,
    borrow_status: borrowStatus,
  };
}

export async function listPenaltyTickets({ penaltyStatus = 'ALL' } = {}) {
  const db = getDb();
  const normalized =
    typeof penaltyStatus === 'string' ? penaltyStatus.trim().toUpperCase() : 'ALL';

  if (!VALID_PENALTY_STATUSES.includes(normalized)) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Trạng thái lọc công nợ phạt không hợp lệ.',
      { penalty_status: `Chỉ chấp nhận: ${VALID_PENALTY_STATUSES.join(', ')}.` }
    );
  }

  syncTicketsPenaltyState(db);
  const todayISO = getLocalTodayISO();

  const whereClause = normalized === 'ALL' ? '' : 'WHERE bt.penalty_status = ?';
  const params = normalized === 'ALL' ? [] : [normalized];

  const rows = db
    .prepare(
      `
      SELECT
        bt.id,
        bt.ticket_code,
        bt.equipment_id,
        e.code AS equipment_code,
        e.name AS equipment_name,
        bt.borrower_name,
        bt.quantity,
        bt.borrowed_at,
        bt.due_date,
        bt.returned_at,
        bt.penalty_rate_per_day,
        bt.penalty_amount,
        bt.penalty_paid_amount,
        bt.penalty_status
      FROM borrow_tickets bt
      INNER JOIN equipments e ON e.id = bt.equipment_id
      ${whereClause}
      ORDER BY bt.id ASC
      `
    )
    .all(...params);

  return rows.map((row) => enrichTicketRow(row, todayISO));
}

export async function getPenaltyOverview() {
  const db = getDb();
  syncTicketsPenaltyState(db);
  const todayISO = getLocalTodayISO();

  const tickets = await listPenaltyTickets({ penaltyStatus: 'ALL' });

  const countsByStatus = { NONE: 0, UNPAID: 0, PARTIAL: 0, PAID: 0 };
  let totalPenaltyAmount = 0;
  let totalPaidAmount = 0;
  let totalDebtAmount = 0;
  let overdueTicketsCount = 0;

  for (const ticket of tickets) {
    countsByStatus[ticket.penalty_status] =
      (countsByStatus[ticket.penalty_status] || 0) + 1;
    totalPenaltyAmount += ticket.penalty_amount;
    totalPaidAmount += ticket.penalty_paid_amount;
    totalDebtAmount += ticket.remaining_debt;
    if (ticket.is_overdue) overdueTicketsCount += 1;
  }

  const methodRows = db
    .prepare(
      `
      SELECT
        payment_method,
        COUNT(*) AS count,
        COALESCE(SUM(amount_paid), 0) AS total
      FROM penalty_payments
      GROUP BY payment_method
      `
    )
    .all();

  let cashTotal = 0;
  let bankTransferTotal = 0;
  let paymentsCount = 0;
  for (const row of methodRows) {
    paymentsCount += row.count;
    if (row.payment_method === 'CASH') cashTotal = row.total;
    if (row.payment_method === 'BANK_TRANSFER') bankTransferTotal = row.total;
  }

  return {
    as_of_date: todayISO,
    total_tickets: tickets.length,
    overdue_tickets_count: overdueTicketsCount,
    total_penalty_amount: totalPenaltyAmount,
    total_paid_amount: totalPaidAmount,
    total_debt_amount: totalDebtAmount,
    cash_total: cashTotal,
    bank_transfer_total: bankTransferTotal,
    payments_count: paymentsCount,
    counts_by_status: countsByStatus,
  };
}

export async function listPenaltyPayments({ borrowId } = {}) {
  const db = getDb();
  const params = [];
  let whereClause = '';

  if (borrowId !== undefined && borrowId !== null && borrowId !== '') {
    const parsedId = Number(borrowId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'borrow_id không hợp lệ.');
    }
    whereClause = 'WHERE pp.borrow_id = ?';
    params.push(parsedId);
  }

  return db
    .prepare(
      `
      SELECT
        pp.id,
        pp.borrow_id,
        bt.ticket_code,
        bt.borrower_name,
        e.name AS equipment_name,
        pp.staff_id,
        s.username AS staff_username,
        s.name AS staff_name,
        pp.amount_paid,
        pp.payment_method,
        pp.note,
        pp.paid_at
      FROM penalty_payments pp
      INNER JOIN borrow_tickets bt ON bt.id = pp.borrow_id
      INNER JOIN equipments e ON e.id = bt.equipment_id
      INNER JOIN staffs s ON s.id = pp.staff_id
      ${whereClause}
      ORDER BY pp.paid_at DESC, pp.id DESC
      `
    )
    .all(...params);
}

export async function recordPenaltyPayment(payload) {
  const db = getDb();
  syncTicketsPenaltyState(db);
  const details = {};

  const borrowId = Number(payload?.borrow_id);
  if (!Number.isInteger(borrowId) || borrowId <= 0) {
    details.borrow_id = 'Vui lòng chọn phiếu mượn hợp lệ.';
  }

  const staffId = Number(payload?.staff_id);
  if (!Number.isInteger(staffId) || staffId <= 0) {
    details.staff_id = 'Vui lòng chọn nhân viên thu tiền.';
  }

  const amountPaid = Number(payload?.amount_paid);
  if (!Number.isInteger(amountPaid) || amountPaid <= 0) {
    details.amount_paid = 'Số tiền thu phải là số nguyên dương (> 0).';
  }

  const paymentMethod =
    typeof payload?.payment_method === 'string'
      ? payload.payment_method.trim().toUpperCase()
      : '';
  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    details.payment_method = 'Hình thức thanh toán chỉ chấp nhận CASH hoặc BANK_TRANSFER.';
  }

  if (Object.keys(details).length > 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Thông tin giao dịch thu tiền phạt không hợp lệ.',
      details
    );
  }

  const note =
    typeof payload?.note === 'string' && payload.note.trim() ? payload.note.trim() : null;

  db.exec('BEGIN IMMEDIATE');
  try {
    const ticket = db
      .prepare('SELECT * FROM borrow_tickets WHERE id = ?')
      .get(borrowId);
    if (!ticket) {
      throw new AppError(404, 'TICKET_NOT_FOUND', `Không tìm thấy phiếu mượn id = ${borrowId}.`);
    }

    const staff = db.prepare('SELECT id, name FROM staffs WHERE id = ?').get(staffId);
    if (!staff) {
      throw new AppError(404, 'STAFF_NOT_FOUND', 'Nhân viên thu tiền không tồn tại.', {
        staff_id: 'Nhân viên không tồn tại.',
      });
    }

    const todayISO = getLocalTodayISO();
    const overdueDays = computeOverdueDays(ticket.due_date, ticket.returned_at, todayISO);
    const totalPenalty = overdueDays * ticket.penalty_rate_per_day * ticket.quantity;
    const remainingDebt = Math.max(0, totalPenalty - ticket.penalty_paid_amount);

    if (totalPenalty <= 0) {
      throw new AppError(
        400,
        'NO_PENALTY',
        `Phiếu ${ticket.ticket_code} không phát sinh tiền phạt.`
      );
    }

    if (remainingDebt <= 0) {
      throw new AppError(
        400,
        'ALREADY_PAID',
        `Phiếu ${ticket.ticket_code} đã thu đủ tiền phạt.`
      );
    }

    if (amountPaid > remainingDebt) {
      throw new AppError(
        400,
        'EXCEEDS_DEBT',
        `Số tiền thu (${amountPaid}) vượt quá công nợ còn lại (${remainingDebt}).`,
        {
          amount_paid: `Số tiền thu tối đa là ${remainingDebt.toLocaleString('vi-VN')} đ.`,
        }
      );
    }

    const newPaidAmount = ticket.penalty_paid_amount + amountPaid;
    const newStatus = computePenaltyStatus(totalPenalty, newPaidAmount);
    const paidAt = getLocalNowDateTimeSQL();

    const insertRes = db
      .prepare(
        `
        INSERT INTO penalty_payments (borrow_id, staff_id, amount_paid, payment_method, note, paid_at)
        VALUES (?, ?, ?, ?, ?, ?)
        `
      )
      .run(borrowId, staffId, amountPaid, paymentMethod, note, paidAt);

    db.prepare(
      `
      UPDATE borrow_tickets
      SET penalty_amount = ?, penalty_paid_amount = ?, penalty_status = ?
      WHERE id = ?
      `
    ).run(totalPenalty, newPaidAmount, newStatus, borrowId);

    db.exec('COMMIT');

    const [updatedTicket] = (await listPenaltyTickets({ penaltyStatus: 'ALL' })).filter(
      (item) => item.id === borrowId
    );
    const paymentRow = db
      .prepare(
        `
        SELECT
          pp.id,
          pp.borrow_id,
          bt.ticket_code,
          bt.borrower_name,
          e.name AS equipment_name,
          pp.staff_id,
          s.username AS staff_username,
          s.name AS staff_name,
          pp.amount_paid,
          pp.payment_method,
          pp.note,
          pp.paid_at
        FROM penalty_payments pp
        INNER JOIN borrow_tickets bt ON bt.id = pp.borrow_id
        INNER JOIN equipments e ON e.id = bt.equipment_id
        INNER JOIN staffs s ON s.id = pp.staff_id
        WHERE pp.id = ?
        `
      )
      .get(insertRes.lastInsertRowid);

    return {
      ticket: updatedTicket,
      payment: paymentRow,
    };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export async function listStaffs() {
  const db = getDb();
  return db
    .prepare(
      'SELECT id, username, name, date_of_birth, address, created_at FROM staffs ORDER BY id ASC'
    )
    .all();
}

