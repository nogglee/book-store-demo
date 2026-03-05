const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { addToCart, getCartItems, removeCartItems } = require('../controllers/cart.controller');

router.use(express.json());

router.post('/', requireAuth, addToCart);
router.get('/', requireAuth, getCartItems);
router.delete('/:id', requireAuth, removeCartItems);

module.exports = router;