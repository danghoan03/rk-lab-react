import { useCallback, useEffect, useState } from 'react';
import { CoinsIcon } from '../components/common/Icons';
import { ErrorState, LoadingState } from '../components/common/StatusView';
import BorrowTicketsPenaltyTable from '../components/fine/BorrowTicketsPenaltyTable';
import CollectPenaltyModal from '../components/fine/CollectPenaltyModal';
import PaymentHistoryTable from '../components/fine/PaymentHistoryTable';
import PenaltyFilter from '../components/fine/PenaltyFilter';
import PenaltyStatsCards from '../components/fine/PenaltyStatsCards';
import { parseApiError } from '../services/api';
import {
  fetchPenaltyPayments,
  fetchPenaltySummary,
  fetchPenaltyTickets,
  fetchStaffs,
  recordPenaltyPaymentApi,
} from '../services/penaltyService';

export default function FinePage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [staffs, setStaffs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  const [collectingTicket, setCollectingTicket] = useState(null);
  const [historyTicketFilter, setHistoryTicketFilter] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ticketList, overview, paymentList, staffList] = await Promise.all([
        fetchPenaltyTickets(statusFilter),
        fetchPenaltySummary(),
        fetchPenaltyPayments(historyTicketFilter?.id),
        fetchStaffs(),
      ]);
      setTickets(ticketList || []);
      setSummary(overview || null);
      setPayments(paymentList || []);
      setStaffs(staffList || []);
    } catch (err) {
      setError(parseApiError(err, 'Không tải được dữ liệu tiền phạt.').message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, historyTicketFilter]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleRecordPayment = async (borrowId, payload) => {
    const res = await recordPenaltyPaymentApi(borrowId, payload);
    setActionNotice({
      type: 'success',
      message: res.message || 'Đã ghi nhận giao dịch thu tiền phạt.',
    });
    await loadAll();
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-3">
          <span className="lab-icon-box bg-danger-subtle text-danger">
            <CoinsIcon size={20} />
          </span>
          <div>
            <h1 className="h4 fw-bold mb-0">Phần 2A. Quá hạn và tiền phạt</h1>
            <p className="text-muted small mb-0">
              Theo dõi công nợ phạt theo từng phiếu, thu tiền phạt nhiều đợt và xem lịch sử giao dịch
            </p>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div
          className={`alert alert-${actionNotice.type} border-0 shadow-sm py-2 mb-3`}
          role="status"
        >
          {actionNotice.message}
        </div>
      )}

      {loading && <LoadingState message="Đang tải dữ liệu công nợ và tiền phạt..." />}

      {!loading && error && <ErrorState message={error} onRetry={loadAll} />}

      {!loading && !error && (
        <>
          <PenaltyStatsCards summary={summary} />

          <PenaltyFilter
            activeStatus={statusFilter}
            counts={summary}
            onChange={setStatusFilter}
          />

          <BorrowTicketsPenaltyTable
            tickets={tickets}
            onCollectClick={(ticket) => setCollectingTicket(ticket)}
            onViewHistoryClick={(ticket) => setHistoryTicketFilter(ticket)}
          />

          <PaymentHistoryTable
            payments={payments}
            filteredTicket={historyTicketFilter}
            onClearTicketFilter={() => setHistoryTicketFilter(null)}
          />
        </>
      )}

      <CollectPenaltyModal
        show={Boolean(collectingTicket)}
        ticket={collectingTicket}
        staffs={staffs}
        onClose={() => setCollectingTicket(null)}
        onSubmit={handleRecordPayment}
      />
    </>
  );
}
