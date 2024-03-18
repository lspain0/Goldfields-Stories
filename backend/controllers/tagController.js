const Tag = require('../models/tagModel');
const mongoose = require('mongoose');

const createTag = async (req, res) => {
  const { content } = req.body;

  try {
    const tag = await Tag.create({ content });
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTag = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No tag found' });
  }

  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ error: 'No tag found' });
    }

    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTag,
  updateTag
};
