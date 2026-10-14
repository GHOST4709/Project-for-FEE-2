import { createResourceSlice } from './createResourceSlice';
import { thriftApi } from '../services/api';

// append: true -> infinite scroll keeps adding pages to the same list.
const thrift = createResourceSlice({ name: 'thrift', api: thriftApi, append: true });

export const {
  fetchItems: fetchThrift,
  createItem: createThriftItem,
  updateItem: updateThriftItem,
  deleteItem: deleteThriftItem,
} = thrift.thunks;

export default thrift.reducer;
