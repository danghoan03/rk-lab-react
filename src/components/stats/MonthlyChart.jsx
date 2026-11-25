export default function MonthlyChart({ data }) {
  const maxVal = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="card lab-card overflow-hidden mt-3">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <span className="fw-semibold">Xu hướng số lượt mượn theo tháng</span>
        <span className="text-muted small">Cao nhất: {maxVal} lượt</span>
      </div>
      <div className="card-body px-3 px-md-4 pt-4 pb-3">
        <div className="lab-chart-area d-flex align-items-end justify-content-between gap-1">
          {data.map((item) => {
            const isPeak = item.count === maxVal && item.count > 0;
            const heightPx =
              item.count === 0
                ? 4
                : Math.max(12, Math.round((item.count / maxVal) * 145));

            return (
              <div
                key={item.month}
                className="text-center flex-fill lab-chart-col"
              >
                <div
                  className={`small mb-1 ${
                    isPeak ? 'fw-bold text-primary' : 'text-muted'
                  }`}
                >
                  {item.count}
                </div>
                <div
                  className={`lab-chart-bar mx-auto ${
                    item.count === 0
                      ? 'bg-secondary bg-opacity-25'
                      : isPeak
                      ? 'bg-primary'
                      : 'bg-primary bg-opacity-75'
                  }`}
                  style={{ height: `${heightPx}px` }}
                />
                <div className="small fw-medium text-secondary mt-2">{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
