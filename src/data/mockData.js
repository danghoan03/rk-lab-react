export const EQUIPMENT_CATEGORIES = [
  'Laptop',
  'Màn hình',
  'Bo mạch điện tử',
  'Phụ kiện',
];

export const INITIAL_EQUIPMENT = [
  { id: 'eq-1', code: 'LAB-001', name: 'Laptop Dell Latitude 5420', category: 'Laptop', total: 10, remaining: 8, borrowCount: 64 },
  { id: 'eq-2', code: 'LAB-002', name: 'Laptop Lenovo ThinkPad E14', category: 'Laptop', total: 8, remaining: 6, borrowCount: 19 },
  { id: 'eq-3', code: 'LAB-003', name: 'Màn hình LG 24 inch', category: 'Màn hình', total: 12, remaining: 11, borrowCount: 41 },
  { id: 'eq-4', code: 'LAB-004', name: 'Màn hình Dell 27 inch', category: 'Màn hình', total: 6, remaining: 0, borrowCount: 28 },
  { id: 'eq-5', code: 'LAB-005', name: 'Bo mạch Arduino Uno R3', category: 'Bo mạch điện tử', total: 30, remaining: 26, borrowCount: 52 },
  { id: 'eq-6', code: 'LAB-006', name: 'Bo mạch Raspberry Pi 4 (4GB)', category: 'Bo mạch điện tử', total: 15, remaining: 11, borrowCount: 33 },
  { id: 'eq-7', code: 'LAB-007', name: 'Bàn phím cơ Keychron K2', category: 'Phụ kiện', total: 20, remaining: 20, borrowCount: 20 },
  { id: 'eq-8', code: 'LAB-008', name: 'Chuột không dây Logitech M331', category: 'Phụ kiện', total: 25, remaining: 22, borrowCount: 15 },
  { id: 'eq-9', code: 'LAB-009', name: 'Bo mạch ESP32 Wi-Fi Bluetooth', category: 'Bo mạch điện tử', total: 16, remaining: 11, borrowCount: 12 },
  { id: 'eq-10', code: 'LAB-010', name: 'Màn hình cảm ứng 10 inch HDMI', category: 'Màn hình', total: 5, remaining: 5, borrowCount: 0 },
  { id: 'eq-11', code: 'LAB-011', name: 'Webcam Logitech C920 Full HD', category: 'Phụ kiện', total: 8, remaining: 8, borrowCount: 1 },
  { id: 'eq-12', code: 'LAB-012', name: 'Laptop MacBook Air M2', category: 'Laptop', total: 5, remaining: 4, borrowCount: 14 },
  { id: 'eq-13', code: 'LAB-013', name: 'Bộ nguồn đa năng 30V 5A', category: 'Bo mạch điện tử', total: 10, remaining: 8, borrowCount: 9 },
  { id: 'eq-14', code: 'LAB-014', name: 'Cáp chuyển USB-C sang HDMI', category: 'Phụ kiện', total: 18, remaining: 18, borrowCount: 0 },
];

