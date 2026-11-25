# Những câu lệnh Prompt AI tạo ra giao diện website

## Prompt 1
Từ những file giao diện tĩnh, hãy thiết kế lại cho tôi thành cấu trúc giao diện theo framework React.

## Prompt 2
Tạo cho tôi cơ sở dữ liệu của dự án với yêu cầu
- Bảng equipments gồm có id (PK, tự tăng) , code (không trùng nhau) , name (tên thiết bị, bắt buộc) , category , total_quantity (không âm) và created_at.
- Bảng borrowings gồm có id (PK, tự tăng), equipment_id (FK), borrower_name (tên người mượn, bắt buộc) , quantity (SL mượn, lớn hơn 0), borrowed_at, due_date, returned_at (để trống nếu chưa trả), note (có thể null)

## Prompt 3
Tạo cho tôi dữ liệu mẫu tiếng Việt có dấu, tối thiểu 12 thiết bị và 15 phiếu mượn đủ các tình huống: đang mượn, đã trả, và phiếu đã quá hạn.

## Prompt 4
Tạo cho tôi dạng kết nối dữ liệu theo chuẩn RESTful API bằng axios theo dạng bất đồng bộ async/await và frame Express 4 với yêu cầu:
- Về Quản Lý Thiết Bị:
 + Danh sách thiết bị có tìm kiếm theo tên hoặc mã, lọc theo loại và phân trang; mỗi thiết bị hiển thị số lượng còn có thể cho mượn.
 + Xem chi tiết, thêm, sửa (kể cả tổng số lượng) và xóa thiết bị. Mã thiết bị là duy nhất.
 + Dữ liệu vào sai phải bị từ chối bằng thông báo rõ ràng, theo định dạng lỗi chung của API.
- Về Mượn và Trả:
 + Tạo phiếu mượn: chọn thiết bị, nhập tên người mượn, số lượng và hạn trả. Ngày mượn là ngày hiện tại. Số lượng mượn không vượt quá số lượng thiết bị đang có. Thời hạn mượn tối đa 14 ngày.
  + Danh sách phiếu mượn hiển thị trạng thái Đang mượn, Đã trả hoặc Quá hạn và lọc được theo trạng thái.
  + Trả thiết bị: hệ thống ghi nhận ngày trả của phiếu.

## Prompt 5
Bây giờ, với những giao diện có trong components, hãy thiết kế lại theo dạng Bootstrap 5 một cách tiêu chuẩn theo format có sẵn để giao diệnV trông đặc sắc hơn không bị theo khuôn khổ tĩnh của HTML.

<!-- Hướng Quá hạn và Tiền phạt -->
## Prompt 6
Tạo cho tôi csdl với 2 bảng theo yêu cầu:
- Với bảng borrow_tickets gồm due_date (hạn trả quy định), returned_at (ngày trả thực tế), penalty_rate_per_day (đơn giá phạt cho phiếu), penalty_amount (tổng tiền phạt), penalty_paid_amount (số tiền phạt đã thu), penalty_status (trạng thái: NONE, UNPAID, PARTIAL, PAID)
- Với bảng penalty_payments gồm id (PK), borrow_id (FK), staff_id (nhân viên thực hiện thu tiền), amount_paid (số tiền thu trong giao dịch này), payment_method (hình thức giao dịch: CASH, BANK_TRANSFER), note (null), paid_at (thời điểm thu tiền).
- Tạo cho tôi thêm  bảng nhân viên gồm id (PK), username , name (họ tên, bắt buộc), date_of_birth, username, password, address.
Mỗi bảng đều thêm cho tôi khoảng 10 dữ liệu mẫu bằng tiếng Việt có dấu.
Tiếp theo, điều kiện phát sinh khi quá hạn là ngày trả thực tế > hạn trả (đối với phiếu đã trả), ngày hiện tại > hạn trả (đối với phiếu đang mượn). Công thức tính tiền phạt: Tiền phạt phát sinh = Số ngày quá hạn * Đơn giá phạt/ngày * Số lượng tài sản.
Thiết kế RESTful API với yêu cầu:
- Lấy danh sách phiếu mượn kèm thông tin quá hạn của người mượn và công nợ phạt
- Lấy báo cáo tổng quan tiền phạt
- Ghi nhận giao dịch thu tiền phạt của 1 phiếu
- Xem lịch sử thu tiền
- Thiết kế thêm giao diện Thống kê
- Thêm bộ lọc với trạng thái Tất cả, Chưa thu, Thu 1 phần và Đã thu đủ

