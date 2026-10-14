import { createResourceSlice } from './createResourceSlice';
import { shopsApi } from '../services/api';

const shops = createResourceSlice({ name: 'shops', api: shopsApi });

export const { fetchItems: fetchShops } = shops.thunks;
export default shops.reducer;