export const INITIAL_BORROWS = [
  {
    id: 'PM-001',
    equipmentId: 'eq-1',
    equipmentName: 'Laptop Dell Latitude 5420',
    borrowerName: 'Nguyễn Văn An',
    quantity: 2,
    borrowDate: '2026-11-03',
    dueDate: '2026-11-10',
    returnDate: null,
    status: 'overdue',
    note: '',
    finePaid: 0,
  },
  {
    id: 'PM-002',
    equipmentId: 'eq-3',
    equipmentName: 'Màn hình LG 24 inch',
    borrowerName: 'Trần Thị Bình',
    quantity: 1,
    borrowDate: '2026-11-20',
    dueDate: '2026-11-29',
    returnDate: null,
    status: 'borrowing',
    note: 'Dùng cho đồ án tốt nghiệp',
    finePaid: 0,
  },
  {
    id: 'PM-003',
    equipmentId: 'eq-5',
    equipmentName: 'Bo mạch Arduino Uno R3',
    borrowerName: 'Lê Minh Châu',
    quantity: 6,
    borrowDate: '2026-11-01',
    dueDate: '2026-11-08',
    returnDate: '2026-11-07',
    status: 'returned',
    note: 'Đã kiểm tra đủ linh kiện',
    finePaid: 0,
  },
  {
    id: 'PM-004',
    equipmentId: 'eq-6',
    equipmentName: 'Bo mạch Raspberry Pi 4 (4GB)',
    borrowerName: 'Phạm Quốc Dũng',
    quantity: 4,
    borrowDate: '2026-11-21',
    dueDate: '2026-12-01',
    returnDate: null,
    status: 'borrowing',
    note: 'Thực hành IoT nhóm 3',
    finePaid: 0,
  },
  {
    id: 'PM-005',
    equipmentId: 'eq-7',
    equipmentName: 'Bàn phím cơ Keychron K2',
    borrowerName: 'Võ Thị Giang',
    quantity: 2,
    borrowDate: '2026-10-28',
    dueDate: '2026-11-04',
    returnDate: '2026-11-09',
    status: 'returned',
    note: 'Trả muộn 5 ngày, đã nộp phạt',
    finePaid: 50000,
  },
  {
    id: 'PM-006',
    equipmentId: 'eq-8',
    equipmentName: 'Chuột không dây Logitech M331',
    borrowerName: 'Đặng Hữu Hải',
    quantity: 3,
    borrowDate: '2026-11-02',
    dueDate: '2026-11-09',
    returnDate: null,
    status: 'overdue',
    note: 'Chưa liên hệ được sinh viên',
    finePaid: 0,
  },
  {
    id: 'PM-007',
    equipmentId: 'eq-4',
    equipmentName: 'Màn hình Dell 27 inch',
    borrowerName: 'Bùi Thị Lan Anh',
    quantity: 4,
    borrowDate: '2026-11-18',
    dueDate: '2026-11-28',
    returnDate: null,
    status: 'borrowing',
    note: 'Phòng lab thiết kế giao diện',
    finePaid: 0,
  },
  {
    id: 'PM-008',
    equipmentId: 'eq-4',
    equipmentName: 'Màn hình Dell 27 inch',
    borrowerName: 'Hoàng Minh Tuấn',
    quantity: 2,
    borrowDate: '2026-11-08',
    dueDate: '2026-11-18',
    returnDate: null,
    status: 'overdue',
    note: '',
    finePaid: 0,
  },
  {
    id: 'PM-009',
    equipmentId: 'eq-6',
    equipmentName: 'Bo mạch Raspberry Pi 4 (4GB)',
    borrowerName: 'Nguyễn Văn An',
    quantity: 1,
    borrowDate: '2026-10-20',
    dueDate: '2026-10-27',
    returnDate: '2026-10-27',
    status: 'returned',
    note: '',
    finePaid: 0,
  },
  {
    id: 'PM-010',
    equipmentId: 'eq-2',
    equipmentName: 'Laptop Lenovo ThinkPad E14',
    borrowerName: 'Ngô Thanh Hà',
    quantity: 2,
    borrowDate: '2026-11-22',
    dueDate: '2026-12-03',
    returnDate: null,
    status: 'borrowing',
    note: 'Mượn phục vụ hội thảo sinh viên',
    finePaid: 0,
  },
  {
    id: 'PM-011',
    equipmentId: 'eq-12',
    equipmentName: 'Laptop MacBook Air M2',
    borrowerName: 'Đỗ Khắc Huy',
    quantity: 1,
    borrowDate: '2026-11-19',
    dueDate: '2026-11-27',
    returnDate: null,
    status: 'borrowing',
    note: 'Kiểm thử ứng dụng iOS',
    finePaid: 0,
  },
  {
    id: 'PM-012',
    equipmentId: 'eq-9',
    equipmentName: 'Bo mạch ESP32 Wi-Fi Bluetooth',
    borrowerName: 'Trịnh Thị Ngọc Mai',
    quantity: 5,
    borrowDate: '2026-11-12',
    dueDate: '2026-11-20',
    returnDate: null,
    status: 'overdue',
    note: 'Đang làm đề tài nhà thông minh',
    finePaid: 0,
  },
  {
    id: 'PM-013',
    equipmentId: 'eq-13',
    equipmentName: 'Bộ nguồn đa năng 30V 5A',
    borrowerName: 'Lý Quang Minh',
    quantity: 2,
    borrowDate: '2026-11-23',
    dueDate: '2026-12-05',
    returnDate: null,
    status: 'borrowing',
    note: '',
    finePaid: 0,
  },
  {
    id: 'PM-014',
    equipmentId: 'eq-5',
    equipmentName: 'Bo mạch Arduino Uno R3',
    borrowerName: 'Phan Thị Kim Ngân',
    quantity: 4,
    borrowDate: '2026-11-10',
    dueDate: '2026-11-19',
    returnDate: null,
    status: 'overdue',
    note: 'Mượn cho câu lạc bộ Robotics',
    finePaid: 0,
  },
  {
    id: 'PM-015',
    equipmentId: 'eq-1',
    equipmentName: 'Laptop Dell Latitude 5420',
    borrowerName: 'Vũ Đức Phong',
    quantity: 1,
    borrowDate: '2026-10-25',
    dueDate: '2026-11-01',
    returnDate: '2026-11-01',
    status: 'returned',
    note: 'Máy hoạt động ổn định',
    finePaid: 0,
  },
  {
    id: 'PM-016',
    equipmentId: 'eq-3',
    equipmentName: 'Màn hình LG 24 inch',
    borrowerName: 'Dương Thị Phương',
    quantity: 2,
    borrowDate: '2026-11-01',
    dueDate: '2026-11-10',
    returnDate: '2026-11-12',
    status: 'returned',
    note: 'Trả muộn 2 ngày, đã nộp phạt',
    finePaid: 20000,
  },
  {
    id: 'PM-017',
    equipmentId: 'eq-11',
    equipmentName: 'Webcam Logitech C920 Full HD',
    borrowerName: 'Tạ Hoàng Sơn',
    quantity: 1,
    borrowDate: '2026-11-04',
    dueDate: '2026-11-11',
    returnDate: '2026-11-10',
    status: 'returned',
    note: 'Quay video báo cáo nhóm',
    finePaid: 0,
  },
  {
    id: 'PM-018',
    equipmentId: 'eq-2',
    equipmentName: 'Laptop Lenovo ThinkPad E14',
    borrowerName: 'Cao Thị Thu Thảo',
    quantity: 1,
    borrowDate: '2026-10-15',
    dueDate: '2026-10-22',
    returnDate: '2026-10-21',
    status: 'returned',
    note: '',
    finePaid: 0,
  },
];

