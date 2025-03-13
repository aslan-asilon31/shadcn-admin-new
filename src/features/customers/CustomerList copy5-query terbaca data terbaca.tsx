import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [searchCustomer, setSearchCustomer] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mengambil data produk dari API saat komponen dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setFilteredProducts(response.data); // Set initial filtered products to all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fungsi untuk memfilter produk berdasarkan input pencarian
  const handleFilter = () => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchCustomer.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h1>Product List</h1>
      <input
        type="text"
        placeholder="Search by product title"
        value={searchCustomer}
        onChange={(e) => setSearchCustomer(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>

      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
