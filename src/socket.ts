import { io } from 'socket.io-client';

const URL = 'https://reaction-be-production.up.railway.app';

export const socket = io(URL);

