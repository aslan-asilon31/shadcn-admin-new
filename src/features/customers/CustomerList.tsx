// CustomerList.js
import { Header } from '@/components/layout/header';
import axios from 'axios';

import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Input } from "@/components/ui/input";
import  { useEffect } from 'react';


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
  const { customers, loading,handleEdit, setCustomers,setLoading, setPagination, error, pagination, setPerPage, setPage } = useCustomerStore();
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
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
    fetchCustomers();
  }, [pagination.current_page, pagination.per_page]);
  

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
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
                        <Input placeholder="Filter id..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter product id..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter title..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter slug..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter url..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter excerpt..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter image url..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter created by..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter updated by..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter created at..." className="max-w-sm text-xs" />
                      </div>
                      <div className="">
                        <Input placeholder="Filter updated at..." className="max-w-sm text-xs" />
                      </div>
                    </div>
                    <button className="bg-blue-800 text-white radius-sm m-1 p-1">Filter</button>
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
            <select onChange={(e) => setPerPage(Number(e.target.value))} value={pagination.per_page}>
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
    </>
  );
}
