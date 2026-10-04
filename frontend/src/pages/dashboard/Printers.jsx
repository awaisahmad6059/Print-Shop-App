import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Printers() {
  const [shopConfig, setShopConfig] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrinter, setNewPrinter] = useState({
    printer_id: `printer_${Date.now()}`,
    model: '',
    type: 'B&W',
    connectionType: 'network',
    address: '',
    status: 'Setup Required',
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/shop/config`).then((res) => setShopConfig(res.data));
  }, []);

  const addPrinter = async () => {
    const updated = {
      ...shopConfig,
      printers: [...(shopConfig.printers || []), newPrinter],
    };
    const res = await axios.post(`${API_URL}/api/shop/config`, updated);
    setShopConfig(res.data);
    setShowAddForm(false);
    setNewPrinter({
      printer_id: `printer_${Date.now()}`,
      model: '',
      type: 'B&W',
      connectionType: 'network',
      address: '',
      status: 'Setup Required',
    });
  };

  const testConnection = async (printer) => {
    try {
      const res = await axios.post(`${API_URL}/api/shop/printer/test`, {
        address: printer.address,
        connectionType: printer.connectionType,
      });
      const updatedPrinters = shopConfig.printers.map((p) =>
        p.printer_id === printer.printer_id
          ? { ...p, status: res.data.success ? 'Connected' : 'Disconnected' }
          : p
      );
      const saveRes = await axios.post(`${API_URL}/api/shop/config`, { printers: updatedPrinters });
      setShopConfig(saveRes.data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Connection test failed');
    }
  };

  const removePrinter = async (printerId) => {
    const updatedPrinters = (shopConfig.printers || []).filter((p) => p.printer_id !== printerId);
    const res = await axios.post(`${API_URL}/api/shop/config`, { printers: updatedPrinters });
    setShopConfig(res.data);
  };

  const setDefault = async (printerId) => {
    const updatedPrinters = (shopConfig.printers || []).map((p) => ({ ...p, is_default: p.printer_id === printerId }));
    const res = await axios.post(`${API_URL}/api/shop/config`, { printers: updatedPrinters });
    setShopConfig(res.data);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Printers</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Printer
        </button>
      </div>

      <div className="space-y-4">
        {shopConfig?.printers?.length === 0 && !showAddForm ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">
            No printers configured. Connect your own printer.
          </div>
        ) : (
          shopConfig?.printers?.map((printer) => (
            <motion.div
              key={printer.printer_id}
              className="bg-white p-6 rounded-xl shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{printer.model}</h3>
                  <p className="text-gray-600">{printer.connectionType || 'network'} - {printer.address || 'N/A'}</p>
                  <p className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      printer.status === 'Connected' ? 'bg-green-100 text-green-700' : printer.status === 'Disconnected' || printer.status === 'Error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {printer.status || 'Setup Required'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => testConnection(printer)}
                    className="border border-gray-300 px-3 py-1 rounded"
                  >
                    Test Connection
                  </button>
                  <button
                    onClick={() => setDefault(printer.printer_id)}
                    className={`border px-3 py-1 rounded ${printer.is_default ? 'bg-cyan-100 text-cyan-700' : 'border-gray-300'}`}
                  >
                    {printer.is_default ? 'Default' : 'Set Default'}
                  </button>
                  <button
                    onClick={() => removePrinter(printer.printer_id)}
                    className="border border-red-300 text-red-600 px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {showAddForm && (
          <motion.div className="bg-white p-6 rounded-xl shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-semibold mb-4">Add New Printer</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Printer Name/Model"
                value={newPrinter.model}
                onChange={(e) => setNewPrinter({ ...newPrinter, model: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                value={newPrinter.type}
                onChange={(e) => setNewPrinter({ ...newPrinter, type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="B&W">Black & White</option>
                <option value="Color">Color</option>
                <option value="Both">Both</option>
              </select>
              <select
                value={newPrinter.connectionType}
                onChange={(e) => setNewPrinter({ ...newPrinter, connectionType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="network">Wi-Fi / Network</option>
                <option value="usb">USB</option>
                <option value="bluetooth">Bluetooth</option>
              </select>
              <input
                type="text"
                placeholder="IP Address / Device Name"
                value={newPrinter.address}
                onChange={(e) => setNewPrinter({ ...newPrinter, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <button onClick={addPrinter} className="bg-cyan-600 text-white px-4 py-2 rounded-lg">Save Printer</button>
                <button onClick={() => setShowAddForm(false)} className="border px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
