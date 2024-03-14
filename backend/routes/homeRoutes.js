const express = require('express');
const router = express.Router();
const HomeImage = require('../models/homeModel'); // Update the path as necessary

// Route to get all images
router.get('/', async (req, res) => {
  try {
    const images = await HomeImage.find().select('_id imageUrl'); // This line is modified
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new image entry
router.post('/', async (req, res) => {
  const image = new HomeImage({
    imageUrl: req.body.imageUrl
  });
  try {
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete an image
router.delete('/:id', async (req, res) => {
  try {
    await HomeImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted Image' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
