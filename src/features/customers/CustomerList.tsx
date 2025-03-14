// CustomerList.js
import { Header } from '@/components/layout/header';
import axios from 'axios';

import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Input } from "@/components/ui/input";
import  { useEffect,useState  } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useCustomerStore from '@/stores/customerStore';

export type ProductContent = {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  url: string;
  excerpt: string;
  image_url: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_activated: boolean;
};


// Definisikan skema validasi menggunakan Zod
const customerSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string()
    .optional() // Mengizinkan field ini untuk tidak ada
    .nullable() // Mengizinkan field ini untuk bernilai null
    .refine(value => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email format",
    }), // Memvalidasi email jika tidak kosong
  phone: z.string()
    .regex(/^0[0-9]*$/, "Nomor Handphone hanya boleh angka dan dimulai dari angka 0")
    .optional() // Mengizinkan field ini untuk tidak ada
    .nullable() // Mengizinkan field ini untuk bernilai null
    .or(z.literal('')), // Mengizinkan field ini untuk bernilai string kosong
  
  created_by: z.string().optional(),

  updated_by: z.string().optional(),

  is_activated: z.boolean().optional() // Mengizinkan field ini untuk tidak ada
  .nullable() // Mengizinkan field ini untuk bernilai null
  .or(z.literal('')), // Mengizinkan field ini untuk bernilai string kosong

  created_at: z.string()
    .optional()
    .refine((value) => {
      // Memeriksa apakah value sesuai dengan format tanggal YYYY-MM-DD
      return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
    }, {
      message: "Invalid date format. Expected format: YYYY-MM-DD",
    }),
  updated_at: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerList() {
  const { customers, loading,handleEdit,  setCustomers,setLoading, setPagination, error, pagination, setPerPage, setPage } = useCustomerStore();
  const [filterParams, setFilterParams] = useState(new URLSearchParams());

  const { register, reset,  formState: { errors }, handleSubmit } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });
  

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`http://localhost:8000/api/customers?page=${pagination.current_page}&from=${pagination.from}&per_page=&last_page=${pagination.last_page}${pagination.per_page}&prev_page_url=${pagination.prev_page_url}&to=${pagination.to}&total=${pagination.total}`);

      const response = await axios.get(`http://localhost:8000/api/customers?page=${pagination.current_page}&per_page=${pagination.per_page}`);
      setCustomers(response.data.data.data); // Set customers
      setPagination({
        current_page: response.data.data.current_page,
        from: response.data.data.from,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        prev_page_url: response.data.data.prev_page_url,
        to: response.data.data.to,
        total: response.data.data.total,
      }); // Set pagination
      setLoading(false);

    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchAdvanceSearch = async (data:any) => {
    try {
      
      const params = {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: data.email,
          created_by: data.created_by,
          updated_by: data.updated_by,
          is_activated: data.is_activated,
          created_at: data.created_at,
          updated_at: data.updated_at,
      };

      const response = await axios.get('http://localhost:8000/api/customer-filter', { params });
      setCustomers(response.data.data.data); 
      
      
      console.log(response.data.data.data)


      setLoading(false);

    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    fetchCustomers();
  }, [pagination.current_page, pagination.per_page, pagination.to,filterParams]);
  


  

  const onSubmit = (data:any) => {
    const params = new URLSearchParams();

    if (data.first_name) {
        params.set('first-name', data.first_name);
    }
    if (data.last_name) {
        params.set('last-name', data.last_name);
    }
    if (data.phone) {
        params.set('phone', data.phone);
    }
    if (data.email) {
        params.set('email', data.email);
    }
    if (data.created_by) {
        params.set('created-by', data.created_by);
    }
    if (data.updated_by) {
        params.set('updated-by', data.updated_by);
    }
    if (data.is_activated) {
        params.set('is-activated', data.is_activated);
    }
    if (data.created_at) {
        params.set('created-at', data.created_at);
    }
    if (data.updated_at) {
        params.set('updated-at', data.updated_at);
    }
     // Memperbarui URL tanpa memuat ulang halaman
     window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

     fetchAdvanceSearch(data);
  };

  const handleSetPage = (value: number) => {
    setPage(value);
    console.log('value set page', value)
    // const filteredCustomers = filterCustomers(customers);
    // setCustomers(filteredCustomers);

    const params = new URLSearchParams();
    console.log('handleSetPage params',params);

    params.set('current_page', value);
    params.set('from', pagination.from);
    params.set('last_page', pagination.last_page);
    params.set('per_page', pagination.per_page);
    params.set('prev_page_url', pagination.prev_page_url);
    params.set('to', pagination.to);
    params.set('total', pagination.total);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSetPerPage = (value: number) => {
    setPerPage(value);
    console.log('value set per page', value)


    const params = new URLSearchParams();
    params.set('current_page', pagination.current_page);
    params.set('from', pagination.from);
    params.set('last_page', pagination.last_page);
    params.set('per_page', value);
    params.set('prev_page_url', pagination.prev_page_url);
    params.set('to', pagination.to);
    params.set('total', pagination.total);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };


  const clearFilter = () => {
    // Reset the form fields to their default values
    reset();

    // Clear the filter parameters
    setFilterParams(new URLSearchParams());

    // Fetch the customer list without any filters
    fetchCustomers();
  };

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='w-full mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <h3 className='w-full text-2xl text-center font-bold tracking-tight'>Customer List</h3>
          <div className="w-full flex justify-between items-center p-4 border-t">
            <a href="customers/create" className="bg-blue-800 text-white m-1 p-1 radius-sm">Create</a>
            <Dialog>
              <DialogTrigger className="bg-blue-800 text-white m-1 p-1 radius-sm">Filter</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center mb-4">Advanced Search</DialogTitle>
                  <DialogDescription className="w-full text-center">
                    <div className="grid grid-cols-3 gap-4">
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
                          <label htmlFor="created_by">Created By</label>
                          <Input
                            id="created_by"
                            type="text"
                            {...register('created_by')}
                            placeholder="Enter your created_by"
                          />
                          {errors.created_by && <span>{errors.created_by.message}</span>}
                        </div>    
                        <div>
                          <label htmlFor="updated_by">Updated By</label>
                          <Input
                            id="updated_by"
                            type="text"
                            {...register('updated_by')}
                            placeholder="Enter your updated_by"
                          />
                          {errors.updated_by && <span>{errors.updated_by.message}</span>}
                        </div>    
                        <div>
                          <label htmlFor="is_activated">Is Activated</label>
                          <Input
                            id="is_activated"
                            type="text"
                            {...register('is_activated')}
                            placeholder="Enter your is_activated"
                          />
                          {errors.is_activated && <span>{errors.is_activated.message}</span>}
                        </div> 
                        <div>
                          <label htmlFor="created_at">Created At</label>
                          <Input
                            id="created_at"
                            type="date"
                            {...register('created_at')}
                            placeholder="Enter your created_at"
                          />
                          {errors.created_at && <span>{errors.created_at.message}</span>}
                        </div>    
                        <div>
                          <label htmlFor="updated_at">Updated At</label>
                          <Input
                            id="updated_at"
                            type="text"
                            {...register('updated_at')}
                            placeholder="Enter your updated_at"
                          />
                          {errors.updated_at && <span>{errors.updated_at.message}</span>}
                        </div>     

                        <div className="flex">
                          <button className="bg-blue-800 text-white radius-sm m-1 p-1" type="submit">Submit</button>
                          <button className="bg-red-800 text-white radius-sm m-1 p-1" onClick={clearFilter}>Clear Filter</button>

                        </div>

                      </form>
                    </div>

                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <Table className="border border-gray-300">
            <TableHeader className="bg-blue-800">
              <TableRow>
                <TableHead className="text-center text-white w-[100px] border-b border-r border-gray-300"></TableHead>
                <TableHead className="text-center text-white w-[100px] border-b border-r border-gray-300">No</TableHead>
                <TableHead className="text-center text-white w-[100px] border-b border-r border-gray-300">ID</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">First Name</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Last Name</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Phone</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Email</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Is Activated</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Created By</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Updated By</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Created At</TableHead>
                <TableHead className="text-center text-white border-b border-r border-gray-300">Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer,index) => (
                <TableRow key={customer.id} className="border-b border-gray-200 text-center">
                  <TableCell className="text-center border-r border-gray-300">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="">...</DropdownMenuTrigger>
                      <DropdownMenuContent className="text-center">
                        <button onClick={() => handleEdit(customer.id)}>Edit</button>
                        <button>Show</button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-center border-r border-gray-300">{(pagination.from + index)}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.id}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.first_name}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.last_name}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.phone}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.email}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.is_activated ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.created_by}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.updated_by}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.created_at}</TableCell>
                  <TableCell className="text-center border-r border-gray-300">{customer.updated_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          {/* Bagian Kiri: Informasi Halaman */}
          <div className="text-sm">
            Page {pagination.current_page} of {pagination.last_page} | {pagination.total} items
          </div>

          <div className="text-sm">
            <select onChange={(e) => handleSetPerPage(Number(e.target.value))} value={pagination.per_page}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Bagian Kanan: Tombol Navigasi */}
          <div className="flex space-x-2">
            <button onClick={() => handleSetPage(1)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              First
            </button>
            <button onClick={() => handleSetPage(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Previous
            </button>
            <button onClick={() => handleSetPage(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Next
            </button>
            <button onClick={() => handleSetPage(pagination.last_page)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Last
            </button>
          </div>
        </div>
      </Main>
    </div>
  );
}
