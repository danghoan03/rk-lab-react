import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function parseApiError(err, fallbackMessage = 'Đã xảy ra lỗi kết nối API.') {
  const apiError = err?.response?.data?.error;
  if (apiError) {
    return {
      code: apiError.code || 'API_ERROR',
      message: apiError.message || fallbackMessage,
      details: apiError.details || {},
    };
  }

  if (err?.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'Yêu cầu tới máy chủ bị quá thời gian.',
      details: {},
    };
  }

  if (!err?.response || (err.response.status >= 500 && !err.response?.data?.error)) {
    return {
      code: 'NETWORK_ERROR',
      message:
        'Không thể kết nối tới máy chủ Express API (http://localhost:3001). Hãy chạy "cd server && npm install && npm start".',
      details: {},
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: err.message || fallbackMessage,
    details: {},
  };
}