export const MONTHLY_BORROW_STATS = [
  { month: 'T1', count: 12 },
  { month: 'T2', count: 18 },
  { month: 'T3', count: 25 },
  { month: 'T4', count: 22 },
  { month: 'T5', count: 9 },
  { month: 'T6', count: 0 },
  { month: 'T7', count: 0 },
  { month: 'T8', count: 30 },
  { month: 'T9', count: 41 },
  { month: 'T10', count: 38 },
  { month: 'T11', count: 27 },
  { month: 'T12', count: 5 },
];

export const INITIAL_RESERVATIONS = [
  {
    id: 'res-1',
    equipmentId: 'eq-4',
    equipmentName: 'Màn hình Dell 27 inch',
    requesterName: 'Trần Thị Bình',
    quantity: 1,
    createdAt: '09/11/2026',
    status: 'ready',
  },
  {
    id: 'res-2',
    equipmentId: 'eq-4',
    equipmentName: 'Màn hình Dell 27 inch',
    requesterName: 'Lê Minh Châu',
    quantity: 2,
    createdAt: '09/11/2026',
    status: 'waiting',
  },
  {
    id: 'res-3',
    equipmentId: 'eq-4',
    equipmentName: 'Màn hình Dell 27 inch',
    requesterName: 'Phạm Quốc Dũng',
    quantity: 1,
    createdAt: '09/11/2026',
    status: 'waiting',
  },
  {
    id: 'res-4',
    equipmentId: 'eq-4',
    equipmentName: 'Màn hình Dell 27 inch',
    requesterName: 'Võ Thị Giang',
    quantity: 1,
    createdAt: '08/11/2026',
    status: 'cancelled',
  },
];

export const INITIAL_USERS = [
  {
    id: 'u-1',
    fullName: 'Nguyễn Văn An',
    email: 'an@rikkei.edu',
    password: '123456',
    role: 'student',
  },
  {
    id: 'u-2',
    fullName: 'Hoàng Thu Hà',
    email: 'ha@rikkei.edu',
    password: '123456',
    role: 'staff',
  },
];

export function formatDateVN(value) {
  if (!value) return '—';
  const str = String(value).trim();

  const vnMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (vnMatch) {
    return `${vnMatch[1]}/${vnMatch[2]}/${vnMatch[3]}`;
  }

  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  return str;
}

export function parseDateVNToISO(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();

  const vnMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (vnMatch) {
    const day = Number(vnMatch[1]);
    const month = Number(vnMatch[2]);
    const year = Number(vnMatch[3]);
    const dt = new Date(Date.UTC(year, month - 1, day));
    if (
      dt.getUTCFullYear() === year &&
      dt.getUTCMonth() === month - 1 &&
      dt.getUTCDate() === day
    ) {
      return `${vnMatch[3]}-${vnMatch[2]}-${vnMatch[1]}`;
    }
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const dt = new Date(Date.UTC(year, month - 1, day));
    if (
      dt.getUTCFullYear() === year &&
      dt.getUTCMonth() === month - 1 &&
      dt.getUTCDate() === day
    ) {
      return trimmed;
    }
  }

  return null;
}

export function formatCurrencyVN(amount) {
  return `${Number(amount || 0).toLocaleString('vi-VN')} đ`;
}

export function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getNowDateTimeVN() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  return `${d}/${m}/${y}`;
}

export function calculateOverdueDays(dueDateISO, returnDateISO) {
  if (!dueDateISO) return 0;
  const endISO = returnDateISO || getTodayISO();
  const due = new Date(`${dueDateISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  const diffDays = Math.floor((end - due) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
