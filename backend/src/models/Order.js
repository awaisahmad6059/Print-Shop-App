const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: { type: Number, required: true },
  order_date: { type: Date, default: Date.now },
  customer: {
    phone: { type: String },
    name: { type: String },
  },
  file: {
    file_name: { type: String, required: true },
    file_url: { type: String },
    page_count: { type: Number, default: 0 },
    file_size: { type: Number, default: 0 },
    upload_time: { type: Date, default: Date.now },
    expiry_date: { type: Date },
  },
  print_config: {
    color_mode: { type: String, enum: ['B&W', 'Color'], default: 'B&W' },
    double_sided: { type: Boolean, default: true },
    number_of_copies: { type: Number, default: 1 },
    paper_size: { type: String, default: 'A4' },
    page_range: { type: String, default: 'All Pages' },
  },
  pricing: {
    unit_price: { type: Number },
    pages_to_print: { type: Number },
    discount_percent: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },
    currency: { type: String, default: 'PKR' },
  },
  payment: {
    method: { type: String, default: 'Cash' },
    status: { type: String, default: 'Pending' },
  },
  status: { type: String, enum: ['Submitted', 'Accepted', 'Printing', 'Ready for Pickup', 'Completed', 'Rejected', 'Cancelled', 'Print Failed'], default: 'Submitted' },
  shop_slug: { type: String },
  print_job: {
    printer_id: { type: String },
    status: { type: String, default: 'Queued' },
    error: { type: String },
    started_at: { type: Date },
    finished_at: { type: Date },
  },
  assigned_printer: { type: String },
  estimated_time: { type: Number, default: 5 },
  timestamps: {
    created_at: { type: Date, default: Date.now },
    accepted_at: { type: Date },
    completed_at: { type: Date },
  },
});

module.exports = mongoose.model('Order', orderSchema);
