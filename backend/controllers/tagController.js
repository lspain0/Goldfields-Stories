//this file contains functions that interact with the tag set entry on mongodb database

const Tag = require('../models/tagModel');
const mongoose = require('mongoose');

//create tag entry
const createTag = async (req, res) => {
  const { content } = req.body;

  try {
    const tag = await Tag.create({ content });
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update tag entry
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

// Get a single tag set
const getTags = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No tags found' });
  }

  const tags = await Tag.findById(id);

  if (!tags) {
    return res.status(404).json({ error: 'No tags found' });
  }

  res.status(200).json(tags);
};

module.exports = {
  createTag,
  updateTag,
  getTags
};
