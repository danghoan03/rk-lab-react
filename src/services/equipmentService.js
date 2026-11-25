import { api } from './api';

export async function fetchEquipments({
  search = '',
  category = 'all',
  page = 1,
  limit = 6,
} = {}) {
  const response = await api.get('/equipments', {
    params: {
      search: search.trim() || undefined,
      category: category && category !== 'all' ? category : undefined,
      page,
      limit,
    },
  });
  return response.data;
}

export async function fetchEquipmentDetail(id) {
  const response = await api.get(`/equipments/${id}`);
  return response.data.data;
}

export async function createEquipmentApi(payload) {
  const response = await api.post('/equipments', {
    code: payload.code,
    name: payload.name,
    category: payload.category,
    total_quantity: Number(payload.total_quantity),
  });
  return response.data;
}

export async function updateEquipmentApi(id, payload) {
  const response = await api.put(`/equipments/${id}`, {
    code: payload.code,
    name: payload.name,
    category: payload.category,
    total_quantity: Number(payload.total_quantity),
  });
  return response.data;
}

export async function deleteEquipmentApi(id) {
  const response = await api.delete(`/equipments/${id}`);
  return response.data;
}

