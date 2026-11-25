# Cơ sở dữ liệu Rikkei Lab

Thư mục này chứa thiết kế cơ sở dữ liệu cho hệ thống quản lý thiết bị phòng Lab.

## Cấu trúc bảng

### 1. `equipments`
| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT / INTEGER | `PRIMARY KEY`, tự tăng | Khóa chính |
| `code` | VARCHAR(50) / TEXT | `NOT NULL`, `UNIQUE` | Mã thiết bị (không trùng nhau) |
| `name` | VARCHAR(255) / TEXT | `NOT NULL` | Tên thiết bị (bắt buộc) |
| `category` | VARCHAR(100) / TEXT | Nullable | Loại thiết bị |
| `total_quantity` | INT / INTEGER | `NOT NULL`, `DEFAULT 0`, `CHECK (total_quantity >= 0)` | Tổng số lượng (không âm) |
| `created_at` | TIMESTAMP / DATETIME | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Thời điểm tạo |

### 2. `borrowings`
| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | INT / INTEGER | `PRIMARY KEY`, tự tăng | Khóa chính |
| `equipment_id` | INT / INTEGER | `NOT NULL`, `FOREIGN KEY -> equipments(id)` | Mã thiết bị được mượn |
| `borrower_name` | VARCHAR(255) / TEXT | `NOT NULL` | Tên người mượn (bắt buộc) |
| `quantity` | INT / INTEGER | `NOT NULL`, `CHECK (quantity > 0)` | Số lượng mượn (> 0) |
| `borrowed_at` | DATETIME / TIMESTAMPTZ | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Thời điểm mượn |
| `due_date` | DATE | `NOT NULL` | Hạn trả |
| `returned_at` | DATETIME / TIMESTAMPTZ | `NULL` | Thời điểm trả (`NULL` nếu chưa trả) |
| `note` | TEXT | `NULL` | Ghi chú (có thể null) |

## Danh sách tệp

- `schema.sql`: Script khởi tạo cho **MySQL 8.0+**.
- `schema.postgres.sql`: Script khởi tạo cho **PostgreSQL 14+**.
- `schema.sqlite.sql`: Script khởi tạo cho **SQLite 3**.
- `seed.sql`: Dữ liệu mẫu dùng chung cho cả 3 hệ quản trị CSDL.
- `rikkei_lab.db`: Tệp CSDL **SQLite** đã được khởi tạo và nạp sẵn dữ liệu mẫu.

## Truy vấn mẫu tính số lượng còn lại

```sql
SELECT
  e.id,
  e.code,
  e.name,
  e.category,
  e.total_quantity,
  e.total_quantity - COALESCE(SUM(CASE WHEN b.returned_at IS NULL THEN b.quantity ELSE 0 END), 0) AS remaining_quantity
FROM equipments e
LEFT JOIN borrowings b ON b.equipment_id = e.id
GROUP BY e.id, e.code, e.name, e.category, e.total_quantity;
```

