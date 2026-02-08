const express = require('express');
const router = express.Router();
const { allCategory } = require('../controllers/category.controller');

router.use(express.json());

router.get('/', allCategory);

module.exports = router;