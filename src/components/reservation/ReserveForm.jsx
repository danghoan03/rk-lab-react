import { useState } from 'react';
import { parseApiError } from '../../services/api';
import { AlertIcon, PlusIcon } from '../common/Icons';

export default function ReserveForm({
  equipmentList,
  selectedEquipmentId,
  onSelectEquipment,
  onCreateReservation,
}) {
  const [requesterName, setRequesterName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFeedback(null);
    setSubmitting(true);

    try {
      const response = await onCreateReservation({
        equipmentId: selectedEquipmentId,
        requesterName,
        quantity,
      });

      setFeedback({
        type: 'success',
        message: response.message || `Đã thêm yêu cầu đặt trước cho ${requesterName}.`,
      });
      setRequesterName('');
      setQuantity('1');
    } catch (err) {
      const parsed = parseApiError(err, 'Không thể tạo yêu cầu đặt trước.');
      setFeedback({ type: 'danger', message: parsed.message });
      setFieldErrors(parsed.details || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="alert border-0 bg-info-subtle text-info-emphasis d-flex align-items-center gap-2 mb-3 rounded-3"
        role="alert"
      >
        <AlertIcon size={18} />
        <span>
          Màn hình đặt trước dành cho thiết bị đã được mượn hết hoặc muốn giữ suất mượn theo thứ tự hàng chờ.
        </span>
      </div>

      <div className="card lab-card mb-4 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 fw-semibold">
          Đặt trước thiết bị
        </div>
        <form className="card-body p-4 row g-3" onSubmit={handleSubmit} noValidate>
          {feedback && (
            <div className="col-12">
              <div
                className={`alert alert-${feedback.type} border-0 mb-0 py-2`}
                role={feedback.type === 'danger' ? 'alert' : 'status'}
              >
                {feedback.message}
              </div>
            </div>
          )}

          <div className="col-md-5">
            <label className="form-label fw-medium" htmlFor="rEq">
              Thiết bị
            </label>
            <select
              id="rEq"
              className="form-select"
              value={selectedEquipmentId}
              onChange={(e) => onSelectEquipment(e.target.value)}
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} {eq.remaining === 0 ? '(Hết hàng)' : `(Còn ${eq.remaining})`}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-medium" htmlFor="rName">
              Người đặt <span className="text-danger">*</span>
            </label>
            <input
              id="rName"
              className={`form-control ${fieldErrors.requester_name ? 'is-invalid' : ''}`}
              placeholder="Họ và tên"
              value={requesterName}
              onChange={(e) => {
                setRequesterName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, requester_name: '' }));
              }}
            />
            {fieldErrors.requester_name && (
              <div className="invalid-feedback d-block">{fieldErrors.requester_name}</div>
            )}
          </div>

          <div className="col-md-1">
            <label className="form-label fw-medium" htmlFor="rQty">
              SL
            </label>
            <input
              id="rQty"
              type="number"
              min="1"
              className={`form-control ${fieldErrors.quantity ? 'is-invalid' : ''}`}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setFieldErrors((prev) => ({ ...prev, quantity: '' }));
              }}
            />
            {fieldErrors.quantity && (
              <div className="invalid-feedback d-block">{fieldErrors.quantity}</div>
            )}
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-1 shadow-sm"
              disabled={submitting}
            >
              <PlusIcon size={16} />
              <span>{submitting ? 'Đang gửi...' : 'Đặt trước'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
