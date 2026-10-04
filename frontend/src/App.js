import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import NewOrders from './pages/dashboard/NewOrders';
import AllOrders from './pages/dashboard/AllOrders';
import Completed from './pages/dashboard/Completed';
import Printers from './pages/dashboard/Printers';
import Settings from './pages/dashboard/Settings';
import OrderPage from './pages/customer/OrderPage';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/order/:shopSlug" element={<OrderPage />} />
        <Route path="/order" element={<Navigate to="/order/print-shop" replace />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/new-orders" replace />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route path="new-orders" element={<NewOrders />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="completed" element={<Completed />} />
          <Route path="printers" element={<Printers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard/new-orders" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
