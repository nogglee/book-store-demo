const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { addLike, removeLike } = require('../controllers/like.controller');

router.use(express.json());

router.post('/:id', requireAuth, addLike);
router.delete('/:id', requireAuth, removeLike);

module.exports = router;