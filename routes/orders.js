const express = require('express')
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { order, getOrders, getOrderDetail } = require('../controllers/order.controller');

router.use(express.json());

router.post('/', requireAuth, order);
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderDetail);

module.exports = router;