import { api } from './api';

export async function fetchBorrowings(status = 'all') {
  const response = await api.get('/borrowings', {
    params: { status },
  });
  return response.data.data;
}

export async function createBorrowingApi(payload) {
  const response = await api.post('/borrowings', {
    equipment_id: Number(payload.equipment_id),
    borrower_name: payload.borrower_name,
    quantity: Number(payload.quantity),
    due_date: payload.due_date,
    note: payload.note || null,
  });
  return response.data;
}

export async function returnBorrowingApi(id, finePaid = undefined) {
  const body =
    finePaid !== undefined && finePaid !== null ? { fine_paid: Number(finePaid) } : {};
  const response = await api.patch(`/borrowings/${id}/return`, body);
  return response.data;
}
