import {
  getDb,
  getLocalNowDateTimeSQL,
  getLocalTodayISO,
} from '../db/connection.js';
import { AppError } from '../utils/apiResponse.js';

const VALID_STATUSES = ['all', 'borrowing', 'overdue', 'returned'];
const MAX_BORROW_DAYS = 14;

function parsePositiveInt(value, fieldName) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', `${fieldName} phải là số nguyên dương.`, {
      [fieldName]: `${fieldName} không hợp lệ.`,
    });
  }
  return num;
}

function parseDueDateToISO(dateStr) {
  if (typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();

  const vnMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (vnMatch) {
    const d = Number(vnMatch[1]);
    const m = Number(vnMatch[2]);
    const y = Number(vnMatch[3]);
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() === m - 1 &&
      dt.getUTCDate() === d
    ) {
      return `${vnMatch[3]}-${vnMatch[2]}-${vnMatch[1]}`;
    }
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = Number(isoMatch[3]);
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() === m - 1 &&
      dt.getUTCDate() === d
    ) {
      return trimmed;
    }
  }

  return null;
}

function formatDateVN(value) {
  if (!value) return '';
  const isoMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }
  return String(value);
}

function diffDaysISO(startISO, endISO) {
  const start = new Date(`${startISO}T00:00:00Z`);
  const end = new Date(`${endISO}T00:00:00Z`);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function formatBorrowingRow(row) {
  return {
    ...row,
    code_label: `PM-${String(row.id).padStart(3, '0')}`,
  };
}

export async function listBorrowings({ status = 'all' } = {}) {
  const db = getDb();
  const normalizedStatus = typeof status === 'string' ? status.trim().toLowerCase() : 'all';

  if (!VALID_STATUSES.includes(normalizedStatus)) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Trạng thái lọc phiếu mượn không hợp lệ.',
      { status: `Chỉ chấp nhận: ${VALID_STATUSES.join(', ')}.` }
    );
  }

  const todayISO = getLocalTodayISO();
  let whereClause = '';
  const params = [todayISO];

  if (normalizedStatus === 'returned') {
    whereClause = 'WHERE b.returned_at IS NOT NULL';
  } else if (normalizedStatus === 'overdue') {
    whereClause = 'WHERE b.returned_at IS NULL AND date(b.due_date) < date(?)';
    params.push(todayISO);
  } else if (normalizedStatus === 'borrowing') {
    whereClause = 'WHERE b.returned_at IS NULL AND date(b.due_date) >= date(?)';
    params.push(todayISO);
  }

  const rows = db
    .prepare(
      `
      SELECT
        b.id,
        b.equipment_id,
        e.code AS equipment_code,
        e.name AS equipment_name,
        b.borrower_name,
        b.quantity,
        b.borrowed_at,
        b.due_date,
        b.returned_at,
        b.note,
        b.fine_paid,
        CASE
          WHEN b.returned_at IS NOT NULL THEN 'returned'
          WHEN date(b.due_date) < date(?) THEN 'overdue'
          ELSE 'borrowing'
        END AS status
      FROM borrowings b
      INNER JOIN equipments e ON e.id = b.equipment_id
      ${whereClause}
      ORDER BY b.id DESC
      `
    )
    .all(...params);

  return rows.map(formatBorrowingRow);
}

export async function getBorrowingById(rawId) {
  const db = getDb();
  const id = parsePositiveInt(rawId, 'id');
  const todayISO = getLocalTodayISO();

  const row = db
    .prepare(
      `
      SELECT
        b.id,
        b.equipment_id,
        e.code AS equipment_code,
        e.name AS equipment_name,
        b.borrower_name,
        b.quantity,
        b.borrowed_at,
        b.due_date,
        b.returned_at,
        b.note,
        b.fine_paid,
        CASE
          WHEN b.returned_at IS NOT NULL THEN 'returned'
          WHEN date(b.due_date) < date(?) THEN 'overdue'
          ELSE 'borrowing'
        END AS status
      FROM borrowings b
      INNER JOIN equipments e ON e.id = b.equipment_id
      WHERE b.id = ?
      `
    )
    .get(todayISO, id);

  if (!row) {
    throw new AppError(404, 'BORROWING_NOT_FOUND', `Không tìm thấy phiếu mượn có id = ${id}.`);
  }

  return formatBorrowingRow(row);
}

