const express = require('express');
const { createTag, updateTag } = require('../controllers/tagController');

const router = express.Router();

router.post('/', createTag);
router.put('/:id', updateTag);

module.exports = router;
