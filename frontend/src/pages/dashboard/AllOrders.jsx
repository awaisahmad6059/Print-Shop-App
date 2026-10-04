import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';
import OrderCard from '../../components/OrderCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [shopConfig, setShopConfig] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, configRes] = await Promise.all([
          axios.get(`${API_URL}/api/orders`),
          axios.get(`${API_URL}/api/shop/config`),
        ]);
        setOrders(ordersRes.data);
        setShopConfig(configRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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

  const handleAccept = async (order) => {
    const res = await axios.put(`${API_URL}/api/orders/${order._id}`, {
      status: 'Printing',
      assigned_printer: shopConfig?.printers?.find((p) => p.is_default)?.printer_id || shopConfig?.printers?.[0]?.printer_id || null,
      'timestamps.accepted_at': new Date(),
      'print_job.status': 'Printing',
      'print_job.started_at': new Date(),
    });
    setOrders((p) => p.map((o) => (o._id === order._id ? res.data : o)));
  };

  const handleReject = async (order) => {
    const res = await axios.put(`${API_URL}/api/orders/${order._id}`, { status: 'Rejected' });
    setOrders((p) => p.map((o) => (o._id === order._id ? res.data : o)));
  };

  const handleReadyForPickup = async (order) => {
    const res = await axios.put(`${API_URL}/api/orders/${order._id}`, {
      status: 'Ready for Pickup',
      'print_job.status': 'Printed',
      'print_job.finished_at': new Date(),
    });
    setOrders((p) => p.map((o) => (o._id === order._id ? res.data : o)));
  };

  const handleComplete = async (order) => {
    const res = await axios.put(`${API_URL}/api/orders/${order._id}`, {
      status: 'Completed',
      'timestamps.completed_at': new Date(),
    });
    setOrders((p) => p.map((o) => (o._id === order._id ? res.data : o)));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      <AnimatePresence>
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">No orders</div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} onAccept={handleAccept} onReject={handleReject} onReadyForPickup={handleReadyForPickup} onComplete={handleComplete} />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
