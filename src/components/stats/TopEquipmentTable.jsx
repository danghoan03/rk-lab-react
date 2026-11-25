export default function TopEquipmentTable({ items }) {
  const maxCount = Math.max(1, ...items.map((item) => item.borrowCount));

  return (
    <div className="card lab-card overflow-hidden h-100">
      <div className="card-header bg-white border-bottom py-3 fw-semibold">
        Thiết bị được mượn nhiều nhất
      </div>
      <div className="table-responsive">
        <table className="table lab-table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Thiết bị</th>
              <th>Mức độ</th>
              <th className="text-end">Lượt</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const percent = Math.round((item.borrowCount / maxCount) * 100);
              return (
                <tr key={item.id}>
                  <td>
                    <span
                      className={`lab-rank-badge ${
                        idx === 0
                          ? 'bg-primary text-white'
                          : 'bg-light text-secondary border'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="fw-semibold text-dark">{item.name}</td>
                  <td style={{ width: '38%' }}>
                    <div
                      className="progress rounded-pill bg-light"
                      style={{ height: '10px' }}
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar rounded-pill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </td>
                  <td className="text-end fw-bold text-primary">{item.borrowCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
