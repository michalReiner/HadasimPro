import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [products, setProducts] = useState([{ name: '', pricePerUnit: '', minQuantity: '' }]);
  const navigate = useNavigate();

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', pricePerUnit: '', minQuantity: '' }]);
  };

  const handleRegister = async () => {
    const dto = {
      companyName,
      phoneNumber,
      representativeName,
      products: products.map(p => ({
        name: p.name,
        pricePerUnit: parseFloat(p.pricePerUnit),
        minQuantity: parseInt(p.minQuantity)
      }))
    };

    try {
      const response = await fetch('https://localhost:7065/api/suppliers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const err = await response.text();
        alert(`Registration failed: ${err}`);
      }
    } catch (error) {
      alert('Error during registration');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>Stock</span>
          <span style={{ fontWeight: 'light', color: '#777' }}>Sync</span>
        </h2>
        <h3 style={{ marginBottom: '25px', color: '#555' }}>Register as Supplier</h3>
        <input
          placeholder="Company Name"
          style={styles.input}
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />
        <input
          placeholder="Phone Number"
          style={styles.input}
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
        <input
          placeholder="Representative Name"
          style={styles.input}
          value={representativeName}
          onChange={e => setRepresentativeName(e.target.value)}
        />

        <h4 style={{ marginTop: '20px', color: '#555' }}>Products:</h4>
        {products.map((product, index) => (
          <div key={index} style={styles.productInputGroup}>
            <input
              style={styles.input}
              placeholder="Name"
              value={product.name}
              onChange={(e) => handleProductChange(index, 'name', e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Price Per Unit"
              type="number"
              value={product.pricePerUnit}
              onChange={(e) => handleProductChange(index, 'pricePerUnit', e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Min Quantity"
              type="number"
              value={product.minQuantity}
              onChange={(e) => handleProductChange(index, 'minQuantity', e.target.value)}
            />
          </div>
        ))}
        <button style={styles.addProductButton} onClick={addProduct}>
          Add Product
        </button>
        <button style={styles.registerButton} onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f2f5 0%, #e1e6eb 100%)',
    padding: '30px',
    boxSizing: 'border-box',
  },
  box: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    width: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  productInputGroup: {
    marginBottom: '15px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  },
  addProductButton: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  registerButton: {
    width: '100%',
    padding: '14px',
    marginTop: '15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#1e7e34',
    },
  },
};

export default RegisterPage;
