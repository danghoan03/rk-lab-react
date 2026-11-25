import { useEffect, useState } from 'react';
import { formatDateVN } from '../../data/mockData';
import { parseApiError } from '../../services/api';
import { fetchEquipmentDetail } from '../../services/equipmentService';
import { BoxIcon } from '../common/Icons';

const STATUS_BADGE = {
  overdue: {
    label: 'Quá hạn',
    className: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
  },
  borrowing: {
    label: 'Đang mượn',
    className: 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
  },
  returned: {
    label: 'Đã trả',
    className: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
};

export default function EquipmentDetailModal({ equipmentId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!equipmentId) return;
    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchEquipmentDetail(equipmentId);
        if (active) setDetail(data);
      } catch (err) {
        if (active) setError(parseApiError(err).message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetail();
    return () => {
      active = false;
    };
  }, [equipmentId]);

  if (!equipmentId) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-light border-bottom px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <span className="lab-icon-box bg-primary-subtle text-primary" style={{ width: 34, height: 34 }}>
                  <BoxIcon size={17} />
                </span>
                <div>
                  <h5 className="modal-title mb-0 fw-semibold">Chi tiết thiết bị</h5>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-4">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                  <div className="mt-2 text-muted">Đang tải chi tiết thiết bị...</div>
                </div>
              )}

              {!loading && error && (
                <div className="alert alert-danger border-0 mb-0" role="alert">
                  {error}
                </div>
              )}

              {!loading && !error && detail && (
                <>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3 pb-3 border-bottom">
                    <div>
                      <span className="lab-code-pill mb-2">{detail.code}</span>
                      <h5 className="mb-1 fw-bold">{detail.name}</h5>
                      <div className="d-flex flex-wrap align-items-center gap-2 text-muted small">
                        <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">
                          {detail.category || 'Chưa phân loại'}
                        </span>
                        <span>·</span>
                        <span>Ngày tạo: {formatDateVN(detail.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-4">
                      <div className="p-3 rounded-3 bg-light border text-center">
                        <div className="text-muted small">Tổng số lượng</div>
                        <div className="fs-4 fw-bold text-dark">{detail.total_quantity}</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded-3 bg-primary-subtle text-primary-emphasis text-center">
                        <div className="small">Đang cho mượn</div>
                        <div className="fs-4 fw-bold">{detail.borrowed_quantity}</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div
                        className={`p-3 rounded-3 text-center ${
                          detail.remaining_quantity > 0
                            ? 'bg-success-subtle text-success-emphasis'
                            : 'bg-danger-subtle text-danger-emphasis'
                        }`}
                      >
                        <div className="small">Còn có thể mượn</div>
                        <div className="fs-4 fw-bold">{detail.remaining_quantity}</div>
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-semibold mb-2">Lịch sử phiếu mượn gần đây</h6>
                  {detail.recent_borrowings?.length === 0 ? (
                    <div className="text-muted small py-3 text-center bg-light rounded-3">
                      Thiết bị này chưa có phiếu mượn nào.
                    </div>
                  ) : (
                    <div className="table-responsive border rounded-3">
                      <table className="table table-sm lab-table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Mã phiếu</th>
                            <th>Người mượn</th>
                            <th className="text-end">SL</th>
                            <th>Hạn trả</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.recent_borrowings.map((item) => {
                            const badge =
                              STATUS_BADGE[item.status] || STATUS_BADGE.borrowing;
                            return (
                              <tr key={item.id}>
                                <td>
                                  <span className="lab-code-pill">
                                    {`PM-${String(item.id).padStart(3, '0')}`}
                                  </span>
                                </td>
                                <td className="fw-medium">{item.borrower_name}</td>
                                <td className="text-end">{item.quantity}</td>
                                <td>{formatDateVN(item.due_date)}</td>
                                <td>
                                  <span className={`badge rounded-pill ${badge.className}`}>
                                    {badge.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
