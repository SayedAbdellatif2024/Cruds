import React, { useState, useEffect } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tax, setTax] = useState('');
  const [ads, setAds] = useState('');
  const [discount, setDiscount] = useState('');
  const [total, setTotal] = useState('');
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [mood, setMood] = useState('create');
  const [tempIndex, setTempIndex] = useState(null);

  // Get data from local storage when component mounts
  useEffect(() => {
    const storedProducts = localStorage.getItem('product');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Calculate total
  useEffect(() => {
    if (price !== '') {
      const result = (+price + +tax + +ads) - +discount;
      setTotal(result);
    } else {
      setTotal('');
    }
  }, [price, tax, ads, discount]);

  const clearData = () => {
    setTitle('');
    setPrice('');
    setTax('');
    setAds('');
    setDiscount('');
    setTotal('');
    setCount(1);
    setCategory('');
  };

  const handleSubmit = () => {
    const newProduct = {
      title,
      price,
      tax,
      ads,
      discount,
      total,
      count,
      category,
    };

    if (mood === 'create') {
      const newProducts = [...products];
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          newProducts.push(newProduct);
        }
      } else {
        newProducts.push(newProduct);
      }
      setProducts(newProducts);
      localStorage.setItem('product', JSON.stringify(newProducts));
    } else {
      const updatedProducts = [...products];
      updatedProducts[tempIndex] = newProduct;
      setProducts(updatedProducts);
      setMood('create');
      setTempIndex(null);
      localStorage.setItem('product', JSON.stringify(updatedProducts));
    }

    clearData();
  };

  const handleUpdate = (index) => {
    const product = products[index];
    setTitle(product.title);
    setPrice(product.price);
    setTax(product.tax);
    setAds(product.ads);
    setDiscount(product.discount);
    setCategory(product.category);
    setMood('update');
    setTempIndex(index);
  };

  const handleDelete = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    localStorage.setItem('product', JSON.stringify(updatedProducts));
  };

  const deleteAll = () => {
    setProducts([]);
    localStorage.clear();
  };

  return (
    <div className="App">
      <h1>Product Management</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <input value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Tax" />
      <input value={ads} onChange={(e) => setAds(e.target.value)} placeholder="Ads" />
      <input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount" />
      <input value={count} onChange={(e) => setCount(e.target.value)} placeholder="Count" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <button onClick={handleSubmit}>{mood === 'create' ? 'Create' : 'Update'}</button>

      <h2>Total: {total}</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Price</th>
            <th>Tax</th>
            <th>Ads</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.tax}</td>
              <td>{product.ads}</td>
              <td>{product.discount}</td>
              <td>{product.total}</td>
              <td>{product.category}</td>
              <td>
                <button onClick={() => handleUpdate(index)}>Update</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length > 0 && (
        <button onClick={deleteAll}>Delete All ({products.length})</button>
      )}
    </div>
  );
}

export default App;
