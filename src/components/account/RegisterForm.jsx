import { useState } from 'react';
import { parseApiError } from '../../services/api';
import { PlusIcon } from '../common/Icons';

export default function RegisterForm({ onRegister }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      await onRegister({ fullName, email, password, role: 'student' });
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      const parsed = parseApiError(err, 'Không thể tạo tài khoản.');
      setError(parsed.message);
      setFieldErrors(parsed.details || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card lab-card h-100 overflow-hidden">
      <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2 fw-semibold">
        <PlusIcon size={17} />
        <span>Đăng ký tài khoản mới</span>
      </div>
      <form className="card-body p-4" onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label fw-medium" htmlFor="rFull">
            Họ và tên
          </label>
          <input
            id="rFull"
            className={`form-control ${fieldErrors.full_name ? 'is-invalid' : ''}`}
            placeholder="Nhập họ và tên"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, full_name: '' }));
            }}
          />
          {fieldErrors.full_name && (
            <div className="invalid-feedback d-block">{fieldErrors.full_name}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium" htmlFor="rEmail">
            Email
          </label>
          <input
            id="rEmail"
            type="email"
            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
            placeholder="ten@rikkei.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: '' }));
            }}
          />
          {fieldErrors.email && (
            <div className="invalid-feedback d-block">{fieldErrors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium" htmlFor="rPw">
            Mật khẩu
          </label>
          <input
            id="rPw"
            type="password"
            className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
            placeholder="Tối thiểu 4 ký tự"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: '' }));
            }}
          />
          {fieldErrors.password && (
            <div className="invalid-feedback d-block">{fieldErrors.password}</div>
          )}
        </div>
        {error && (
          <div className="alert alert-danger border-0 py-2" role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-outline-primary w-100 py-2 fw-medium"
          disabled={submitting}
        >
          {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </button>
      </form>
    </div>
  );
}
