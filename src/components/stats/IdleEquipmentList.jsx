export default function IdleEquipmentList({ items }) {
  return (
    <div className="card lab-card overflow-hidden h-100">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <span className="fw-semibold">Thiết bị nằm kho (ít lượt mượn)</span>
        <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="card-body text-muted text-center py-5">
          Không có thiết bị nào nằm kho.
        </div>
      ) : (
        <ul className="list-group list-group-flush">
          {items.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center py-3"
            >
              <div>
                <div className="fw-medium text-dark">{item.name}</div>
                <div className="small text-muted">{item.code} · {item.category}</div>
              </div>
              <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis px-3 py-2">
                {item.borrowCount} lượt
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
