const express = require('express');
const router = express.Router();
const { getConfig, getConfigBySlug, updateConfig, testPrinterConnection } = require('../controllers/shopController');

router.get('/config', getConfig);
router.get('/config/:slug', getConfigBySlug);
router.post('/config', updateConfig);
router.post('/printer/test', testPrinterConnection);

module.exports = router;
