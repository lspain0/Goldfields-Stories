const express = require('express');
const { createTag, updateTag, getTags } = require('../controllers/tagController');

const router = express.Router();

router.post('/', createTag);
router.put('/:id', updateTag);
router.get('/:id', getTags)

module.exports = router;
