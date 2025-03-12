import { create } from 'zustand';
import axios from 'axios';

// Definisikan interface untuk Customer
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



// Definisikan interface untuk CustomerStore
interface CustomerStore {
  customer: Customer | null; // Customer bisa null jika belum dimuat
  error: string | null; // Error bisa null jika tidak ada error
  loading: boolean; // Status loading
  pagination: Pagination; // Pagination jika diperlukan
  setLoading: (loading: boolean) => void; // Fungsi untuk mengatur loading
  setCustomer: (customer: Customer) => void; // Fungsi untuk mengatur customer
  setError: (error: string | null) => void; // Fungsi untuk mengatur error
  fetchCustomerById: (id: string) => Promise<void>; 
  setCustomerById: (customer: Customer) => void;
}

// Buat store menggunakan Zustand
const useCustomerStore = create<CustomerStore>((set) => ({
  customer: null,
  error: null,
  loading: false,
  pagination: { currentPage: 1, totalPages: 1 }, // Inisialisasi pagination jika diperlukan

  setLoading: (loading) => set({ loading }),
  setCustomer: (customer) => set({ customer }),
  setError: (error) => set({ error }),

  setCustomerById: (customer) => set({ customer }),
  
  fetchCustomerById: async (id) => {
    set({ loading: true, error: null }); // Set loading dan reset error
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/customers/${id}`); // Ganti dengan endpoint API yang sesuai
      set({ customer: response.data.data, loading: false }); // Set customer dan matikan loading
    } catch (error) {
      set({ error: error.message || 'Failed to fetch customer', loading: false }); // Set error jika terjadi kesalahan
    }
  },
}));

export default useCustomerStore;
