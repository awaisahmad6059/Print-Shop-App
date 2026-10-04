const Order = require('../models/Order');
const ShopConfig = require('../models/ShopConfig');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ 'timestamps.created_at': -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const parsed = JSON.parse(req.body.config || '{}');
    const customer = parsed.customer;
    const shopSlug = parsed.shopSlug;
    // Support both frontend format (colorMode/doubleSided/copies) and legacy print_config
    const pc = parsed.print_config || {};
    const color_mode = pc.color_mode || parsed.colorMode || 'B&W';
    const double_sided = pc.double_sided ?? parsed.doubleSided ?? true;
    const copies = parseInt(pc.number_of_copies ?? parsed.copies ?? 1);
    const paper_size = pc.paper_size || parsed.paperSize || 'A4';
    const page_range = pc.page_range || parsed.pageRange || 'All Pages';
    const file = req.file;

    let shop;
    if (shopSlug) {
      shop = await ShopConfig.findOne({ shop_slug: shopSlug });
    }
    if (!shop) {
      shop = await ShopConfig.findOne().sort({ created_at: -1 });
    }
    const pricingConfig = shop?.pricing || {
      bw_single_sided: 2.5,
      bw_double_sided: 3.5,
      color_single_sided: 8.0,
      color_double_sided: 12.0,
      discount_for_copies_gt_5: 5,
    };

    const colorMode = color_mode;
    const doubleSided = double_sided;

    let unitPrice = 0;
    if (colorMode === 'B&W') {
      unitPrice = doubleSided ? pricingConfig.bw_double_sided : pricingConfig.bw_single_sided;
    } else {
      unitPrice = doubleSided ? pricingConfig.color_double_sided : pricingConfig.color_single_sided;
    }

    const pagesToPrint = copies * (file?.page_count || 1);
    let discountPercent = 0;
    if (copies > 5) discountPercent = pricingConfig.discount_for_copies_gt_5;
    const subtotal = unitPrice * pagesToPrint;
    const discountAmount = (subtotal * discountPercent) / 100;
    const totalAmount = (subtotal - discountAmount).toFixed(2);

    const lastOrder = await Order.findOne().sort({ order_number: -1 });
    const orderNumber = lastOrder ? lastOrder.order_number + 1 : 1;

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    const order = new Order({
      order_number: orderNumber,
      customer: customer || {},
      file: {
        file_name: file?.originalname || 'document',
        file_url: req.fileUrl || (file ? `/api/files/download/${file.filename}` : ''),
        page_count: file?.page_count || 1,
        file_size: file?.size || 0,
        upload_time: new Date(),
        expiry_date: expiryDate,
      },
      print_config: {
        color_mode: colorMode,
        double_sided: doubleSided,
        number_of_copies: copies,
        paper_size,
        page_range,
      },
      shop_slug: shop?.shop_slug || shopSlug || null,
      pricing: {
        unit_price: unitPrice,
        pages_to_print: pagesToPrint,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        total_amount: parseFloat(totalAmount),
        currency: 'PKR',
      },
      status: 'Submitted',
      estimated_time: 5,
      timestamps: {
        created_at: new Date(),
        accepted_at: null,
        completed_at: null,
      },
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('order_arrived', order);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const io = req.app.get('io');
    if (io) io.emit('order_updated', order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
