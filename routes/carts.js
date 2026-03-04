const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToCart, getCartItems, removeCartItems } = require('../controllers/cart.controller');

router.use(express.json());

router.post('/', auth, addToCart);
router.get('/', auth, getCartItems);
router.delete('/:id', auth, removeCartItems);

module.exports = router;