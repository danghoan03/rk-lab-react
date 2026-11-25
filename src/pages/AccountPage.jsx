import { useMemo, useState } from 'react';
import LoginForm from '../components/account/LoginForm';
import MyBorrowings from '../components/account/MyBorrowings';
import RegisterForm from '../components/account/RegisterForm';
import UserBar from '../components/account/UserBar';
import { UserIcon } from '../components/common/Icons';
import { useLab } from '../context/LabContext';
import { parseApiError } from '../services/api';

export default function AccountPage() {
  const { currentUser, borrows, login, register, logout, switchDemoRole } = useLab();
  const [roleError, setRoleError] = useState('');

  const myBorrows = useMemo(() => {
    if (!currentUser) return [];
    return borrows.filter(
      (b) => b.borrowerName.toLowerCase() === currentUser.fullName.toLowerCase()
    );
  }, [borrows, currentUser]);

  const handleSwitchRole = async (role) => {
    setRoleError('');
    try {
      await switchDemoRole(role);
    } catch (err) {
      setRoleError(parseApiError(err, 'Không thể chuyển vai trò.').message);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <span className="lab-icon-box bg-primary-subtle text-primary">
            <UserIcon size={20} />
          </span>
          <div>
            <h1 className="h4 fw-bold mb-0">Phần 2D. Tài khoản và phân quyền</h1>
            <p className="text-muted small mb-0">
              Đăng nhập, đăng ký và giao diện theo vai trò sinh viên / nhân viên
            </p>
          </div>
        </div>

        <div className="btn-group btn-group-sm shadow-sm" role="group" aria-label="Chuyển nhanh vai trò">
          <button
            type="button"
            className={`btn btn-outline-primary ${
              currentUser?.role === 'student' ? 'active' : ''
            }`}
            onClick={() => handleSwitchRole('student')}
          >
            Góc nhìn Sinh viên
          </button>
          <button
            type="button"
            className={`btn btn-outline-warning ${
              currentUser?.role === 'staff' ? 'active' : ''
            }`}
            onClick={() => handleSwitchRole('staff')}
          >
            Góc nhìn Nhân viên
          </button>
        </div>
      </div>

      {roleError && (
        <div className="alert alert-danger border-0 py-2" role="alert">
          {roleError}
        </div>
      )}

      {currentUser ? (
        <>
          <UserBar user={currentUser} onLogout={logout} />
          {currentUser.role === 'student' ? (
            <MyBorrowings borrows={myBorrows} />
          ) : (
            <div className="alert bg-white border lab-card py-3" role="status">
              Bạn đang đăng nhập với quyền <strong>Nhân viên</strong>. Sử dụng thanh điều hướng hoặc các phím tắt trên thanh người dùng để quản lý thiết bị và phiếu mượn.
            </div>
          )}
        </>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <LoginForm onLogin={login} />
          </div>
          <div className="col-md-6">
            <RegisterForm onRegister={register} />
          </div>
        </div>
      )}
    </>
  );
}
