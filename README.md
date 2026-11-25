# Rikkei Lab - React UI

Giao diện quản lý thiết bị phòng Lab được chuyển đổi từ bộ HTML tĩnh + Bootstrap 5.3.3 sang **React 18 + React Router v6 + Vite + Bootstrap 5.3.3**.

## Cấu trúc thư mục

- `src/data/mockData.js`: Dữ liệu mẫu và các hàm định dạng ngày/tiền tệ/tính số ngày quá hạn.
- `src/context/LabContext.jsx`: Quản lý state dùng chung (thiết bị, phiếu mượn, tiền phạt, đặt trước, tài khoản) và các thao tác CRUD.
- `src/components/common/`: `AppNavbar`, `Pagination`, `StatusView` (`LoadingState`, `EmptyState`, `ErrorState`).
- `src/components/equipment/`: `EquipmentToolbar`, `EquipmentTable`, `EquipmentFormModal`, `ConfirmDeleteModal`.
- `src/components/borrow/`: `BorrowForm`, `BorrowFilter`, `BorrowTable`.
- `src/components/fine/`: `FineSummary`, `FineTable`, `ReturnWithFineModal`.
- `src/components/stats/`: `StatCards`, `TopEquipmentTable`, `IdleEquipmentList`, `MonthlyChart`.
- `src/components/reservation/`: `ReserveForm`, `QueueTable`.
- `src/components/account/`: `LoginForm`, `RegisterForm`, `UserBar`, `MyBorrowings`.
- `src/pages/`: 6 trang tương ứng với 6 tệp HTML tĩnh (`EquipmentPage`, `BorrowPage`, `FinePage`, `StatsPage`, `ReservationPage`, `AccountPage`).

## Chạy ứng dụng

```bash
npm install
npm run start
```

