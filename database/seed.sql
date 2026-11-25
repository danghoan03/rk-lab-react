-- Dữ liệu mẫu tiếng Việt có dấu (equipments, borrowings, staffs, borrow_tickets, penalty_payments, settings, reservations, users)

INSERT INTO equipments (code, name, category, total_quantity) VALUES
  ('LAB-001', 'Laptop Dell Latitude 5420', 'Laptop', 10),
  ('LAB-002', 'Laptop Lenovo ThinkPad E14', 'Laptop', 8),
  ('LAB-003', 'Màn hình LG 24 inch', 'Màn hình', 12),
  ('LAB-004', 'Màn hình Dell 27 inch', 'Màn hình', 6),
  ('LAB-005', 'Bo mạch Arduino Uno R3', 'Bo mạch điện tử', 30),
  ('LAB-006', 'Bo mạch Raspberry Pi 4 (4GB)', 'Bo mạch điện tử', 15),
  ('LAB-007', 'Bàn phím cơ Keychron K2', 'Phụ kiện', 20),
  ('LAB-008', 'Chuột không dây Logitech M331', 'Phụ kiện', 25),
  ('LAB-009', 'Bo mạch ESP32 Wi-Fi Bluetooth', 'Bo mạch điện tử', 16),
  ('LAB-010', 'Màn hình cảm ứng 10 inch HDMI', 'Màn hình', 5),
  ('LAB-011', 'Webcam Logitech C920 Full HD', 'Phụ kiện', 8),
  ('LAB-012', 'Laptop MacBook Air M2', 'Laptop', 5),
  ('LAB-013', 'Bộ nguồn đa năng 30V 5A', 'Bo mạch điện tử', 10),
  ('LAB-014', 'Cáp chuyển USB-C sang HDMI', 'Phụ kiện', 18);

INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note, fine_paid) VALUES
  ((SELECT id FROM equipments WHERE code = 'LAB-001'), 'Nguyễn Văn An', 2, '2026-11-03 08:30:00', '2026-11-10', NULL, NULL, 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-008'), 'Đặng Hữu Hải', 3, '2026-11-02 13:30:00', '2026-11-09', NULL, 'Chưa liên hệ được sinh viên', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Hoàng Minh Tuấn', 2, '2026-11-08 09:30:00', '2026-11-18', NULL, NULL, 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-009'), 'Trịnh Thị Ngọc Mai', 5, '2026-11-12 08:20:00', '2026-11-20', NULL, 'Đang làm đề tài nhà thông minh', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-005'), 'Phan Thị Kim Ngân', 4, '2026-11-10 09:15:00', '2026-11-19', NULL, 'Mượn cho câu lạc bộ Robotics', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-003'), 'Trần Thị Bình', 1, '2026-11-20 09:00:00', '2026-11-29', NULL, 'Dùng cho đồ án tốt nghiệp', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-006'), 'Phạm Quốc Dũng', 4, '2026-11-21 14:00:00', '2026-12-01', NULL, 'Thực hành IoT nhóm 3', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Bùi Thị Lan Anh', 4, '2026-11-18 08:00:00', '2026-11-28', NULL, 'Phòng lab thiết kế giao diện', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-002'), 'Ngô Thanh Hà', 2, '2026-11-22 10:00:00', '2026-12-03', NULL, 'Mượn phục vụ hội thảo sinh viên', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-012'), 'Đỗ Khắc Huy', 1, '2026-11-19 15:10:00', '2026-11-27', NULL, 'Kiểm thử ứng dụng iOS', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-013'), 'Lý Quang Minh', 2, '2026-11-23 13:45:00', '2026-12-05', NULL, NULL, 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-005'), 'Lê Minh Châu', 6, '2026-11-01 10:15:00', '2026-11-08', '2026-11-07 15:20:00', 'Đã kiểm tra đủ linh kiện', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-007'), 'Võ Thị Giang', 2, '2026-10-28 08:45:00', '2026-11-04', '2026-11-09 11:00:00', 'Trả muộn 5 ngày, đã nộp phạt', 50000),
  ((SELECT id FROM equipments WHERE code = 'LAB-006'), 'Nguyễn Văn An', 1, '2026-10-20 09:10:00', '2026-10-27', '2026-10-27 16:00:00', NULL, 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-001'), 'Vũ Đức Phong', 1, '2026-10-25 14:20:00', '2026-11-01', '2026-11-01 17:00:00', 'Máy hoạt động ổn định', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-003'), 'Dương Thị Phương', 2, '2026-11-01 08:00:00', '2026-11-10', '2026-11-12 10:30:00', 'Trả muộn 2 ngày, đã nộp phạt', 20000),
  ((SELECT id FROM equipments WHERE code = 'LAB-011'), 'Tạ Hoàng Sơn', 1, '2026-11-04 11:00:00', '2026-11-11', '2026-11-10 16:40:00', 'Quay video báo cáo nhóm', 0),
  ((SELECT id FROM equipments WHERE code = 'LAB-002'), 'Cao Thị Thu Thảo', 1, '2026-10-15 08:30:00', '2026-10-22', '2026-10-21 15:00:00', NULL, 0);

