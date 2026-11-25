import { AlertIcon, BoxIcon, ClipboardIcon, ClockIcon } from '../common/Icons';

export default function StatCards({
  totalUnits,
  borrowedUnits,
  overdueCount,
  idleCount,
}) {
  const cards = [
    {
      label: 'Tổng thiết bị',
      value: totalUnits,
      valueClass: 'text-dark',
      iconBg: 'bg-light text-dark border',
      borderClass: 'border-dark-subtle',
      Icon: BoxIcon,
    },
    {
      label: 'Đang được mượn',
      value: borrowedUnits,
      valueClass: 'text-primary',
      iconBg: 'bg-primary-subtle text-primary',
      borderClass: 'border-primary',
      Icon: ClipboardIcon,
    },
    {
      label: 'Phiếu quá hạn',
      value: overdueCount,
      valueClass: 'text-danger',
      iconBg: 'bg-danger-subtle text-danger',
      borderClass: 'border-danger',
      Icon: AlertIcon,
    },
    {
      label: 'Thiết bị nằm kho',
      value: idleCount,
      valueClass: 'text-secondary',
      iconBg: 'bg-secondary-subtle text-secondary',
      borderClass: 'border-secondary',
      Icon: ClockIcon,
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map(({ label, value, valueClass, iconBg, borderClass, Icon }) => (
        <div key={label} className="col-6 col-md-3">
          <div className={`card lab-card lab-card-hover h-100 border-top border-3 ${borderClass}`}>
            <div className="card-body d-flex align-items-center justify-content-between gap-2">
              <div>
                <div className="text-muted small fw-medium">{label}</div>
                <div className={`fs-3 fw-bold ${valueClass}`}>{value}</div>
              </div>
              <span className={`lab-icon-box ${iconBg}`}>
                <Icon size={20} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
