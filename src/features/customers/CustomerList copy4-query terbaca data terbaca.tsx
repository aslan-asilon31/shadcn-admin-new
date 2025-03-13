import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [searchCustomer, setSearchCustomer] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fungsi untuk mengambil data produk
  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fungsi untuk menerapkan filter
  const applyFilter = () => {
    let filtered = products;

    // Filter berdasarkan nama produk
    if (searchCustomer) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchCustomer.toLowerCase())
      );
    }

    // Tambahkan filter berdasarkan createdBy jika diperlukan
    // Misalnya, jika Anda memiliki data createdBy dalam produk
    if (createdBy) {
      filtered = filtered.filter(product => product.createdBy === createdBy);
    }

    // Sortir produk
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(filtered);
  };

  // Mengambil data produk saat komponen dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // Menggunakan useEffect untuk menerapkan filter setiap kali produk atau parameter pencarian berubah
  useEffect(() => {
    applyFilter();
  }, [searchCustomer, createdBy, products, sort]);

  return (
    <div>
      <h1>Daftar Produk</h1>
      <input
        type="text"
        placeholder="Cari produk..."
        value={searchCustomer}
        onChange={(e) => setSearchCustomer(e.target.value)}
      />
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="price">Harga</option>
      </select>
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>Harga: ${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
