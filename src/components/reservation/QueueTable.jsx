const STATUS_BADGE = {
  ready: {
    label: 'Sẵn sàng nhận',
    className: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
  waiting: {
    label: 'Đang chờ',
    className: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-secondary-subtle text-secondary-emphasis',
  },
};

export default function QueueTable({ equipmentName, items, onCancel }) {
  let activeOrder = 0;

  return (
    <div className="card lab-card overflow-hidden">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <span className="fw-semibold">Hàng chờ: {equipmentName}</span>
        <span className="badge rounded-pill bg-light text-dark border">
          {items.filter((i) => i.status !== 'cancelled').length} đang xếp hàng
        </span>
      </div>

      {items.length === 0 ? (
        <div className="card-body text-center text-muted py-5">
          Chưa có ai trong hàng chờ cho thiết bị này.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table lab-table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Thứ tự</th>
                <th>Người đặt</th>
                <th className="text-end">SL</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th className="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isCancelled = item.status === 'cancelled';
                if (!isCancelled) activeOrder += 1;
                const badge = STATUS_BADGE[item.status] || STATUS_BADGE.waiting;

                return (
                  <tr
                    key={item.id}
                    className={isCancelled ? 'table-light text-muted' : ''}
                  >
                    <td>
                      {isCancelled ? (
                        '—'
                      ) : (
                        <span className="lab-rank-badge bg-primary-subtle text-primary-emphasis">
                          {activeOrder}
                        </span>
                      )}
                    </td>
                    <td className="fw-medium">{item.requesterName}</td>
                    <td className="text-end">{item.quantity}</td>
                    <td>{item.createdAt}</td>
                    <td>
                      <span className={`badge rounded-pill px-2 py-1 ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="text-end">
                      {!isCancelled && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                          onClick={() => onCancel(item.id)}
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
