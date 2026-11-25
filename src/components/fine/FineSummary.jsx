import { useEffect, useState } from 'react';
import { formatCurrencyVN } from '../../data/mockData';
import { parseApiError } from '../../services/api';
import { AlertIcon, CheckCircleIcon, CoinsIcon } from '../common/Icons';

export default function FineSummary({
  collectedTotal,
  pendingTotal,
  fineRate,
  onSaveRate,
}) {
  const [rateInput, setRateInput] = useState(String(fineRate));
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRateInput(String(fineRate));
  }, [fineRate]);

  const handleSave = async () => {
    setError('');
    setSavedNotice(false);
    setSaving(true);
    try {
      await onSaveRate(rateInput);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch (err) {
      setError(parseApiError(err, 'Không thể lưu mức phạt.').message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="card lab-card lab-card-hover h-100 border-start border-4 border-success">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-medium mb-1">Tiền phạt đã thu</div>
              <div className="fs-4 fw-bold text-success">
                {formatCurrencyVN(collectedTotal)}
              </div>
            </div>
            <span className="lab-icon-box bg-success-subtle text-success">
              <CheckCircleIcon size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card lab-card lab-card-hover h-100 border-start border-4 border-danger">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-medium mb-1">Tiền phạt đang nợ</div>
              <div className="fs-4 fw-bold text-danger">
                {formatCurrencyVN(pendingTotal)}
              </div>
            </div>
            <span className="lab-icon-box bg-danger-subtle text-danger">
              <AlertIcon size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card lab-card h-100 border-start border-4 border-primary">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="text-muted small fw-medium d-flex align-items-center gap-1">
                <CoinsIcon size={14} />
                <span>Mức phạt hiện hành</span>
              </div>
              {savedNotice && (
                <span className="badge rounded-pill bg-success-subtle text-success-emphasis">
                  Đã lưu
                </span>
              )}
            </div>
            <div className="input-group input-group-sm mt-2">
              <input
                type="number"
                min="0"
                step="1000"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                aria-label="Mức phạt"
                value={rateInput}
                onChange={(e) => {
                  setRateInput(e.target.value);
                  setError('');
                }}
              />
              <span className="input-group-text bg-light">đ / TB / ngày</span>
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? 'Lưu...' : 'Lưu'}
              </button>
            </div>
            {error && <div className="invalid-feedback d-block">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
