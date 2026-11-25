import { useCallback, useEffect, useState } from 'react';
import BorrowFilter from '../components/borrow/BorrowFilter';
import BorrowForm from '../components/borrow/BorrowForm';
import BorrowTable from '../components/borrow/BorrowTable';
import { ClipboardIcon } from '../components/common/Icons';
import { ErrorState, LoadingState } from '../components/common/StatusView';
import { useLab } from '../context/LabContext';
import { parseApiError } from '../services/api';
import {
  createBorrowingApi,
  fetchBorrowings,
  returnBorrowingApi,
} from '../services/borrowingService';
import { fetchEquipments } from '../services/equipmentService';

export default function BorrowPage() {
  const { refreshFromApi } = useLab();

  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(null);
  const [returningId, setReturningId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [eqRes, borrowList] = await Promise.all([
        fetchEquipments({ page: 1, limit: 100 }),
        fetchBorrowings(statusFilter),
      ]);
      setEquipmentOptions(eqRes.data || []);
      setBorrows(borrowList || []);
    } catch (err) {
      setError(parseApiError(err, 'Không tải được dữ liệu phiếu mượn.').message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateBorrow = async (payload) => {
    const res = await createBorrowingApi(payload);
    await loadData();
    await refreshFromApi();
    return res;
  };

  const handleReturn = async (id) => {
    setActionMessage(null);
    setReturningId(id);
    try {
      const res = await returnBorrowingApi(id);
      setActionMessage({
        type: 'success',
        text: res.message || 'Đã ghi nhận trả thiết bị.',
      });
      await loadData();
      await refreshFromApi();
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: parseApiError(err, 'Không thể ghi nhận trả thiết bị.').message,
      });
    } finally {
      setReturningId(null);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="lab-icon-box bg-primary-subtle text-primary">
          <ClipboardIcon size={20} />
        </span>
        <div>
          <h1 className="h4 fw-bold mb-0">Phiếu mượn thiết bị</h1>
          <p className="text-muted small mb-0">
            Lập phiếu mượn mới, theo dõi hạn trả và xác nhận hoàn trả thiết bị
          </p>
        </div>
      </div>

      <BorrowForm
        equipmentList={equipmentOptions}
        onCreateBorrow={handleCreateBorrow}
      />

      {actionMessage && (
        <div
          className={`alert alert-${actionMessage.type} border-0 shadow-sm py-2 mb-3`}
          role={actionMessage.type === 'danger' ? 'alert' : 'status'}
        >
          {actionMessage.text}
        </div>
      )}

      <BorrowFilter activeFilter={statusFilter} onFilterChange={setStatusFilter} />

      {loading && <LoadingState message="Đang tải danh sách phiếu mượn..." />}

      {!loading && error && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && (
        <BorrowTable
          borrows={borrows}
          returningId={returningId}
          onReturn={handleReturn}
        />
      )}
    </>
  );
}
