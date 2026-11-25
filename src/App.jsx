import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/common/AppNavbar';
import { LabProvider } from './context/LabContext';
import AccountPage from './pages/AccountPage';
import BorrowPage from './pages/BorrowPage';
import EquipmentPage from './pages/EquipmentPage';
import FinePage from './pages/FinePage';
import ReservationPage from './pages/ReservationPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <LabProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <AppNavbar />
          <main className="container py-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<EquipmentPage />} />
              <Route path="/phieu-muon" element={<BorrowPage />} />
              <Route path="/mo-rong/tien-phat" element={<FinePage />} />
              <Route path="/mo-rong/thong-ke" element={<StatsPage />} />
              <Route path="/mo-rong/dat-truoc" element={<ReservationPage />} />
              <Route path="/mo-rong/tai-khoan" element={<AccountPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="border-top bg-white py-3 mt-4">
            <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2 text-muted small">
              <span>Rikkei Lab · Hệ thống quản lý thiết bị &amp; mượn trả</span>
              <span>Bootstrap 5.3 · React + Express 4 + SQLite</span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </LabProvider>
  );
}
