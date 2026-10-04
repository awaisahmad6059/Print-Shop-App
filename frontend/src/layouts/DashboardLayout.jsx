import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInbox, FiShoppingBag, FiCheckCircle, FiPrinter, FiSettings } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DashboardLayout = () => {
  const [shopConfig, setShopConfig] = useState(null);
  
  useEffect(() => {
    axios.get(`${API_URL}/api/shop/config`).then((res) => setShopConfig(res.data)).catch(() => {});
  }, []);

  const navItems = [
    { to: '/dashboard/new-orders', label: 'New Orders', icon: <FiInbox /> },
    { to: '/dashboard/orders', label: 'All Orders', icon: <FiShoppingBag /> },
    { to: '/dashboard/completed', label: 'Completed', icon: <FiCheckCircle /> },
    { to: '/dashboard/printers', label: 'Printers', icon: <FiPrinter /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{shopConfig?.shop_name || "Ali's Print Shop"}</h1>
          <p className="text-sm text-gray-600">Shop Owner Dashboard</p>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive ? 'bg-cyan-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
