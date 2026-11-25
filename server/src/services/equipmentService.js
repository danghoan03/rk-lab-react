import { getDb, getLocalTodayISO } from '../db/connection.js';
import { AppError } from '../utils/apiResponse.js';

const EQUIPMENT_SELECT = `
  SELECT
    e.id,
    e.code,
    e.name,
    e.category,
    e.total_quantity,
    e.created_at,
    COALESCE(SUM(CASE WHEN b.returned_at IS NULL THEN b.quantity ELSE 0 END), 0) AS borrowed_quantity,
    e.total_quantity - COALESCE(SUM(CASE WHEN b.returned_at IS NULL THEN b.quantity ELSE 0 END), 0) AS remaining_quantity,
    COUNT(b.id) AS borrow_count
  FROM equipments e
  LEFT JOIN borrowings b ON b.equipment_id = e.id
`;

function parsePositiveInt(value, fieldName) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', `${fieldName} phải là số nguyên dương.`, {
      [fieldName]: `${fieldName} không hợp lệ.`,
    });
  }
  return num;
}

function validateEquipmentPayload(payload, { isUpdate = false } = {}) {
  const details = {};
  const code = typeof payload?.code === 'string' ? payload.code.trim().toUpperCase() : '';
  const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
  const category =
    typeof payload?.category === 'string' && payload.category.trim()
      ? payload.category.trim()
      : null;

  if (!code) {
    details.code = 'Mã thiết bị là bắt buộc.';
  } else if (code.length > 50) {
    details.code = 'Mã thiết bị tối đa 50 ký tự.';
  }

  if (!name) {
    details.name = 'Tên thiết bị là bắt buộc.';
  } else if (name.length > 255) {
    details.name = 'Tên thiết bị tối đa 255 ký tự.';
  }

  const rawTotal = payload?.total_quantity;
  const totalQuantity = Number(rawTotal);
  if (
    rawTotal === undefined ||
    rawTotal === null ||
    rawTotal === '' ||
    !Number.isInteger(totalQuantity) ||
    totalQuantity < 0
  ) {
    details.total_quantity = 'Tổng số lượng phải là số nguyên không âm (>= 0).';
  }

  if (Object.keys(details).length > 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      isUpdate
        ? 'Dữ liệu cập nhật thiết bị không hợp lệ.'
        : 'Dữ liệu thêm thiết bị không hợp lệ.',
      details
    );
  }

  return { code, name, category, totalQuantity };
}

