import { EyeIcon, PencilIcon, TrashIcon } from '../common/Icons';
import { EmptyState } from '../common/StatusView';

export default function EquipmentTable({ items, onViewDetail, onEdit, onDelete }) {
  if (items.length === 0) {
    return <EmptyState message="Không tìm thấy thiết bị nào phù hợp." />;
  }

  return (
    <div className="card lab-card overflow-hidden">
      <div className="table-responsive">
        <table className="table lab-table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th className="text-end">Tổng</th>
              <th className="text-end">Còn lại</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const total = item.total_quantity ?? item.total ?? 0;
              const remaining = item.remaining_quantity ?? item.remaining ?? 0;
              const ratio = total > 0 ? Math.round((remaining / total) * 100) : 0;

              return (
                <tr key={item.id}>
                  <td className="text-nowrap">
                    <span className="lab-code-pill">{item.code}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{item.name}</div>
                  </td>
                  <td>
                    <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis fw-medium px-2 py-1">
                      {item.category || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="text-end fw-medium">{total}</td>
                  <td className="text-end">
                    <span
                      className={`badge rounded-pill px-2 py-1 ${
                        remaining > 0
                          ? 'bg-success-subtle text-success-emphasis border border-success-subtle'
                          : 'bg-danger-subtle text-danger-emphasis border border-danger-subtle'
                      }`}
                      title={`Sẵn sàng ${remaining}/${total} (${ratio}%)`}
                    >
                      {remaining > 0 ? `Còn ${remaining}` : 'Hết (0)'}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
                        onClick={() => onViewDetail(item)}
                      >
                        <EyeIcon size={14} />
                        <span>Chi tiết</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary d-inline-flex align-items-center gap-1"
                        onClick={() => onEdit(item)}
                      >
                        <PencilIcon size={14} />
                        <span>Sửa</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger d-inline-flex align-items-center gap-1"
                        onClick={() => onDelete(item)}
                      >
                        <TrashIcon size={14} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
