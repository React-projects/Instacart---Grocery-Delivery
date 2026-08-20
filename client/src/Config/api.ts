import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
   //    headers: {
   //       'Content-Type': 'application/json',
   //    },
});

// Inject JWT token from localstorage into every request
api.interceptors.request.use((config) => {
   const isDeliveryRoute = config.url?.startsWith('/delivery');
   const token = isDeliveryRoute ? localStorage.getItem('delivery_token') : localStorage.getItem('auth_token');
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
});

// Handle auth errors globally
api.interceptors.response.use(
   (response) => response,
   (error) => {
      const isDeliveryRoute = error.config?.url?.startsWith('/delivery');
      if (error.response?.status === 401 || error.response?.status === 403) {
         if (isDeliveryRoute) {
            localStorage.removeItem('delivery_token');
            localStorage.removeItem('delivery_partner');
            if (!window.location.pathname.includes('/delivery/login')) window.location.href = '/delivery/login';
         } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            if (!window.location.pathname.includes('/register') && !window.location.pathname.includes('/login')) window.location.href = '/login';
         }
      }
      return Promise.reject(error);
   },
);
export default api;
