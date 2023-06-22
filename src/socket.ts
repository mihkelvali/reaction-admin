import { io } from 'socket.io-client';

const URL = 'http://localhost:7524';

export const socket = io(URL);

