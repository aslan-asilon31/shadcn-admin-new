// store.js
import { create } from 'zustand';
import axios from 'axios';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  created_by: string;
  updated_by: string;
  is_activated: number;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface CustomerStore {
  customers: Customer[];
  fetchCustomers: (current_page: number, per_page: number) => Promise<void>;
  error: any;
  loading: boolean;
  pagination: Pagination;
  setItemsPerPage: (perPage: number) => Promise<void>;
  setPage: (page: number) => void;
}

const customerStore = create<CustomerStore>((set) => ({
  customers: [],
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    from: 1,
    last_page: 1,
    per_page: 10,
    prev_page_url: null,
    to: 10,
    total: 0,
  },

  setCustomers: (customers: Customer[]) => {
    set({ customers }); 
  },

  fetchCustomers: async (current_page = 1, per_page = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:8000/api/customers', {
        params: {
          page: current_page,
          per_page: per_page,
        },
      });

      set({
        customers: response.data.data.data,
        pagination: {
          current_page: response.data.data.current_page,
          from: response.data.data.from,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          prev_page_url: response.data.data.prev,
          to: response.data.data.to,
          total: response.data.data.total,
        },
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setItemsPerPage: async (perPage: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        per_page: perPage,
      },
    }));
    await customerStore.getState().fetchCustomers(1, perPage);
  },

  setPage: (page: number) => {
    const { pagination } = customerStore.getState();
    if (page < 1 || page > pagination.last_page) return;
    customerStore.getState().fetchCustomers(page, pagination.per_page);
  },
  
}));

export default customerStore;
