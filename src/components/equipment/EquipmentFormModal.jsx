import { useEffect, useState } from 'react';
import { EQUIPMENT_CATEGORIES } from '../../data/mockData';
import { parseApiError } from '../../services/api';
import { BoxIcon } from '../common/Icons';

export default function EquipmentFormModal({ show, initialData, onClose, onSubmit }) {
  const isEditing = Boolean(initialData);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(EQUIPMENT_CATEGORIES[0]);
  const [totalQuantity, setTotalQuantity] = useState('1');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setCode(initialData?.code || '');
      setName(initialData?.name || '');
      setCategory(initialData?.category || EQUIPMENT_CATEGORIES[0]);
      const initTotal = initialData?.total_quantity ?? initialData?.total ?? 1;
      setTotalQuantity(String(initTotal));
      setFieldErrors({});
      setFormError('');
      setSubmitting(false);
    }
  }, [show, initialData]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError('');
    setSubmitting(true);

    try {
      await onSubmit({
        code,
        name,
        category,
        total_quantity: totalQuantity,
      });
      onClose();
    } catch (err) {
      const parsed = parseApiError(err, 'Không thể lưu thiết bị.');
      setFormError(parsed.message);
      setFieldErrors(parsed.details || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <form
            className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="modal-header bg-light border-bottom px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <span className="lab-icon-box bg-primary-subtle text-primary" style={{ width: 34, height: 34 }}>
                  <BoxIcon size={17} />
                </span>
                <h5 className="modal-title fw-semibold mb-0">
                  {isEditing ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                disabled={submitting}
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-4">
              {formError && (
                <div className="alert alert-danger border-0 py-2" role="alert">
                  {formError}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="eqCode">
                  Mã thiết bị <span className="text-danger">*</span>
                </label>
                <input
                  id="eqCode"
                  className={`form-control ${fieldErrors.code ? 'is-invalid' : ''}`}
                  placeholder="VD: LAB-015"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, code: '' }));
                  }}
                />
                {fieldErrors.code && (
                  <div className="invalid-feedback d-block">{fieldErrors.code}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="eqName">
                  Tên thiết bị <span className="text-danger">*</span>
                </label>
                <input
                  id="eqName"
                  className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                  placeholder="Nhập tên thiết bị"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
                {fieldErrors.name && (
                  <div className="invalid-feedback d-block">{fieldErrors.name}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-7 mb-2 mb-md-0">
                  <label className="form-label fw-medium" htmlFor="eqCat">
                    Loại thiết bị
                  </label>
                  <select
                    id="eqCat"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {EQUIPMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-medium" htmlFor="eqTotal">
                    Tổng số lượng <span className="text-danger">*</span>
                  </label>
                  <input
                    id="eqTotal"
                    type="number"
                    min="0"
                    className={`form-control ${
                      fieldErrors.total_quantity ? 'is-invalid' : ''
                    }`}
                    value={totalQuantity}
                    onChange={(e) => {
                      setTotalQuantity(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, total_quantity: '' }));
                    }}
                  />
                  {fieldErrors.total_quantity && (
                    <div className="invalid-feedback d-block">
                      {fieldErrors.total_quantity}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={submitting}
                onClick={onClose}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                {submitting ? 'Đang lưu...' : 'Lưu thiết bị'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