export async function listEquipments({ search = '', category = 'all', page = 1, limit = 6 }) {
  const db = getDb();
  const parsedPage = parsePositiveInt(page, 'page');
  const parsedLimit = parsePositiveInt(limit, 'limit');

  if (parsedLimit > 100) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Giới hạn tối đa mỗi trang là 100.', {
      limit: 'limit không được vượt quá 100.',
    });
  }

  const conditions = [];
  const params = [];

  const keyword = typeof search === 'string' ? search.trim() : '';
  if (keyword) {
    conditions.push('(LOWER(e.name) LIKE LOWER(?) OR LOWER(e.code) LIKE LOWER(?))');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (category && category !== 'all') {
    conditions.push('e.category = ?');
    params.push(category);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = db
    .prepare(`SELECT COUNT(*) AS total FROM equipments e ${whereClause}`)
    .get(...params);

  const total = countRow.total;
  const totalPages = Math.max(1, Math.ceil(total / parsedLimit));
  const safePage = Math.min(parsedPage, totalPages);
  const offset = (safePage - 1) * parsedLimit;

  const rows = db
    .prepare(
      `
      ${EQUIPMENT_SELECT}
      ${whereClause}
      GROUP BY e.id
      ORDER BY e.id DESC
      LIMIT ? OFFSET ?
      `
    )
    .all(...params, parsedLimit, offset);

  return {
    items: rows,
    meta: {
      page: safePage,
      limit: parsedLimit,
      total,
      totalPages,
    },
  };
}

export async function getEquipmentDetail(rawId) {
  const db = getDb();
  const id = parsePositiveInt(rawId, 'id');

  const item = db
    .prepare(
      `
      ${EQUIPMENT_SELECT}
      WHERE e.id = ?
      GROUP BY e.id
      `
    )
    .get(id);

  if (!item) {
    throw new AppError(404, 'EQUIPMENT_NOT_FOUND', `Không tìm thấy thiết bị có id = ${id}.`);
  }

  const todayISO = getLocalTodayISO();
  const recentBorrowings = db
    .prepare(
      `
      SELECT
        id,
        borrower_name,
        quantity,
        borrowed_at,
        due_date,
        returned_at,
        note,
        CASE
          WHEN returned_at IS NOT NULL THEN 'returned'
          WHEN date(due_date) < date(?) THEN 'overdue'
          ELSE 'borrowing'
        END AS status
      FROM borrowings
      WHERE equipment_id = ?
      ORDER BY id DESC
      LIMIT 10
      `
    )
    .all(todayISO, id);

  return {
    ...item,
    recent_borrowings: recentBorrowings,
  };
}

export async function createEquipment(payload) {
  const db = getDb();
  const { code, name, category, totalQuantity } = validateEquipmentPayload(payload);

  const existing = db
    .prepare('SELECT id FROM equipments WHERE LOWER(code) = LOWER(?)')
    .get(code);
  if (existing) {
    throw new AppError(409, 'DUPLICATE_CODE', `Mã thiết bị "${code}" đã tồn tại.`, {
      code: `Mã thiết bị "${code}" đã được sử dụng.`,
    });
  }

  const result = db
    .prepare(
      `
      INSERT INTO equipments (code, name, category, total_quantity)
      VALUES (?, ?, ?, ?)
      `
    )
    .run(code, name, category, totalQuantity);

  return getEquipmentDetail(result.lastInsertRowid);
}

export async function updateEquipment(rawId, payload) {
  const db = getDb();
  const id = parsePositiveInt(rawId, 'id');
  const current = await getEquipmentDetail(id);

  const { code, name, category, totalQuantity } = validateEquipmentPayload(payload, {
    isUpdate: true,
  });

  const duplicate = db
    .prepare('SELECT id FROM equipments WHERE LOWER(code) = LOWER(?) AND id != ?')
    .get(code, id);
  if (duplicate) {
    throw new AppError(409, 'DUPLICATE_CODE', `Mã thiết bị "${code}" đã tồn tại.`, {
      code: `Mã thiết bị "${code}" đã thuộc về thiết bị khác.`,
    });
  }

  if (totalQuantity < current.borrowed_quantity) {
    throw new AppError(
      400,
      'INVALID_TOTAL_QUANTITY',
      `Tổng số lượng (${totalQuantity}) không thể nhỏ hơn số lượng đang được mượn (${current.borrowed_quantity}).`,
      {
        total_quantity: `Phải lớn hơn hoặc bằng số lượng đang mượn (${current.borrowed_quantity}).`,
      }
    );
  }

  db.prepare(
    `
    UPDATE equipments
    SET code = ?, name = ?, category = ?, total_quantity = ?
    WHERE id = ?
    `
  ).run(code, name, category, totalQuantity, id);

  return getEquipmentDetail(id);
}

export async function deleteEquipment(rawId) {
  const db = getDb();
  const id = parsePositiveInt(rawId, 'id');
  await getEquipmentDetail(id);

  const borrowRef = db
    .prepare('SELECT COUNT(*) AS count FROM borrowings WHERE equipment_id = ?')
    .get(id);

  if (borrowRef.count > 0) {
    throw new AppError(
      409,
      'EQUIPMENT_IN_USE',
      'Không thể xóa thiết bị vì đã có lịch sử phiếu mượn liên quan.'
    );
  }

  const ticketRef = db
    .prepare('SELECT COUNT(*) AS count FROM borrow_tickets WHERE equipment_id = ?')
    .get(id);

  if (ticketRef.count > 0) {
    throw new AppError(
      409,
      'EQUIPMENT_IN_USE',
      'Không thể xóa thiết bị vì đã có dữ liệu phiếu mượn phạt liên quan.'
    );
  }

  const reserveRef = db
    .prepare('SELECT COUNT(*) AS count FROM reservations WHERE equipment_id = ?')
    .get(id);

  if (reserveRef.count > 0) {
    throw new AppError(
      409,
      'EQUIPMENT_IN_USE',
      'Không thể xóa thiết bị vì đang có dữ liệu đặt trước liên quan.'
    );
  }

  db.prepare('DELETE FROM equipments WHERE id = ?').run(id);
  return { id };
}

