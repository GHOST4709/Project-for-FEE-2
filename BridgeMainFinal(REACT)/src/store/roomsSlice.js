import { createResourceSlice } from './createResourceSlice';
import { roomsApi } from '../services/api';

const rooms = createResourceSlice({ name: 'rooms', api: roomsApi });

export const { fetchItems: fetchRooms } = rooms.thunks;
export default rooms.reducer;
