import { io } from 'socket.io-client';
import { APP_CONFIG } from './config';

const SOCKET_URL = APP_CONFIG.API_BASE_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    cb({ token: localStorage.getItem('token') });
  },
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
