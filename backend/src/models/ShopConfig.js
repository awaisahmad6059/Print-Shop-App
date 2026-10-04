const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
  printer_id: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['B&W', 'Color', 'Both'], default: 'B&W' },
  connectionType: { type: String, enum: ['network', 'usb', 'bluetooth'], default: 'network' },
  address: { type: String },
  is_active: { type: Boolean, default: true },
  is_default: { type: Boolean, default: false },
  status: { type: String, default: 'Setup Required' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const shopConfigSchema = new mongoose.Schema({
  shop_name: { type: String, required: true },
  shop_slug: { type: String, unique: true, lowercase: true, trim: true },
  shop_address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  owner_name: { type: String },
  qr_code_url: { type: String },
  is_open: { type: Boolean, default: true },
  business_hours: { type: String, default: '9:00 AM - 9:00 PM' },
  description: { type: String, default: '' },
  pricing: {
    bw_single_sided: { type: Number, default: 2.5 },
    bw_double_sided: { type: Number, default: 3.5 },
    color_single_sided: { type: Number, default: 8.0 },
    color_double_sided: { type: Number, default: 12.0 },
    discount_for_copies_gt_5: { type: Number, default: 5 },
  },
  printers: [printerSchema],
  settings: {
    file_retention_hours: { type: Number, default: 48 },
    notification_sound: { type: Boolean, default: true },
    auto_accept_orders: { type: Boolean, default: false },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ShopConfig', shopConfigSchema);
