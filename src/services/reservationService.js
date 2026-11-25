import { api } from './api';

export async function fetchReservations(equipmentId = undefined) {
  const response = await api.get('/reservations', {
    params: equipmentId ? { equipment_id: equipmentId } : undefined,
  });
  return response.data.data;
}

export async function createReservationApi(payload) {
  const response = await api.post('/reservations', {
    equipment_id: Number(payload.equipment_id),
    requester_name: payload.requester_name,
    quantity: Number(payload.quantity),
  });
  return response.data;
}

export async function cancelReservationApi(id) {
  const response = await api.patch(`/reservations/${id}/cancel`);
  return response.data;
}

