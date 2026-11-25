import { getDb, getLocalNowDateTimeSQL } from '../db/connection.js';
import { AppError } from '../utils/apiResponse.js';

export async function getFineSummary() {
  const db = getDb();
  const rows = db
    .prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('fine_rate', 'base_collected_fine')")
    .all();

  const map = Object.fromEntries(rows.map((r) => [r.setting_key, Number(r.setting_value)]));

  return {
    fine_rate: Number.isFinite(map.fine_rate) ? map.fine_rate : 5000,
    base_collected_fine: Number.isFinite(map.base_collected_fine)
      ? map.base_collected_fine
      : 1180000,
  };
}

export async function updateFineRate(rawRate) {
  const db = getDb();
  const rate = Number(rawRate);

  if (rawRate === undefined || rawRate === null || rawRate === '' || !Number.isInteger(rate) || rate < 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Mức phạt phải là số nguyên không âm.', {
      fine_rate: 'Mức phạt phải là số nguyên >= 0.',
    });
  }

  const now = getLocalNowDateTimeSQL();
  db.prepare(
    `
    INSERT INTO settings (setting_key, setting_value, updated_at)
    VALUES ('fine_rate', ?, ?)
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at
    `
  ).run(String(rate), now);

  return getFineSummary();
}

