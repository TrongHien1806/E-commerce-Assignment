import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn Access Token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý tự động Refresh Token khi lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Gọi API refresh token
        const res = await axios.post(`${api.defaults.baseURL}/users/refresh-token`, {
          refresh_token: refreshToken
        });

        // API Spec: endpoint auth trả về trực tiếp object (không có result)
        const { access_token, refresh_token: new_refresh_token } = res.data;

        localStorage.setItem('access_token', access_token);
        if (new_refresh_token) {
          localStorage.setItem('refresh_token', new_refresh_token);
        }

        // Đổi token trong header và gọi lại request ban đầu
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn hoặc lỗi -> Xóa token, đẩy về login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Ném lỗi về cho component xử lý (lấy error.response.data.message)
    return Promise.reject(error);
  }
);

export default api;