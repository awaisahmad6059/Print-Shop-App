const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createOrder, getOrders, getOrder, updateOrder } = require('../controllers/orderController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = require('path');
    const dir = path.join(__dirname, '../../uploads');
    const fs = require('fs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);

module.exports = router;
