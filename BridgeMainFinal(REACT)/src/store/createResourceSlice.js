import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getErrorMessage } from '../services/http';

/**
 * Builds a Redux Toolkit slice + async thunks for one REST resource.
 *
 * State shape (identical for every resource, so every page handles
 * loading / error / empty the same way):
 *
 *   items       the currently loaded records
 *   status      'idle' | 'loading' | 'succeeded' | 'failed'   <- list fetch
 *   error       message of the last failed fetch (or null)
 *   page / totalPages / total   server-side pagination info
 *   mutation    'idle' | 'loading' | 'succeeded' | 'failed'   <- create/update/delete
 *
 * `append: true` makes page > 1 results get appended instead of replacing the
 * list. That's what powers infinite scroll.
 */
export function createResourceSlice({ name, api, append = false }) {
  const rejectMessage = (err, { rejectWithValue }) => rejectWithValue(getErrorMessage(err));

  const fetchItems = createAsyncThunk(`${name}/fetch`, async (params, thunkApi) => {
    try {
      // thunkApi.signal lets the component cancel a stale request (see useResourceFetch).
      return await api.list(params, thunkApi.signal);
    } catch (err) {
      return rejectMessage(err, thunkApi);
    }
  });

  const createItem = createAsyncThunk(`${name}/create`, async (body, thunkApi) => {
    try {
      return await api.create(body);
    } catch (err) {
      return rejectMessage(err, thunkApi);
    }
  });

  const updateItem = createAsyncThunk(`${name}/update`, async ({ id, body }, thunkApi) => {
    try {
      return await api.update(id, body);
    } catch (err) {
      return rejectMessage(err, thunkApi);
    }
  });

  const deleteItem = createAsyncThunk(`${name}/delete`, async (id, thunkApi) => {
    try {
      return await api.remove(id);
    } catch (err) {
      return rejectMessage(err, thunkApi);
    }
  });

  const initialState = {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    totalPages: 1,
    total: 0,
    mutation: 'idle',
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // ---- list fetch ----
        .addCase(fetchItems.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
          const { data, total, page, totalPages } = action.payload;
          if (append && page > 1) {
            const known = new Set(state.items.map((item) => item.id));
            state.items.push(...data.filter((item) => !known.has(item.id)));
          } else {
            state.items = data;
          }
          state.total = total;
          state.page = page;
          state.totalPages = totalPages;
          state.status = 'succeeded';
        })
        .addCase(fetchItems.rejected, (state, action) => {
          // A cancelled (stale) request must not flip the UI into "failed":
          // a newer request is already in flight.
          if (action.meta.aborted) return;
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        })

        // ---- mutations ----
        .addCase(updateItem.fulfilled, (state, action) => {
          const index = state.items.findIndex((item) => item.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
          state.items = state.items.filter((item) => item.id !== action.payload.id);
          state.total = Math.max(0, state.total - 1);
        })
        .addMatcher(isAnyOf(createItem.pending, updateItem.pending, deleteItem.pending), (state) => {
          state.mutation = 'loading';
        })
        .addMatcher(isAnyOf(createItem.fulfilled, updateItem.fulfilled, deleteItem.fulfilled), (state) => {
          state.mutation = 'succeeded';
        })
        .addMatcher(isAnyOf(createItem.rejected, updateItem.rejected, deleteItem.rejected), (state) => {
          state.mutation = 'failed';
        });
    },
  });

  return {
    reducer: slice.reducer,
    thunks: { fetchItems, createItem, updateItem, deleteItem },
  };
}
