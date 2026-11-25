import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLab } from '../../context/LabContext';
import { BoxIcon, ClipboardIcon, LabIcon } from './Icons';

const EXTENSION_LINKS = [
  { to: '/mo-rong/tien-phat', label: 'A. Quá hạn và tiền phạt', desc: 'Theo dõi nợ phạt & thu phạt' },
  { to: '/mo-rong/thong-ke', label: 'B. Thống kê và báo cáo', desc: 'Tổng quan thiết bị & biểu đồ' },
  { to: '/mo-rong/dat-truoc', label: 'C. Đặt trước và hàng chờ', desc: 'Xếp hàng khi hết thiết bị' },
  { to: '/mo-rong/tai-khoan', label: 'D. Tài khoản và phân quyền', desc: 'Đăng nhập, đăng ký, vai trò' },
];

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { currentUser } = useLab();

  const isExtensionActive = location.pathname.startsWith('/mo-rong');

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark lab-navbar sticky-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="lab-brand-mark">
            <LabIcon size={18} />
          </span>
          <span className="d-flex flex-column lh-1">
            <span>Rikkei Lab</span>
            <small className="fw-normal text-white-50" style={{ fontSize: '0.68rem' }}>
              Quản lý thiết bị
            </small>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="mainMenu"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
          id="mainMenu"
        >
          <ul className="navbar-nav me-auto ms-lg-3 gap-lg-1">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-1 px-3 rounded-2 ${
                    isActive ? 'active bg-white bg-opacity-10 fw-semibold' : ''
                  }`
                }
              >
                <BoxIcon size={15} />
                <span>Thiết bị</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/phieu-muon"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-1 px-3 rounded-2 ${
                    isActive ? 'active bg-white bg-opacity-10 fw-semibold' : ''
                  }`
                }
              >
                <ClipboardIcon size={15} />
                <span>Phiếu mượn</span>
              </NavLink>
            </li>
            <li className="nav-item dropdown" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-link dropdown-toggle btn btn-link text-start px-3 rounded-2 ${
                  isExtensionActive ? 'active bg-white bg-opacity-10 fw-semibold' : ''
                }`}
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                Mở rộng (Phần 2)
              </button>
              <ul
                className={`dropdown-menu shadow-lg border-0 rounded-3 p-2 mt-2 ${
                  dropdownOpen ? 'show' : ''
                }`}
                style={{ minWidth: '270px' }}
              >
                {EXTENSION_LINKS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `dropdown-item rounded-2 py-2 ${isActive ? 'active' : ''}`
                      }
                    >
                      <div className="fw-medium">{item.label}</div>
                      <div className="small opacity-75">{item.desc}</div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {currentUser ? (
              <Link
                to="/mo-rong/tai-khoan"
                className="text-decoration-none text-light d-flex align-items-center gap-2 bg-white bg-opacity-10 px-2 py-1 rounded-pill border border-light border-opacity-10"
              >
                <span
                  className={`lab-avatar ${
                    currentUser.role === 'staff'
                      ? 'bg-warning text-dark'
                      : 'bg-info text-dark'
                  }`}
                >
                  {getInitials(currentUser.fullName)}
                </span>
                <span className="small fw-medium pe-1">{currentUser.fullName}</span>
                <span
                  className={`badge rounded-pill ${
                    currentUser.role === 'staff'
                      ? 'text-bg-warning'
                      : 'text-bg-info'
                  }`}
                >
                  {currentUser.role === 'staff' ? 'Nhân viên' : 'Sinh viên'}
                </span>
              </Link>
            ) : (
              <Link
                to="/mo-rong/tai-khoan"
                className="btn btn-sm btn-outline-light rounded-pill px-3"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