export async function createBorrowing(payload) {
  const db = getDb();
  const details = {};

  const equipmentId = Number(payload?.equipment_id);
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    details.equipment_id = 'Vui lòng chọn thiết bị hợp lệ.';
  }

  const borrowerName =
    typeof payload?.borrower_name === 'string' ? payload.borrower_name.trim() : '';
  if (!borrowerName) {
    details.borrower_name = 'Tên người mượn là bắt buộc.';
  } else if (borrowerName.length > 255) {
    details.borrower_name = 'Tên người mượn tối đa 255 ký tự.';
  }

  const quantity = Number(payload?.quantity);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    details.quantity = 'Số lượng mượn phải là số nguyên lớn hơn 0.';
  }

  const todayISO = getLocalTodayISO();
  const dueDate = parseDueDateToISO(payload?.due_date);
  if (!dueDate) {
    details.due_date = 'Hạn trả phải đúng định dạng dd/mm/yyyy.';
  } else {
    const borrowDays = diffDaysISO(todayISO, dueDate);
    if (borrowDays < 0) {
      details.due_date = 'Hạn trả không được nhỏ hơn ngày hiện tại.';
    } else if (borrowDays > MAX_BORROW_DAYS) {
      details.due_date = `Thời hạn mượn tối đa là ${MAX_BORROW_DAYS} ngày kể từ hôm nay.`;
    }
  }

  if (Object.keys(details).length > 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Không thể tạo phiếu mượn. Vui lòng kiểm tra lại thông tin.',
      details
    );
  }

  const note =
    typeof payload?.note === 'string' && payload.note.trim() ? payload.note.trim() : null;

  db.exec('BEGIN IMMEDIATE');
  try {
    const eqRow = db
      .prepare(
        `
        SELECT
          e.id,
          e.name,
          e.total_quantity,
          e.total_quantity - COALESCE(SUM(CASE WHEN b.returned_at IS NULL THEN b.quantity ELSE 0 END), 0) AS remaining_quantity
        FROM equipments e
        LEFT JOIN borrowings b ON b.equipment_id = e.id
        WHERE e.id = ?
        GROUP BY e.id
        `
      )
      .get(equipmentId);

    if (!eqRow) {
      throw new AppError(404, 'EQUIPMENT_NOT_FOUND', 'Thiết bị được chọn không tồn tại.', {
        equipment_id: 'Thiết bị không tồn tại.',
      });
    }

    if (quantity > eqRow.remaining_quantity) {
      throw new AppError(
        400,
        'INSUFFICIENT_QUANTITY',
        `Số lượng mượn (${quantity}) vượt quá số lượng thiết bị đang có (${eqRow.remaining_quantity}).`,
        {
          quantity: `Chỉ còn ${eqRow.remaining_quantity} thiết bị có thể cho mượn.`,
        }
      );
    }

    const borrowedAt = getLocalNowDateTimeSQL();
    const insertResult = db
      .prepare(
        `
        INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
        VALUES (?, ?, ?, ?, ?, NULL, ?)
        `
      )
      .run(equipmentId, borrowerName, quantity, borrowedAt, dueDate, note);

    db.exec('COMMIT');
    return getBorrowingById(insertResult.lastInsertRowid);
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export async function returnBorrowing(rawId, payload = {}) {
  const db = getDb();
  const current = await getBorrowingById(rawId);

  if (current.returned_at) {
    throw new AppError(
      400,
      'ALREADY_RETURNED',
      `Phiếu mượn ${current.code_label} đã được trả vào ${formatDateVN(current.returned_at)}.`
    );
  }

  const todayISO = getLocalTodayISO();
  const rateRow = db
    .prepare("SELECT setting_value FROM settings WHERE setting_key = 'fine_rate'")
    .get();
  const fineRate = rateRow ? Number(rateRow.setting_value) : 5000;
  const overdueDays = Math.max(0, diffDaysISO(current.due_date, todayISO));
  const defaultFine = overdueDays * current.quantity * fineRate;

  const finePaid =
    payload?.fine_paid !== undefined && payload?.fine_paid !== null
      ? Number(payload.fine_paid)
      : defaultFine;

  if (!Number.isInteger(finePaid) || finePaid < 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Tiền phạt phải là số nguyên không âm.', {
      fine_paid: 'Tiền phạt không hợp lệ.',
    });
  }

  const returnedAt = getLocalNowDateTimeSQL();
  db.prepare('UPDATE borrowings SET returned_at = ?, fine_paid = ? WHERE id = ?').run(
    returnedAt,
    finePaid,
    current.id
  );

  return getBorrowingById(current.id);
}

