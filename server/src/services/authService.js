import { getDb } from '../db/connection.js';
import { AppError } from '../utils/apiResponse.js';

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    role: row.role,
    created_at: row.created_at,
  };
}

export async function loginUser({ email, password }) {
  const db = getDb();
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const rawPassword = typeof password === 'string' ? password : '';

  if (!normalizedEmail || !rawPassword) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Vui lòng nhập đầy đủ email và mật khẩu.');
  }

  const user = db
    .prepare('SELECT * FROM users WHERE LOWER(email) = ?')
    .get(normalizedEmail);

  if (!user || user.password_hash !== rawPassword) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không đúng.');
  }

  return sanitizeUser(user);
}

export async function registerUser({ full_name, email, password, role = 'student' }) {
  const db = getDb();
  const details = {};

  const cleanName = typeof full_name === 'string' ? full_name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPassword = typeof password === 'string' ? password : '';
  const cleanRole = role === 'staff' ? 'staff' : 'student';

  if (!cleanName) details.full_name = 'Vui lòng nhập họ và tên.';
  if (!cleanEmail || !cleanEmail.includes('@')) details.email = 'Email không hợp lệ.';
  if (!cleanPassword || cleanPassword.length < 4) {
    details.password = 'Mật khẩu tối thiểu 4 ký tự.';
  }

  if (Object.keys(details).length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Vui lòng điền đầy đủ thông tin đăng ký.', details);
  }

  const exists = db
    .prepare('SELECT id FROM users WHERE LOWER(email) = ?')
    .get(cleanEmail);
  if (exists) {
    throw new AppError(409, 'DUPLICATE_EMAIL', 'Email này đã được đăng ký.', {
      email: 'Email đã tồn tại trong hệ thống.',
    });
  }

  const result = db
    .prepare(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    )
    .run(cleanName, cleanEmail, cleanPassword, cleanRole);

  const created = db
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(result.lastInsertRowid);

  return sanitizeUser(created);
}

export async function getUserById(rawId) {
  const db = getDb();
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Mã người dùng không hợp lệ.');
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy tài khoản.');
  }

  return sanitizeUser(user);
}

export async function getDemoUserByRole(role) {
  const db = getDb();
  const targetRole = role === 'staff' ? 'staff' : 'student';
  const user = db
    .prepare('SELECT * FROM users WHERE role = ? ORDER BY id ASC LIMIT 1')
    .get(targetRole);

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy tài khoản mẫu.');
  }

  return sanitizeUser(user);
}

