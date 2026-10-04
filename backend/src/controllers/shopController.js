const ShopConfig = require('../models/ShopConfig');
const net = require('net');

const slugify = (name) =>
  (name || 'print-shop')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'print-shop';

const ensureSlug = async (config) => {
  if (!config.shop_slug) {
    let slug = slugify(config.shop_name);
    let exists = await ShopConfig.findOne({ shop_slug: slug, _id: { $ne: config._id } });
    let i = 2;
    while (exists) {
      slug = `${slugify(config.shop_name)}-${i}`;
      exists = await ShopConfig.findOne({ shop_slug: slug, _id: { $ne: config._id } });
      i++;
    }
    config.shop_slug = slug;
    await config.save();
  }
  return config;
};

exports.getConfig = async (req, res) => {
  try {
    let config;
    if (req.query.slug) {
      config = await ShopConfig.findOne({ shop_slug: req.query.slug });
      if (!config) return res.status(404).json({ message: 'Shop not found' });
    } else {
      config = await ShopConfig.findOne().sort({ created_at: -1 });
    }
    if (!config) {
      config = new ShopConfig({
        shop_name: "Ali's Print Shop",
        shop_address: 'Main Road, Lahore',
        phone: '+92 300 123 4567',
        email: 'ali@printshop.com',
        owner_name: 'Ali Ahmed',
        qr_code_url: 'https://printshop.app/order',
        printers: [],
      });
      await config.save();
    }
    await ensureSlug(config);
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConfigBySlug = async (req, res) => {
  try {
    const config = await ShopConfig.findOne({ shop_slug: req.params.slug });
    if (!config) return res.status(404).json({ message: 'Shop not found' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    if (req.body.shop_name) {
      req.body.shop_slug = slugify(req.body.shop_name);
    }
    req.body.updated_at = new Date();
    const config = await ShopConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    await ensureSlug(config);
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.testPrinterConnection = async (req, res) => {
  try {
    const { address, connectionType, printer_id } = req.body;
    if (connectionType === 'network' && address) {
      const ok = await new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(4000);
        socket.once('connect', () => { socket.destroy(); resolve(true); });
        socket.once('timeout', () => { socket.destroy(); resolve(false); });
        socket.once('error', () => resolve(false));
        socket.connect(9100, address);
      });
      return res.json({ success: ok, message: ok ? 'Printer reachable' : 'Printer not reachable on port 9100' });
    }
    if (connectionType === 'usb') {
      return res.json({ success: false, message: 'USB printers require a local print bridge. Install the print bridge on the shop computer.' });
    }
    if (connectionType === 'bluetooth') {
      return res.json({ success: false, message: 'Direct Bluetooth printing is not supported by the browser. Use a local print bridge.' });
    }
    res.json({ success: false, message: 'Unsupported connection type' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
