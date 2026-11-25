import { Link } from 'react-router-dom';
import { BoxIcon, ClipboardIcon } from '../common/Icons';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function UserBar({ user, onLogout }) {
  if (!user) return null;

  const isStaff = user.role === 'staff';

  return (
    <div className="card lab-card mb-3 overflow-hidden">
      <div className="card-header bg-white border-bottom py-2 small text-muted fw-medium">
        Phiên đăng nhập: {isStaff ? 'Nhân viên quản lý' : 'Sinh viên'}
      </div>
      <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <span
            className={`lab-avatar lab-avatar-lg ${
              isStaff
                ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                : 'bg-info-subtle text-info-emphasis border border-info-subtle'
            }`}
          >
            {getInitials(user.fullName)}
          </span>
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <strong className="fs-5 text-dark">{user.fullName}</strong>
              <span
                className={`badge rounded-pill px-2 py-1 ${
                  isStaff
                    ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                    : 'bg-info-subtle text-info-emphasis border border-info-subtle'
                }`}
              >
                {isStaff ? 'Nhân viên' : 'Sinh viên'}
              </span>
            </div>
            <div className="text-muted small">{user.email}</div>
          </div>

          {isStaff && (
            <div className="d-flex flex-wrap gap-2 ms-md-3">
              <Link
                className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1"
                to="/"
              >
                <BoxIcon size={14} />
                <span>Quản lý thiết bị</span>
              </Link>
              <Link
                className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1"
                to="/phieu-muon"
              >
                <ClipboardIcon size={14} />
                <span>Tất cả phiếu mượn</span>
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
          onClick={onLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
