import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import useSocket from '../../hooks/useSocket';
import FileUploadArea from '../../components/FileUploadArea';
import PriceDisplay from '../../components/PriceDisplay';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function OrderPage() {
  const { shopSlug } = useParams();
  const [shopConfig, setShopConfig] = useState(null);
  const [file, setFile] = useState(null);
  const [colorMode, setColorMode] = useState('B&W');
  const [doubleSided, setDoubleSided] = useState(true);
  const [copies, setCopies] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    axios.get(`${API_URL}/api/shop/config/${shopSlug}`).then((res) => {
      setShopConfig(res.data);
    }).catch(() => {
      axios.get(`${API_URL}/api/shop/config?slug=${shopSlug}`).then((res) => setShopConfig(res.data)).catch(() => {});
    });
  }, [shopSlug]);

  useEffect(() => {
    if (!socket) return;
    socket.on('order_updated', (updated) => {
      if (order && updated._id === order._id) {
        setOrder(updated);
      }
    });
    return () => socket.off('order_updated');
  }, [socket, order]);

  const calculatePrice = () => {
    const pricing = shopConfig?.pricing || {
      bw_single_sided: 2.5,
      bw_double_sided: 3.5,
      color_single_sided: 8.0,
      color_double_sided: 12.0,
      discount_for_copies_gt_5: 5,
    };
    let unitPrice = colorMode === 'B&W' ? (doubleSided ? pricing.bw_double_sided : pricing.bw_single_sided) : (doubleSided ? pricing.color_double_sided : pricing.color_single_sided);
    const pages = 1;
    const pagesToPrint = copies * pages;
    let discount = 0;
    if (copies > 5) discount = pricing.discount_for_copies_gt_5;
    const subtotal = unitPrice * pagesToPrint;
    return subtotal - (subtotal * discount) / 100;
  };

  const handleSubmit = async () => {
    if (!file) return alert('Please upload a file');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('config', JSON.stringify({
        colorMode,
        doubleSided,
        copies,
        customer: { name: customerName, phone: customerPhone },
        shopSlug,
      }));
      const res = await axios.post(`${API_URL}/api/orders`, formData);
      setOrder(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Submitted</h2>
          <p className="text-gray-600 mb-4">
            Your print order has been sent to {shopConfig?.shop_name}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold">#{order?.order_number}</p>
            <p className="text-sm text-gray-600 mt-2">Status</p>
            <p className="text-lg font-semibold text-blue-600">{order?.status === 'Submitted' ? 'Waiting for Shop Confirmation' : order?.status}</p>
            <p className="text-sm text-gray-600 mt-2">Estimated Amount</p>
            <p className="text-xl font-bold text-orange-500">Rs. {order?.pricing?.total_amount?.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-500">We will update you when your order is ready for pickup.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{shopConfig?.shop_name || 'Print Shop'}</h1>
          <p className="text-gray-600">Online Print Ordering</p>
          <p className="text-sm text-gray-500 mt-2">Upload your document and configure your print order</p>
        </div>

        <div className="space-y-6">
          <motion.div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Step 1 - Upload Document</h2>
            <FileUploadArea onFileSelect={setFile} file={file} />
          </motion.div>

          <motion.div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Step 2 - Print Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Print Color</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" value="B&W" checked={colorMode === 'B&W'} onChange={(e) => setColorMode(e.target.value)} className="mr-2" />
                    Black & White
                  </label>
                  <label className="flex items-center">
                    <input type="radio" value="Color" checked={colorMode === 'Color'} onChange={(e) => setColorMode(e.target.value)} className="mr-2" />
                    Color
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Print Sides</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" checked={!doubleSided} onChange={() => setDoubleSided(false)} className="mr-2" />
                    Single-sided
                  </label>
                  <label className="flex items-center">
                    <input type="radio" checked={doubleSided} onChange={() => setDoubleSided(true)} className="mr-2" />
                    Double-sided
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Copies</label>
                <input type="number" min="1" value={copies} onChange={(e) => setCopies(parseInt(e.target.value) || 1)} className="w-32 px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Page Range</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>All Pages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Paper Size</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>A4</option>
                  <option>A3</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Details</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Name (Optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="Phone (Optional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
            <h2 className="text-lg font-semibold mb-4">Step 3 - Price Calculation</h2>
            <PriceDisplay amount={calculatePrice()} currency="Rs." />
          </motion.div>

          <motion.div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Step 4 - Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Shop</span><span>{shopConfig?.shop_name}</span></div>
              <div className="flex justify-between"><span>File</span><span>{file?.name || '-'}</span></div>
              <div className="flex justify-between"><span>Color</span><span>{colorMode}</span></div>
              <div className="flex justify-between"><span>Sides</span><span>{doubleSided ? 'Double-sided' : 'Single-sided'}</span></div>
              <div className="flex justify-between"><span>Copies</span><span>{copies}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-orange-500">Rs. {calculatePrice().toFixed(2)}</span></div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="w-full mt-6 bg-cyan-600 text-white py-4 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Print Order'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
