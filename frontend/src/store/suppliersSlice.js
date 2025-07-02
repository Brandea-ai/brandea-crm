import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetch',
  async () => {
    const response = await api.get('/suppliers');
    return response.data;
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, data }) => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id) => {
    await api.delete(`/suppliers/${id}`);
    return id;
  }
);

export const moveSupplier = createAsyncThunk(
  'suppliers/move',
  async ({ id, newStatus, newPosition }) => {
    const response = await api.put(`/suppliers/${id}/move`, { newStatus, newPosition });
    return response.data;
  }
);

export const updateSupplierStatus = createAsyncThunk(
  'suppliers/updateStatus',
  async ({ id, status }) => {
    const response = await api.put(`/suppliers/${id}/status`, { status });
    return response.data;
  }
);

export const fetchColumns = createAsyncThunk(
  'suppliers/fetchColumns',
  async () => {
    const response = await api.get('/columns');
    return response.data;
  }
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: {
    suppliers: [],
    columns: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    optimisticUpdate: (state, action) => {
      const { id, data } = action.payload;
      const supplier = state.suppliers.find(s => s.id === id);
      if (supplier) {
        Object.assign(supplier, data);
      }
    },
    optimisticMove: (state, action) => {
      const { suppliers } = action.payload;
      state.suppliers = suppliers;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      })
      .addCase(moveSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(updateSupplierStatus.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
      });
  },
});

export const { optimisticUpdate, optimisticMove } = suppliersSlice.actions;
export default suppliersSlice.reducer;