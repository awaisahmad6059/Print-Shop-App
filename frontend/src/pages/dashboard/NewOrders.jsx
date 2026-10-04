import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';
import OrderCard from '../../components/OrderCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function NewOrders() {
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
    socket.on('order_arrived', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });
    socket.on('order_updated', (updated) => {
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    });
    return () => {
      socket.off('order_arrived');
      socket.off('order_updated');
    };
  }, [socket]);

  const handleAccept = async (order) => {
    try {
      const res = await axios.put(`${API_URL}/api/orders/${order._id}`, {
        status: 'Printing',
        assigned_printer: shopConfig?.printers?.find((p) => p.is_default)?.printer_id || shopConfig?.printers?.[0]?.printer_id || null,
        'timestamps.accepted_at': new Date(),
        'print_job.status': 'Printing',
        'print_job.started_at': new Date(),
      });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? res.data : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (order) => {
    try {
      const res = await axios.put(`${API_URL}/api/orders/${order._id}`, { status: 'Rejected' });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? res.data : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadyForPickup = async (order) => {
    try {
      const res = await axios.put(`${API_URL}/api/orders/${order._id}`, {
        status: 'Ready for Pickup',
        'print_job.status': 'Printed',
        'print_job.finished_at': new Date(),
      });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? res.data : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (order) => {
    try {
      const res = await axios.put(`${API_URL}/api/orders/${order._id}`, {
        status: 'Completed',
        'timestamps.completed_at': new Date(),
      });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? res.data : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const newOrders = orders.filter((o) => o.status === 'Submitted');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">New Orders</h2>
      <AnimatePresence>
        {newOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">No new orders</div>
        ) : (
          newOrders.map((order) => (
            <OrderCard key={order._id} order={order} onAccept={handleAccept} onReject={handleReject} onReadyForPickup={handleReadyForPickup} onComplete={handleComplete} />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
