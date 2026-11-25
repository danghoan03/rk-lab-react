import { useRef, useState } from 'react';
import { formatDateVN, getTodayISO, parseDateVNToISO } from '../../data/mockData';
import { parseApiError } from '../../services/api';
import { CalendarIcon, PlusIcon } from '../common/Icons';

function addDaysISO(baseISO, days) {
  const dt = new Date(`${baseISO}T00:00:00`);
  dt.setDate(dt.getDate() + days);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function BorrowForm({ equipmentList, onCreateBorrow }) {
  const todayISO = getTodayISO();
  const maxDueDateISO = addDaysISO(todayISO, 14);
  const pickerRef = useRef(null);

  const [equipmentId, setEquipmentId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [dueDateText, setDueDateText] = useState('');
  const [note, setNote] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePickerChange = (e) => {
    const isoValue = e.target.value;
    if (isoValue) {
      setDueDateText(formatDateVN(isoValue));
      setFieldErrors((prev) => ({ ...prev, due_date: '' }));
    }
  };

  const openPicker = () => {
    if (pickerRef.current?.showPicker) {
      pickerRef.current.showPicker();
    } else {
      pickerRef.current?.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFeedback(null);

    const parsedDueDateISO = parseDateVNToISO(dueDateText);
    if (!parsedDueDateISO) {
      setFieldErrors({ due_date: 'Hạn trả phải đúng định dạng dd/mm/yyyy.' });
      setFeedback({
        type: 'danger',
        message: 'Không thể tạo phiếu mượn. Vui lòng kiểm tra lại thông tin.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await onCreateBorrow({
        equipment_id: equipmentId,
        borrower_name: borrowerName,
        quantity,
        due_date: parsedDueDateISO,
        note,
      });

      setFeedback({
        type: 'success',
        message: response.message || `Đã tạo phiếu mượn ${response.data?.code_label || ''}.`,
      });
      setEquipmentId('');
      setBorrowerName('');
      setQuantity('1');
      setDueDateText('');
      setNote('');
    } catch (err) {
      const parsed = parseApiError(
        err,
        'Không thể tạo phiếu mượn. Vui lòng kiểm tra lại thông tin.'
      );
      setFeedback({ type: 'danger', message: parsed.message });
      setFieldErrors(parsed.details || {});
    } finally {
      setSubmitting(false);
    }
  };

  const pickerISO = parseDateVNToISO(dueDateText) || '';

  return (
    <div className="card lab-card mb-4 overflow-hidden">
      <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span className="fw-semibold">Tạo phiếu mượn mới</span>
        <div className="d-flex flex-wrap gap-2 small">
          <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis px-3 py-2">
            Ngày mượn: {formatDateVN(todayISO)}
          </span>
          <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
            Hạn tối đa: {formatDateVN(maxDueDateISO)} (14 ngày)
          </span>
        </div>
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

        <div className="col-md-4">
          <label className="form-label fw-medium" htmlFor="bEq">
            Thiết bị <span className="text-danger">*</span>
          </label>
          <select
            id="bEq"
            className={`form-select ${fieldErrors.equipment_id ? 'is-invalid' : ''}`}
            value={equipmentId}
            onChange={(e) => {
              setEquipmentId(e.target.value);
              setFieldErrors((prev) => ({ ...prev, equipment_id: '' }));
            }}
          >
            <option value="">Chọn thiết bị...</option>
            {equipmentList.map((eq) => {
              const remaining = eq.remaining_quantity ?? eq.remaining ?? 0;
              return (
                <option key={eq.id} value={eq.id} disabled={remaining === 0}>
                  {eq.code} - {eq.name} (còn {remaining})
                </option>
              );
            })}
          </select>
          {fieldErrors.equipment_id && (
            <div className="invalid-feedback d-block">{fieldErrors.equipment_id}</div>
          )}
        </div>

        <div className="col-md-3">
          <label className="form-label fw-medium" htmlFor="bName">
            Người mượn <span className="text-danger">*</span>
          </label>
          <input
            id="bName"
            className={`form-control ${fieldErrors.borrower_name ? 'is-invalid' : ''}`}
            placeholder="Họ và tên"
            value={borrowerName}
            onChange={(e) => {
              setBorrowerName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, borrower_name: '' }));
            }}
          />
          {fieldErrors.borrower_name && (
            <div className="invalid-feedback d-block">{fieldErrors.borrower_name}</div>
          )}
        </div>

        <div className="col-md-2">
          <label className="form-label fw-medium" htmlFor="bQty">
            Số lượng <span className="text-danger">*</span>
          </label>
          <input
            id="bQty"
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

        <div className="col-md-3">
          <label className="form-label fw-medium" htmlFor="bDue">
            Hạn trả (dd/mm/yyyy) <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              id="bDue"
              type="text"
              inputMode="numeric"
              placeholder="dd/mm/yyyy"
              className={`form-control ${fieldErrors.due_date ? 'is-invalid' : ''}`}
              value={dueDateText}
              onChange={(e) => {
                setDueDateText(e.target.value);
                setFieldErrors((prev) => ({ ...prev, due_date: '' }));
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center"
              title="Chọn ngày từ lịch"
              onClick={openPicker}
            >
              <CalendarIcon size={16} />
            </button>
            <input
              ref={pickerRef}
              type="date"
              tabIndex={-1}
              aria-hidden="true"
              min={todayISO}
              max={maxDueDateISO}
              value={pickerISO}
              onChange={handlePickerChange}
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                width: 0,
                height: 0,
              }}
            />
          </div>
          {fieldErrors.due_date && (
            <div className="invalid-feedback d-block">{fieldErrors.due_date}</div>
          )}
        </div>

        <div className="col-md-9">
          <label className="form-label fw-medium" htmlFor="bNote">
            Ghi chú
          </label>
          <input
            id="bNote"
            className="form-control"
            placeholder="Mục đích sử dụng hoặc ghi chú thêm (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-1 shadow-sm"
            disabled={submitting}
          >
            <PlusIcon size={16} />
            <span>{submitting ? 'Đang tạo...' : 'Tạo phiếu mượn'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
