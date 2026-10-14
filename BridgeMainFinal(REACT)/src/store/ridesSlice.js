import { createResourceSlice } from './createResourceSlice';
import { ridesApi } from '../services/api';

const rides = createResourceSlice({ name: 'rides', api: ridesApi });

export const {
  fetchItems: fetchRides,
  createItem: createRide,
  updateItem: updateRide,
  deleteItem: deleteRide,
} = rides.thunks;

export default rides.reducer;
