import { useState } from 'react';
import { parseApiError } from '../../services/api';
import { UserIcon } from '../common/Icons';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('an@rikkei.edu');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(parseApiError(err, 'Đăng nhập thất bại.').message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card lab-card h-100 overflow-hidden">
      <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2 fw-semibold">
        <UserIcon size={17} />
        <span>Đăng nhập</span>
      </div>
      <form className="card-body p-4 d-flex flex-column" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium" htmlFor="lEmail">
            Email
          </label>
          <input
            id="lEmail"
            type="email"
            className="form-control"
            placeholder="ban@rikkei.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium" htmlFor="lPw">
            Mật khẩu
          </label>
          <input
            id="lPw"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="alert alert-danger border-0 py-2" role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-medium shadow-sm"
          disabled={submitting}
        >
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div className="bg-light border rounded-3 p-2 mt-3 small text-muted">
          Tài khoản mẫu: <code>an@rikkei.edu</code> (Sinh viên) hoặc{' '}
          <code>ha@rikkei.edu</code> (Nhân viên), mật khẩu <code>123456</code>.
        </div>
      </form>
    </div>
  );
}
