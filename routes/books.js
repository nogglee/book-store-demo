const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { allBooks, bookDetail } = require('../controllers/book.controller');

router.use(express.json());

router.get('/', allBooks)
router.get('/:id', auth, bookDetail)

module.exports = router;