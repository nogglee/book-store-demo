const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addLike, removeLike } = require('../controllers/like.controller');

router.use(express.json());

router.post('/:id', auth, addLike);
router.delete('/:id', auth, removeLike);

module.exports = router;