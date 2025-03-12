// CustomerEdit.js
import { Header } from '@/components/layout/header';
import axios from 'axios';
import { Main } from '@/components/layout/main';
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import useCustomerFormStore from '@/stores/customerFormStore';

import { z } from 'zod';

const CustomerEdit = () => {

  // Define Zod schema for validation
  const customerSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    phone: z.string()
          .min(1, "Phone number is required")
          .regex(/^0[0-9]*$/, "Nomor Hanphone hanya boleh angka dan di mulai dari angka 0"),
    created_at: z.string().optional(),

  });
  
  const { id } = useParams({strict:false}); // Get the customer ID from the URL
  const [formErrors, setFormErrors] = useState({});
  const { customer , loading, error, setCustomerById } = useCustomerFormStore();
  const fetchCustomerById = async () => {

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/customers/edit/${id}`); // Ganti dengan endpoint API yang sesuai
      setCustomerById(response.data.data); // Set data pelanggan
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    fetchCustomerById(); // Panggil fungsi untuk mengambil data pelanggan saat komponen dimuat
  }, [id]); // Dependency array untuk memanggil ulang jika ID berubah


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!customer) {
    return <p>No customer data available.</p>;
  }
  
  const handleUpdate = async () => {
    try {
      customerSchema.parse(customer);
      await axios.put(`http://localhost:8000/api/customers/update/${customer.id}`, customer);
      alert('success update data');
      setFormErrors({});
    } catch (err) {
      alert('error update data');
      console.error("Error updating customer:", err);
      if (err instanceof z.ZodError) {
        // Capture Zod validation errors
        const errors = {};
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message; // Map error messages to their respective fields
        });
        setFormErrors(errors); // Set the form errors state
      } else {
        alert('Error updating customer');
        console.error("Error updating customer:", err);
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM
  };

  return (
    <div>
      <Header />
      <Main>
        <h1>Edit Customer</h1>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }} 
          className="space-y-4 p-6 bg-white rounded-lg shadow-md"
          >
          <Input 
            value={customer.first_name} 
            onChange={(e) => setCustomerById({...customer, first_name: e.target.value})} 
            placeholder="First Name" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {formErrors.first_name && <p className="text-red-500 text-sm">{formErrors.first_name}</p>}


          <Input 
            value={customer.last_name} 
            onChange={(e) => setCustomerById({...customer, last_name: e.target.value})} 
            placeholder="Last Name" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {formErrors.last_name && <p className="text-red-500 text-sm">{formErrors.last_name}</p>}


          <Input 
            value={customer.phone} 
            onChange={(e) => setCustomerById({...customer, phone: e.target.value})} 
            placeholder="Phone" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}


          <Input 
            value={customer.email} 
            onChange={(e) => setCustomerById({...customer, email: e.target.value})} 
            placeholder="Email" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}


           <Input 
              type="datetime-local"
              value={customer.created_at ? formatDateTime(customer.created_at) : ''}
              onChange={(e) => setCustomerById({ ...customer, created_at: e.target.value })}
              placeholder="Created At"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          <button 
            type="submit" 
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Customer
          </button>
        </form>

      </Main>
    </div>
  );
};

export default CustomerEdit;
