import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiActivity, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    axios.get(`${API_URL}/api/orders`).then((res) => setOrders(res.data));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('order_arrived', (n) => setOrders((p) => [n, ...p]));
    socket.on('order_updated', (u) => setOrders((p) => p.map((o) => (o._id === u._id ? u : o))));
    return () => {
      socket.off('order_arrived');
      socket.off('order_updated');
    };
  }, [socket]);

  const stats = {
    total: orders.length,
    submitted: orders.filter((o) => o.status === 'Submitted').length,
    accepted: orders.filter((o) => o.status === 'Accepted').length,
    completed: orders.filter((o) => o.status === 'Completed').length,
    revenue: orders.filter((o) => o.status === 'Completed').reduce((s, o) => s + (o.pricing?.total_amount || 0), 0),
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div className="bg-white p-4 rounded-xl shadow-sm" whileHover={{ y: -2 }}>
          <div className="flex items-center gap-3">
            <FiFileText className="text-cyan-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-xl shadow-sm" whileHover={{ y: -2 }}>
          <div className="flex items-center gap-3">
            <FiActivity className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold">{stats.submitted + stats.accepted}</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-xl shadow-sm" whileHover={{ y: -2 }}>
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-xl shadow-sm" whileHover={{ y: -2 }}>
          <div className="flex items-center gap-3">
            <FiDollarSign className="text-orange-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold">Rs. {stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">Welcome to PrintHub</h3>
        <p className="text-gray-600 text-sm">Manage your print orders, printers and settings from this dashboard.</p>
      </div>
    </div>
  );
}
