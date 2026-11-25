import { useEffect, useState } from 'react';
import { parseApiError } from '../../services/api';
import { AlertIcon } from '../common/Icons';

export default function ConfirmDeleteModal({ show, equipment, onClose, onConfirm }) {
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (show) {
      setError('');
      setDeleting(false);
    }
  }, [show, equipment]);

  if (!show || !equipment) return null;

  const handleConfirm = async () => {
    setError('');
    setDeleting(true);
    try {
      await onConfirm(equipment.id);
      onClose();
    } catch (err) {
      setError(parseApiError(err, 'Không thể xóa thiết bị.').message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-light border-bottom">
              <div className="d-flex align-items-center gap-2 text-danger">
                <AlertIcon size={18} />
                <h5 className="modal-title fw-semibold mb-0">Xác nhận xóa</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                disabled={deleting}
                onClick={onClose}
              />
            </div>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger border-0 py-2 small" role="alert">
                  {error}
                </div>
              )}
              <p className="mb-1">Bạn có chắc chắn muốn xóa thiết bị:</p>
              <div className="p-2 rounded bg-light border fw-semibold">
                {equipment.name}
              </div>
            </div>
            <div className="modal-footer bg-light border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={deleting}
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger px-3"
                disabled={deleting}
                onClick={handleConfirm}
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
