import { formatCurrencyVN, formatDateVN, getTodayISO } from '../../data/mockData';
import { CoinsIcon } from '../common/Icons';

export default function ReturnWithFineModal({
  show,
  borrowItem,
  onClose,
  onConfirm,
}) {
  if (!show || !borrowItem) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-light border-bottom px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <span className="lab-icon-box bg-success-subtle text-success" style={{ width: 34, height: 34 }}>
                  <CoinsIcon size={17} />
                </span>
                <h5 className="modal-title fw-semibold mb-0">Trả thiết bị &amp; thu phạt</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-4">
              <div className="p-3 rounded-3 bg-light border mb-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="lab-code-pill">{borrowItem.id}</span>
                  <span className="fw-semibold">{borrowItem.equipmentName}</span>
                </div>
                <div className="text-muted small">
                  Người mượn: <strong className="text-dark">{borrowItem.borrowerName}</strong> · Số lượng:{' '}
                  <strong className="text-dark">{borrowItem.quantity}</strong>
                </div>
              </div>

              <ul className="list-group rounded-3">
                <li className="list-group-item d-flex justify-content-between py-2">
                  <span className="text-muted">Hạn trả</span>
                  <span className="fw-medium">{formatDateVN(borrowItem.dueDate)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between py-2">
                  <span className="text-muted">Ngày trả</span>
                  <span className="fw-medium">{formatDateVN(getTodayISO())} (hôm nay)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between py-3 bg-danger-subtle text-danger-emphasis fw-bold">
                  <span>Tiền phạt cần thu</span>
                  <span>{formatCurrencyVN(borrowItem.calculatedFine)}</span>
                </li>
              </ul>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-success px-4"
                onClick={() => {
                  onConfirm(borrowItem.id, borrowItem.calculatedFine);
                  onClose();
                }}
              >
                Xác nhận trả
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
