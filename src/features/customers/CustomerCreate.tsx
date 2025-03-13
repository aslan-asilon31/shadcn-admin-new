import { Header } from '@/components/layout/header';
import axios from 'axios';
import { Main } from '@/components/layout/main';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { z } from 'zod';

const CustomerCreate = () => {
  // State for customer data
  const [customer, setCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    is_activated: 1, // Reset to default
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({});

  // Define Zod schema for validation
  const customerSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    phone: z.string()
      .min(1, "Phone number is required")
      .regex(/^0[0-9]*$/, "Phone number must start with 0 and contain only digits"),
    is_activated: z.number().min(0).max(1, "Activation status must be 0 or 1"),

  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Mengirim permintaan POST menggunakan Fetch API
        const response = await axios.post(`http://127.0.0.1:8000/api/customers`, {
            first_name: customer.first_name,
            last_name: customer.last_name,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        alert('Customer created successfully');
    } catch (error) {
        alert('Error creating customer: ' + error.message);
    }
};



  return (
    <div>
      <Header />
      <Main>
        <h1>Create Customer</h1>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
          <Input 
            value={customer.first_name} 
            onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })} 
            placeholder="First Name" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.first_name && <p className="text-red-500 text-sm">{formErrors.first_name}</p>}

          <Input 
            value={customer.last_name} 
            onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })} 
            placeholder="Last Name" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.last_name && <p className="text-red-500 text-sm">{formErrors.last_name}</p>}

          <Input 
            value={customer.email} 
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })} 
            placeholder="Email" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

          <Input 
            value={customer.phone} 
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} 
            placeholder="Phone" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}



          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={customer.is_activated === 1} 
              onChange={(e) => setCustomer({ ...customer, is_activated: e.target.checked ? 1 : 0 })} 
            />
            <label className="ml-2">Is Activated</label>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Customer
          </button>
        </form>
      </Main>
    </div>
  );
};

export default CustomerCreate;
