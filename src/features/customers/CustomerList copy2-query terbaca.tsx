import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [searchBrand, setSearchBrand] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [customers, setCustomers] = useState([]);

  const fetchAdvanceSearch = async (brand, creator, pageNum, sortOrder) => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products', {
        params: {
          // Sesuaikan dengan parameter yang didukung oleh API
          // Misalnya, jika API tidak mendukung filter, Anda perlu menyesuaikan ini
          // filter: brand,
          // created_by: creator,
          // page: pageNum,
          // sort: sortOrder,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault(); // Mencegah refresh halaman

    // Memperbarui URL dengan parameter baru
    const params = new URLSearchParams();
    params.set('filter', searchBrand);
    params.set('created_by', createdBy);
    params.set('page', page);
    params.set('sort', sort);

    // Memperbarui URL tanpa memuat ulang halaman
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

    // Panggil fungsi pencarian
    fetchAdvanceSearch(searchBrand, createdBy, page, sort);
  };

  useEffect(() => {
    // Ambil data saat komponen pertama kali dimuat
    fetchAdvanceSearch(searchBrand, createdBy, page, sort);
  }, [page, sort]); // Menjalankan ulang saat page atau sort berubah

  return (
    <div>
      <h1>Daftar Pelanggan</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Brand"
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Created By"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.title}</li> // Sesuaikan dengan data yang diterima
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
