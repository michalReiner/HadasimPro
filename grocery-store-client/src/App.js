// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import SupplierOrders from './pages/SupplierOrders';
// import CreateOrder from './pages/CreateOrder';
// import Navbar from './components/Navbar'; // ייבוא הניווט החדש

// function App() {
//   return (
//     <Router>
//       <Navbar /> {/* הוספת הניווט למעלה */}
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/orders" element={<SupplierOrders />} />
//         <Route path="/create-order" element={<CreateOrder />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import OrdersPage from './pages/OrderPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
