import { configureStore } from '@reduxjs/toolkit';
import rides from './ridesSlice';
import rooms from './roomsSlice';
import thrift from './thriftSlice';
import shops from './shopsSlice';

/**
 * Global *server* state lives in Redux Toolkit (lists fetched from the API).
 * Global *app* state (auth, theme, toasts) lives in React Context.
 * Everything else (form inputs, open tab, open modal) is plain local state.
 */
export const store = configureStore({
  reducer: { rides, rooms, thrift, shops },
});
