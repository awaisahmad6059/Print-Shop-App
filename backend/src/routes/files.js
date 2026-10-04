const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    file_name: req.file.originalname,
    file_url: `/api/files/download/${req.file.filename}`,
    file_size: req.file.size,
  });
});

// Secure download: only allow access if the file belongs to an order
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const order = await Order.findOne({ 'file.file_url': { $regex: filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') } });
    if (!order) return res.status(403).json({ message: 'Access denied' });
    const filePath = path.join(__dirname, '../../uploads', filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.download(filePath, order.file.file_name);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Purge expired files
const purgeExpiredFiles = async (retentionHours = 48) => {
  try {
    const cutoff = new Date(Date.now() - retentionHours * 3600 * 1000);
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.mtime < cutoff) {
        try { fs.unlinkSync(full); } catch (e) {}
      }
    }
  } catch (err) {
    console.error('Purge error:', err.message);
  }
};

setInterval(() => purgeExpiredFiles(48), 3600 * 1000);

module.exports = router;
module.exports.purgeExpiredFiles = purgeExpiredFiles;
