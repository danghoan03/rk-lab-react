import { api } from './api';

export async function fetchPenaltyTickets(penaltyStatus = 'ALL') {
  const response = await api.get('/penalties/tickets', {
    params: { penalty_status: penaltyStatus },
  });
  return response.data.data;
}

export async function fetchPenaltySummary() {
  const response = await api.get('/penalties/summary');
  return response.data.data;
}

export async function fetchPenaltyPayments(borrowId = undefined) {
  const url = borrowId
    ? `/penalties/tickets/${borrowId}/payments`
    : '/penalties/payments';
  const response = await api.get(url);
  return response.data.data;
}

export async function recordPenaltyPaymentApi(borrowId, payload) {
  const response = await api.post(`/penalties/tickets/${borrowId}/payments`, {
    staff_id: Number(payload.staff_id),
    amount_paid: Number(payload.amount_paid),
    payment_method: payload.payment_method,
    note: payload.note || null,
  });
  return response.data;
}

export async function fetchStaffs() {
  const response = await api.get('/penalties/staffs');
  return response.data.data;
}

