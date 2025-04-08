import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const supplierId = localStorage.getItem('supplierId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7065/api/orders/GroceryOwner?supplierId=${supplierId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (data && data.$values && Array.isArray(data.$values)) {
            setOrders(data.$values);
          } else {
            console.error('The response format is incorrect. Expected an array under $values');
          }
        } else {
          alert('Failed to fetch orders');
        }
      } catch (error) {
        alert('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supplierId]);

  const handleApprove = async (orderId) => {
    if (!orderId) {
      console.error("No order ID provided for approval.");
      alert("No order ID provided.");
      return;
    }

    try {
      console.log(`Approving order with ID: ${orderId}`);
      const response = await fetch(`https://localhost:7065/api/orders/${orderId}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 1 } : order
          )
        );
      } else {
        alert('Failed to approve order');
      }
    } catch (error) {
      alert('Error approving order');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>Stock</span>
        <span style={{ fontWeight: 'light', color: '#777' }}>Sync</span>
      </h2>
      <h3 style={{ marginBottom: '20px', color: '#555' }}>Orders</h3>
      {loading ? (
        <p style={{ fontSize: '16px', color: '#777' }}>Loading orders...</p>
      ) : (
        <div style={styles.ordersContainer}>
          <div style={styles.statusColumn}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>New</h4>
            {orders.filter(order => order.status === 0).map(order => (
              <div key={order.id} style={styles.orderItem}>
                <p style={{ fontWeight: 'bold', color: '#444' }}>Product: {order.productName}</p>
                <p style={{ color: '#666' }}>Quantity: {order.quantity}</p>
                <button
                  style={styles.approveButton}
                  onClick={() => handleApprove(order.id)}
                >
                  Approve Order
                </button>
              </div>
            ))}
          </div>

          <div style={styles.statusColumn}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>In Process</h4>
            {orders.filter(order => order.status === 1).map(order => (
              <div key={order.id} style={styles.orderItem}>
                <p style={{ fontWeight: 'bold', color: '#444' }}>Product: {order.productName}</p>
                <p style={{ color: '#666' }}>Quantity: {order.quantity}</p>
                <div style={styles.statusBadge}>In Process</div>
              </div>
            ))}
          </div>

          <div style={styles.statusColumn}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>Completed</h4>
            {orders.filter(order => order.status === 2).map(order => (
              <div key={order.id} style={styles.orderItem}>
                <p style={{ fontWeight: 'bold', color: '#444' }}>Product: {order.productName}</p>
                <p style={{ color: '#666' }}>Quantity: {order.quantity}</p>
                <div style={styles.completedBadge}>Completed</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f2f5 0%, #e1e6eb 100%)',
    padding: '30px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  ordersContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: '1200px',
  },
  statusColumn: {
    width: '30%',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eee',
  },
  approveButton: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#1e7e34',
    },
    width: '100%',
    boxSizing: 'border-box',
  },
  statusBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    marginTop: '10px',
    display: 'inline-block',
  },
  completedBadge: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    marginTop: '10px',
    display: 'inline-block',
  },
};

export default OrdersPage;