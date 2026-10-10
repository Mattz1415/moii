import axios, { AxiosError } from 'axios';

// Event emitter pattern for 429 rate limit toasts and global notifications
type Listener = (msg: { title: string; message: string; type: 'warning' | 'error' | 'info' }) => void;
const listeners: Set<Listener> = new Set();

export const subscribeToast = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const notifyToast = (msg: { title: string; message: string; type: 'warning' | 'error' | 'info' }) => {
  listeners.forEach((fn) => fn(msg));
};

let last429ToastTime = 0;

export const axiosClient = axios.create({
  baseURL: '/api/sanka',
  timeout: 15000,
  headers: {
    'Accept': 'application/json, text/plain, */*',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      const now = Date.now();
      // Throttle 429 alerts to avoid spamming the user
      if (now - last429ToastTime > 10000) {
        last429ToastTime = now;
        notifyToast({
          title: 'API Rate Limited (45 req/min)',
          message: 'The Sanka Vollerei upstream server is cooling down. Cached content is served.',
          type: 'warning',
        });
      }
    }
    return Promise.reject(error);
  }
);
