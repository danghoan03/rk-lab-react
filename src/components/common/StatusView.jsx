import { AlertIcon, BoxIcon } from './Icons';

export function LoadingState({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="card lab-card">
      <div className="card-body text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <div className="mt-3 text-muted fw-medium">{message}</div>
      </div>
    </div>
  );
}

export function EmptyState({ message = 'Không có dữ liệu.' }) {
  return (
    <div className="card lab-card">
      <div className="card-body text-center py-5">
        <div className="lab-icon-box bg-light text-secondary mx-auto mb-3 border">
          <BoxIcon size={20} />
        </div>
        <div className="text-muted fw-medium">{message}</div>
      </div>
    </div>
  );
}

export function ErrorState({ message = 'Đã xảy ra lỗi. Vui lòng thử lại.', onRetry }) {
  return (
    <div
      className="alert alert-danger border-0 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0 rounded-3"
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        <AlertIcon size={18} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          className="btn btn-sm btn-danger rounded-pill px-3"
          onClick={onRetry}
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
