// CustomerList.js
import { Header } from '@/components/layout/header';
import axios from 'axios';

import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Input } from "@/components/ui/input";
import  { useEffect,useState  } from 'react';


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

export default function CustomerList() {
  const { customers, loading,handleEdit, fetchAdvanceSearch, setCustomers,setLoading, setPagination, error, pagination, setPerPage, setPage } = useCustomerStore();
  const [filter, setFilter] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filteredCustomers = filterCustomers(customers, filterValues);
    console.log(filteredCustomers);
    
    // Memperbaiki penamaan parameter
    const currentPage = params.get('current_page'); 
    const from = params.get('from');
    const last_page = params.get('last_page'); // Perbaiki penamaan dari 'last_page' ke 'last-page'
    const per_page = params.get('per_page'); // Perbaiki penamaan dari 'per_page' ke 'per-page'
    const prev_page_url = params.get('prev_page_url'); // Perbaiki penamaan dari 'prev_page_url' ke 'prev-page-url'
    const to = params.get('to');
    const total = params.get('total');

    // Mengupdate state berdasarkan query parameters

    if (currentPage) setPagination((prev:any) => ({ ...prev, current_page: Number(currentPage) }));
    if (from) setPagination((prev:any) => ({ ...prev, from: Number(from) }));
    if (last_page) setPagination((prev:any) => ({ ...prev, last_page: Number(lastPage) }));
    if (per_page) setPagination((prev:any) => ({ ...prev, per_page: Number(perPage) }));
    if (prev_page_url) setPagination((prev:any) => ({ ...prev, prev_page_url: prevPageUrl }));
    if (to) setPagination((prev:any) => ({ ...prev, to: Number(to) }));
    if (total) setPagination((prev:any) => ({ ...prev, total: Number(total) }));

    // params.set('current_page', pagination.per_page);
    // params.set('from', pagination.from);
    // params.set('last_page', pagination.last_page);
    // params.set('per_page', pagination.per_page);
    // params.set('prev_page_url', pagination.prev_page_url);
    // params.set('to', pagination.to);
    // params.set('total', pagination.total);


    // if (currentPage) setPage(Number(currentPage));
    // if (from) setPagination(Number(from));
    // if (last_page) setPagination(Number(last_page));
    // if (per_page) setPagination(Number(per_page));
    // if (prev_page_url) setPagination(Number(prev_page_url));
    // if (to) setPagination(Number(to));
    // if (total) setPagination(Number(total));

    fetchCustomers();
  }, []);
  

  const [filterValues, setFilterValues] = useState({
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const filterCustomers = (customers, filters) => {
    return customers.filter((customer) => {
      // String matching for text fields
      const textFieldsMatch = Object.keys(filters).every((key) => {
        if (typeof customer[key] === 'string' && typeof filters[key] === 'string' && filters[key]) {
          return customer[key].toLowerCase().includes(filters[key].toLowerCase());
        }
        return true;
      });

      // Strict equality for boolean fields
      const booleanFieldsMatch = Object.keys(filters).every((key) => {
        if (typeof customer[key] === 'boolean' && typeof filters[key] === 'string') {
          return customer[key] === (filters[key] === 'true');
        }
        return true;
      });

      // Date parsing for date fields
      const dateFieldsMatch = Object.keys(filters).every((key) => {
        if (typeof customer[key] === 'string' && key.includes('_at') && filters[key]) {
          const customerDate = new Date(customer[key]);
          const filterDate = new Date(filters[key]);
          return customerDate.toISOString().startsWith(filterDate.toISOString().split('T')[0]);
        }
        return true;
      });

      return textFieldsMatch && booleanFieldsMatch && dateFieldsMatch;
    });
  };

  const applyFilters = () => {
    const filteredCustomers = filterCustomers(customers, filterValues);

    setCustomers(filteredCustomers);
    setPagination({
      ...pagination,
      current_page: 1,
      from: 1,
      to: filteredCustomers.length,
      total: filteredCustomers.length,
    });

    const params = new URLSearchParams();

    if (firstNameFilter) {
        params.set('first-name', firstNameFilter);
    }
    if (lastNameFilter) {
        params.set('last-name', lastNameFilter);
    }
     // Memperbarui URL tanpa memuat ulang halaman
     window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

     fetchAdvanceSearch(firstNameFilter, lastNameFilter);

  };

  const handleSetPerPage = (value) => {
    console.log('value set page', value)
    const filteredCustomers = filterCustomers(customers, filterValues);
    setCustomers(filteredCustomers);
    setPerPage(value);

    const params = new URLSearchParams();
    params.set('current_page', pagination.per_page);
    params.set('from', pagination.from);
    params.set('last_page', pagination.last_page);
    params.set('per_page', pagination.per_page);
    params.set('prev_page_url', pagination.prev_page_url);
    params.set('to', pagination.to);
    params.set('total', pagination.total);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };


  const clearFilters = () => {
    setFilterValues({
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
    });
    fetchCustomers(); // Refresh the customer list with unfiltered data
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
                      <div className="">
                        <span>ID </span>
                        <Input
                          name="id"
                          value={filterValues.id}
                          onChange={handleInputChange}
                          placeholder="Filter id..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>First Name </span>
                        <Input
                          name="first_name"
                          value={firstNameFilter}
                          onChange={(e) => setFirstNameFilter(e.target.value)}
                          placeholder="Filter First Name..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Last Name </span>
                        <Input
                          name="last_name"
                          value={lastNameFilter}
                          onChange={(e) => setLastNameFilter(e.target.value)}
                          placeholder="Filter Last Name ..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Phone </span>
                        <Input
                          name="phone"
                          value={filterValues.phone}
                          onChange={handleInputChange}
                          placeholder="Filter Phone..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Email </span>
                        <Input
                          name="email"
                          value={filterValues.email}
                          onChange={handleInputChange}
                          placeholder="Filter Email..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Is Activated </span>
                        <Input
                          name="is_activated"
                          value={filterValues.is_activated}
                          onChange={handleInputChange}
                          placeholder="Filter Is Activated... (true/false)"
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Created By </span>
                        <Input
                          name="created_by"
                          value={filterValues.created_by}
                          onChange={handleInputChange}
                          placeholder="Filter created by..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Updated By </span>
                        <Input
                          name="updated_by"
                          value={filterValues.updated_by}
                          onChange={handleInputChange}
                          placeholder="Filter updated by..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Created At </span>
                        <Input
                          type="datetime-local"
                          name="created_at"
                          value={filterValues.created_at}
                          onChange={handleInputChange}
                          placeholder="Filter created at..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                      <div className="">
                        <span>Updated At </span>
                        <Input
                          type="datetime-local"
                          name="updated_at"
                          value={filterValues.updated_at}
                          onChange={handleInputChange}
                          placeholder="Filter updated at..."
                          className="max-w-sm text-xs"
                        />
                      </div>
                    </div>
                    <button
                      onClick={applyFilters}
                      className="bg-blue-800 text-white radius-sm m-1 p-1"
                    >
                      Filter
                    </button>
                    <button className="bg-red-800 text-white radius-sm m-1 p-1" onClick={clearFilters}>Clear Filter</button>
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
            <button onClick={() => setPage(1)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              First
            </button>
            <button onClick={() => setPage(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Previous
            </button>
            <button onClick={() => setPage(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Next
            </button>
            <button onClick={() => setPage(pagination.last_page)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Last
            </button>
          </div>
        </div>
      </Main>
    </div>
  );
}
