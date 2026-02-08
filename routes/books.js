const express = require("express");
const router = express.Router();
const validate = require('../middleware/validate');
const { body } = require('express-validator');
const { allBooks, bookDetail } = require('../controllers/book.controller');

router.use(express.json());

router.get('/', allBooks)
router.get('/:id', bookDetail)

module.exports = router;