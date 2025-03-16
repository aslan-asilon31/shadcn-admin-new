import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { CustomerFormData, customerSchema } from './CustomerSchema';

const CustomerCreate = () => {

   const { register, reset,  formState: { errors }, handleSubmit } = useForm<CustomerFormData>({
     resolver: zodResolver(customerSchema),
   });


const onSubmit = async (data:any) => {

  if (data.is_activated) {
    data.is_activated = Number(data.is_activated);
  }

    try {
            const response = await axios.post(`http://127.0.0.1:8000/api/customers/store`, {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            email: data.email,
            created_by: data.created_by,
            updated_by: data.updated_by,
            is_activated: data.is_activated,
            created_at: data.created_at,
            updated_at: data.updated_at,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        alert('Customer created successfully');
        reset();
        useNavigate({ from: '/customers/create' })
        
    } catch (error) {
        alert('Error creating customer: ' + error.message);
    }
};





  return (
    <div>
      <Header />
      <Main>
        <h1>Create Customer</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="first name">First Name</label>
              <Input
                id="first_name"
                type="text"
                {...register('first_name')}
                placeholder="Enter your first name"
              />
              {errors.first_name && <span>{errors.first_name.message}</span>}
            </div>
            <div>
              <label htmlFor="last name">Last Name</label>
              <Input
                id="last_name"
                type="text"
                {...register('last_name')}
                placeholder="Enter your last name"
              />
              {errors.last_name && <span>{errors.last_name.message}</span>}
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <Input
                id="phone"
                type="text"
                {...register('phone')}
                placeholder="Enter your phone"
              />
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>    
            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="text"
                {...register('email')}
                placeholder="Enter your email"
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div>
              <label htmlFor="is_activated">Is Activated</label>
              <div>
                <label>
                  <input
                    type="radio"
                    id="is_activated_yes"
                    value={1}
                    {...register('is_activated', { required: 'This field is required' })}
                  />
                  Yes
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    id="is_activated_no"
                    value={0}
                    {...register('is_activated')}
                  />
                  No
                </label>
              </div>
              {errors.is_activated && <span>{errors.is_activated.message}</span>}
            </div>

            <div className="flex">
              <button className="bg-blue-800 text-white radius-sm m-1 p-1" type="submit">Submit</button>
            </div>

          </form>
      </Main>
    </div>
  );
};

export default CustomerCreate;
