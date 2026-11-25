import { api } from './api';

export async function fetchFineSummary() {
  const response = await api.get('/fines/summary');
  return response.data.data;
}

export async function updateFineRateApi(fineRate) {
  const response = await api.put('/fines/rate', {
    fine_rate: Number(fineRate),
  });
  return response.data;
}