-- 10 nhân viên mẫu tiếng Việt có dấu
INSERT INTO staffs (username, name, date_of_birth, password, address) VALUES
  ('ha.hoang', 'Hoàng Thu Hà', '1996-04-12', '123456', 'Số 18 Cầu Giấy, Hà Nội'),
  ('nam.nguyen', 'Nguyễn Thành Nam', '1994-09-23', '123456', 'Số 45 Nguyễn Trãi, Thanh Xuân, Hà Nội'),
  ('linh.tran', 'Trần Khánh Linh', '1998-01-15', '123456', 'Số 102 Lê Lợi, Hải Châu, Đà Nẵng'),
  ('hung.pham', 'Phạm Mạnh Hùng', '1993-11-08', '123456', 'Số 27 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'),
  ('thao.le', 'Lê Phương Thảo', '1999-07-19', '123456', 'Số 88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh'),
  ('khoa.vo', 'Võ Đăng Khoa', '1995-03-27', '123456', 'Số 14 Nguyễn Văn Linh, Ninh Kiều, Cần Thơ'),
  ('vy.bui', 'Bùi Bảo Vy', '1997-12-05', '123456', 'Số 63 Phan Chu Trinh, TP. Huế'),
  ('tuan.do', 'Đỗ Anh Tuấn', '1992-06-30', '123456', 'Số 119 Trần Hưng Đạo, TP. Hải Phòng'),
  ('ngoc.dang', 'Đặng Hồng Ngọc', '1998-08-14', '123456', 'Số 52 Quang Trung, TP. Vinh, Nghệ An'),
  ('dat.ngo', 'Ngô Tiến Đạt', '1996-10-21', '123456', 'Số 210 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh');

-- 12 phiếu mượn trong bảng borrow_tickets (đủ NONE, UNPAID, PARTIAL, PAID)
INSERT INTO borrow_tickets (
  ticket_code, equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at,
  penalty_rate_per_day, penalty_amount, penalty_paid_amount, penalty_status
) VALUES
  ('BT-001', (SELECT id FROM equipments WHERE code = 'LAB-001'), 'Nguyễn Văn An', 2, '2026-11-03 08:30:00', '2026-11-10', NULL, 5000, 150000, 0, 'UNPAID'),
  ('BT-002', (SELECT id FROM equipments WHERE code = 'LAB-008'), 'Đặng Hữu Hải', 3, '2026-11-02 13:30:00', '2026-11-09', NULL, 5000, 240000, 100000, 'PARTIAL'),
  ('BT-003', (SELECT id FROM equipments WHERE code = 'LAB-004'), 'Hoàng Minh Tuấn', 2, '2026-11-08 09:30:00', '2026-11-18', NULL, 10000, 140000, 0, 'UNPAID'),
  ('BT-004', (SELECT id FROM equipments WHERE code = 'LAB-009'), 'Trịnh Thị Ngọc Mai', 5, '2026-11-12 08:20:00', '2026-11-20', NULL, 5000, 125000, 50000, 'PARTIAL'),
  ('BT-005', (SELECT id FROM equipments WHERE code = 'LAB-005'), 'Phan Thị Kim Ngân', 4, '2026-11-10 09:15:00', '2026-11-19', '2026-11-23 14:30:00', 5000, 80000, 30000, 'PARTIAL'),
  ('BT-006', (SELECT id FROM equipments WHERE code = 'LAB-007'), 'Võ Thị Giang', 2, '2026-10-28 08:45:00', '2026-11-04', '2026-11-09 11:00:00', 5000, 50000, 50000, 'PAID'),
  ('BT-007', (SELECT id FROM equipments WHERE code = 'LAB-003'), 'Dương Thị Phương', 2, '2026-11-01 08:00:00', '2026-11-10', '2026-11-12 10:30:00', 5000, 20000, 20000, 'PAID'),
  ('BT-008', (SELECT id FROM equipments WHERE code = 'LAB-012'), 'Đỗ Khắc Huy', 1, '2026-10-15 08:30:00', '2026-10-22', '2026-10-28 09:15:00', 15000, 90000, 90000, 'PAID'),
  ('BT-009', (SELECT id FROM equipments WHERE code = 'LAB-002'), 'Ngô Thanh Hà', 2, '2026-11-10 09:00:00', '2026-11-17', '2026-11-20 16:00:00', 10000, 60000, 0, 'UNPAID'),
  ('BT-010', (SELECT id FROM equipments WHERE code = 'LAB-006'), 'Phạm Quốc Dũng', 4, '2026-11-21 14:00:00', '2026-12-01', NULL, 5000, 0, 0, 'NONE'),
  ('BT-011', (SELECT id FROM equipments WHERE code = 'LAB-005'), 'Lê Minh Châu', 6, '2026-11-01 10:15:00', '2026-11-08', '2026-11-07 15:20:00', 5000, 0, 0, 'NONE'),
  ('BT-012', (SELECT id FROM equipments WHERE code = 'LAB-013'), 'Lý Quang Minh', 2, '2026-11-23 13:45:00', '2026-12-05', NULL, 8000, 0, 0, 'NONE');

