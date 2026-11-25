import { getDb, getLocalNowDateTimeSQL } from '../db/connection.js';
import { AppError } from '../utils/apiResponse.js';

export async function listReservations({ equipmentId } = {}) {
  const db = getDb();
  const params = [];
  let whereClause = '';

  if (equipmentId !== undefined && equipmentId !== null && equipmentId !== '') {
    const parsedId = Number(equipmentId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'equipment_id không hợp lệ.');
    }
    whereClause = 'WHERE r.equipment_id = ?';
    params.push(parsedId);
  }

  return db
    .prepare(
      `
      SELECT
        r.id,
        r.equipment_id,
        e.code AS equipment_code,
        e.name AS equipment_name,
        r.requester_name,
        r.quantity,
        r.status,
        r.created_at
      FROM reservations r
      INNER JOIN equipments e ON e.id = r.equipment_id
      ${whereClause}
      ORDER BY r.id ASC
      `
    )
    .all(...params);
}

export async function createReservation(payload) {
  const db = getDb();
  const details = {};

  const equipmentId = Number(payload?.equipment_id);
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    details.equipment_id = 'Vui lòng chọn thiết bị hợp lệ.';
  }

  const requesterName =
    typeof payload?.requester_name === 'string' ? payload.requester_name.trim() : '';
  if (!requesterName) {
    details.requester_name = 'Vui lòng nhập họ và tên người đặt.';
  }

  const quantity = Number(payload?.quantity);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    details.quantity = 'Số lượng đặt phải là số nguyên lớn hơn 0.';
  }

  if (Object.keys(details).length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Thông tin đặt trước không hợp lệ.', details);
  }

  const eqRow = db
    .prepare(
      `
      SELECT
        e.id,
        e.total_quantity - COALESCE(SUM(CASE WHEN b.returned_at IS NULL THEN b.quantity ELSE 0 END), 0) AS remaining_quantity
      FROM equipments e
      LEFT JOIN borrowings b ON b.equipment_id = e.id
      WHERE e.id = ?
      GROUP BY e.id
      `
    )
    .get(equipmentId);

  if (!eqRow) {
    throw new AppError(404, 'EQUIPMENT_NOT_FOUND', 'Thiết bị không tồn tại.');
  }

  const status = eqRow.remaining_quantity >= quantity ? 'ready' : 'waiting';
  const createdAt = getLocalNowDateTimeSQL();

  const res = db
    .prepare(
      `
      INSERT INTO reservations (equipment_id, requester_name, quantity, status, created_at)
      VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(equipmentId, requesterName, quantity, status, createdAt);

  return db
    .prepare(
      `
      SELECT
        r.id,
        r.equipment_id,
        e.code AS equipment_code,
        e.name AS equipment_name,
        r.requester_name,
        r.quantity,
        r.status,
        r.created_at
      FROM reservations r
      INNER JOIN equipments e ON e.id = r.equipment_id
      WHERE r.id = ?
      `
    )
    .get(res.lastInsertRowid);
}

export async function cancelReservation(rawId) {
  const db = getDb();
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Mã đặt trước không hợp lệ.');
  }

  const current = db.prepare('SELECT id, status FROM reservations WHERE id = ?').get(id);
  if (!current) {
    throw new AppError(404, 'RESERVATION_NOT_FOUND', 'Không tìm thấy yêu cầu đặt trước.');
  }

  if (current.status === 'cancelled') {
    throw new AppError(400, 'ALREADY_CANCELLED', 'Yêu cầu đặt trước này đã được hủy.');
  }

  db.prepare("UPDATE reservations SET status = 'cancelled' WHERE id = ?").run(id);

  return db
    .prepare(
      `
      SELECT
        r.id,
        r.equipment_id,
        e.code AS equipment_code,
        e.name AS equipment_name,
        r.requester_name,
        r.quantity,
        r.status,
        r.created_at
      FROM reservations r
      INNER JOIN equipments e ON e.id = r.equipment_id
      WHERE r.id = ?
      `
    )
    .get(id);
}

