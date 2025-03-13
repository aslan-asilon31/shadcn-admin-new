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
  prev_page_url: null;
  to: number;
  total: number;
}

interface CustomerStore {
  customer: Customer;
  customers: Customer[];
  error: any;
  loading: boolean;
  pagination: Pagination;
  setLoading: (loading: boolean) => void;
  setCustomers: (customers: Customer[]) => void; // Tambahkan parameter pagination
  setCustomer: (customer: Customer) => void;
  setPerPage: (per_page: number) => Promise<void>;
  setPage: (page: number) => void;
  setPagination: (page: number) => void;
  handleEdit: (customerId: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  fetchCustomerById: (customer: Customer) => void;
  fetchAdvanceSearch: (firstNameFilter: string, lastNameFilter : string) => void;
  setFilter: (filter: Partial<CustomerStore['filter']>) => void;
  clearFilter: () => void;
  filter: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    is_activated: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
  };

}

const customerStore = create<CustomerStore>((set) => ({
  customers: [],
  customer: null,
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
  filter: {
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    is_activated: '',
    created_by: '',
    updated_by: '',
    created_at: '',
    updated_at: '',
  },
  

  setCustomers: (customers: Customer[]) => {
    set({ customers }); // Set only customers
  },

  setCustomer: (customer) => {
    set({ customer });
  },



  setPagination: (pagination: Pagination) => {
    set({ pagination }); // Set only pagination
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setPerPage: (per_page: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        per_page: per_page,
        current_page: 1,
      },
    }));
  },
  
  setPage: (current_page: number) => {
    set((state) => {
      if (current_page < 1 || current_page > state.pagination.last_page) return state; // Validasi halaman
      return {
        pagination: {
          ...state.pagination,
          current_page: current_page,
        },
      };
    });
  },

  handleEdit: (customerId: string) => {
    window.location.href = `/customers/${customerId}/edit/`;
  },

  setSelectedCustomer: (customer: Customer | null) => {
    set({ selectedCustomer: customer }); // Set customer yang dipilih
  },

  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
  
  clearFilter: () => set({ // Clear filter action
    filter: {
      id: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      is_activated: '',
      created_by: '',
      updated_by: '',
      created_at: '',
      updated_at: '',
    },
  }),


  fetchAdvanceSearch: async (firstNameFilter, lastNameFilter) => {
    try {

      const response = await axios.post(`http://127.0.0.1:8000/api/customer-filter`, {
        first_name: firstNameFilter,
        last_name: lastNameFilter,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      // const response = await axios.get(`http://localhost:8000/api/customers?`);
      

      set({ customers: response.data.data.data, loading: false });
      console.log(response.data.data.data);
      alert('search');
    } catch (error) {
      set({ error: error.message });
    }
  },




}));

export default customerStore;