-- 10 giao dịch thu tiền phạt mẫu
INSERT INTO penalty_payments (borrow_id, staff_id, amount_paid, payment_method, note, paid_at) VALUES
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-006'), (SELECT id FROM staffs WHERE username = 'ha.hoang'), 50000, 'CASH', 'Thu đủ tiền phạt trả muộn bàn phím cơ', '2026-11-09 11:05:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-007'), (SELECT id FROM staffs WHERE username = 'nam.nguyen'), 20000, 'BANK_TRANSFER', 'Sinh viên chuyển khoản VietQR đủ tiền phạt', '2026-11-12 10:35:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-008'), (SELECT id FROM staffs WHERE username = 'linh.tran'), 40000, 'CASH', 'Thu đợt 1 tiền mặt tại quầy Lab', '2026-10-28 09:20:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-008'), (SELECT id FROM staffs WHERE username = 'ha.hoang'), 50000, 'BANK_TRANSFER', 'Thu nốt phần còn lại qua chuyển khoản', '2026-10-29 14:10:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-002'), (SELECT id FROM staffs WHERE username = 'hung.pham'), 60000, 'CASH', 'Tạm thu trước 60.000đ tiền mặt', '2026-11-18 15:00:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-002'), (SELECT id FROM staffs WHERE username = 'thao.le'), 40000, 'BANK_TRANSFER', 'Thu thêm 40.000đ chuyển khoản, còn nợ lại', '2026-11-22 10:15:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-004'), (SELECT id FROM staffs WHERE username = 'khoa.vo'), 20000, 'CASH', 'Đóng phạt đợt 1 bằng tiền mặt', '2026-11-22 16:40:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-004'), (SELECT id FROM staffs WHERE username = 'vy.bui'), 30000, 'CASH', 'Đóng tiếp đợt 2 tiền mặt', '2026-11-24 09:05:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-005'), (SELECT id FROM staffs WHERE username = 'tuan.do'), 15000, 'BANK_TRANSFER', 'Chuyển khoản 15.000đ khi trả bo mạch', '2026-11-23 14:35:00'),
  ((SELECT id FROM borrow_tickets WHERE ticket_code = 'BT-005'), (SELECT id FROM staffs WHERE username = 'ngoc.dang'), 15000, 'CASH', 'Nộp bổ sung 15.000đ tiền mặt tại phòng Lab', '2026-11-24 11:20:00');

INSERT INTO settings (setting_key, setting_value) VALUES
  ('fine_rate', '5000'),
  ('base_collected_fine', '1180000');

INSERT INTO reservations (equipment_id, requester_name, quantity, status, created_at) VALUES
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Trần Thị Bình', 1, 'ready', '2026-11-09 08:15:00'),
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Lê Minh Châu', 2, 'waiting', '2026-11-09 09:40:00'),
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Phạm Quốc Dũng', 1, 'waiting', '2026-11-09 10:02:00'),
  ((SELECT id FROM equipments WHERE code = 'LAB-004'), 'Võ Thị Giang', 1, 'cancelled', '2026-11-08 16:30:00');

INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Nguyễn Văn An', 'an@rikkei.edu', '123456', 'student'),
  ('Hoàng Thu Hà', 'ha@rikkei.edu', '123456', 'staff');
