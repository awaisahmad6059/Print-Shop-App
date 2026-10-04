import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import OrderCard from '../../components/OrderCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Completed() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/orders`).then((res) => setOrders(res.data));
  }, []);

  const completed = orders.filter((o) => o.status === 'Completed');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Completed Orders</h2>
      <AnimatePresence>
        {completed.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">No completed orders</div>
        ) : (
          completed.map((order) => <OrderCard key={order._id} order={order} showActions={false} />)
        )}
      </AnimatePresence>
    </div>
  );
}
