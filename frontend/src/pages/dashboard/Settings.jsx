import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Settings() {
  const [shopConfig, setShopConfig] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/shop/config`).then((res) => setShopConfig(res.data));
  }, []);

  const shopSlug = shopConfig?.shop_slug || 'print-shop';
  const baseUrl = process.env.REACT_APP_PUBLIC_URL || window.location.origin;
  const qrUrl = `${baseUrl}/order/${shopSlug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    alert('Customer URL copied to clipboard');
  };

  const shareUrl = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: shopConfig?.shop_name, url: qrUrl }); } catch (e) {}
    } else copyUrl();
  };

  const printQr = () => {
    const w = window.open('', '_blank');
    w.document.write(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrUrl)}" style="width:400px;height:400px"/><p style="font-family:sans-serif">${shopConfig?.shop_name}<br/>${qrUrl}</p>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const saveShopInfo = async (field, value) => {
    try {
      const res = await axios.post(`${API_URL}/api/shop/config`, { [field]: value });
      setShopConfig(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const savePrice = async (key, value) => {
    try {
      const res = await axios.post(`${API_URL}/api/shop/config`, { pricing: { ...shopConfig?.pricing, [key]: parseFloat(value) } });
      setShopConfig(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shop Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Shop Name</label>
              <input key={`name-${shopConfig?.shop_name}`} defaultValue={shopConfig?.shop_name || ''} onBlur={(e) => saveShopInfo('shop_name', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Shop Address</label>
              <input key={`addr-${shopConfig?.shop_address}`} defaultValue={shopConfig?.shop_address || ''} onBlur={(e) => saveShopInfo('shop_address', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input key={`phone-${shopConfig?.phone}`} defaultValue={shopConfig?.phone || ''} onBlur={(e) => saveShopInfo('phone', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Customer Ordering & QR Code</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Shop Slug</label>
              <input value={shopSlug} readOnly className="w-full px-3 py-2 border rounded bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Customer Ordering URL</label>
              <input value={qrUrl} readOnly className="w-full px-3 py-2 border rounded bg-gray-50" />
            </div>
            <div className="mt-4 text-center">
              <div className="inline-block p-4 bg-white border rounded">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="mt-3 flex gap-2 justify-center flex-wrap">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&data=${encodeURIComponent(qrUrl)}`}
                  download="printshop-qr.png"
                  className="px-4 py-2 bg-cyan-600 text-white rounded"
                >
                  Download QR
                </a>
                <button
                  onClick={copyUrl}
                  className="px-4 py-2 border rounded"
                >
                  Copy URL
                </button>
                <button
                  onClick={printQr}
                  className="px-4 py-2 border rounded"
                >
                  Print QR
                </button>
                <button
                  onClick={shareUrl}
                  className="px-4 py-2 border rounded"
                >
                  Share
                </button>
                <button
                  onClick={() => window.open(qrUrl, '_blank')}
                  className="px-4 py-2 border rounded"
                >
                  Open Customer Page
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Printing Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">B&W Single-Sided</label>
              <input key={`bwss-${shopConfig?.pricing?.bw_single_sided}`} type="number" defaultValue={shopConfig?.pricing?.bw_single_sided || 2.5} onBlur={(e) => savePrice('bw_single_sided', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">B&W Double-Sided</label>
              <input key={`bwds-${shopConfig?.pricing?.bw_double_sided}`} type="number" defaultValue={shopConfig?.pricing?.bw_double_sided || 3.5} onBlur={(e) => savePrice('bw_double_sided', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Color Single-Sided</label>
              <input key={`css-${shopConfig?.pricing?.color_single_sided}`} type="number" defaultValue={shopConfig?.pricing?.color_single_sided || 8.0} onBlur={(e) => savePrice('color_single_sided', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Color Double-Sided</label>
              <input key={`cds-${shopConfig?.pricing?.color_double_sided}`} type="number" defaultValue={shopConfig?.pricing?.color_double_sided || 12.0} onBlur={(e) => savePrice('color_double_sided', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
