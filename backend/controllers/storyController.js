const Story = require('../models/storyModel');
const mongoose = require('mongoose');

// Middleware for logging requests
const logRequest = (req, res, next) => {
  console.log(req.path, req.method);
  next();
};

// Middleware for global error handling
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Validation middleware example (you can replace this with a library like Joi)
const validateCreateStory = (req, res, next) => {
  const { title, tags, content } = req.body;

  if (!title || !tags || !content) {
    return res.status(400).json({ error: 'Title, tags, and content are required' });
  }

  next();
};

// Get all stories
const getStories = async (req, res) => {
  const stories = await Story.find({}).sort({ createdAt: -1 });
  res.status(200).json(stories);
};

// Get a single story
const getStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  const story = await Story.findById(id);

  if (!story) {
    return res.status(404).json({ error: 'No story found' });
  }

  res.status(200).json(story);
};

// Create a new story
const createStory = async (req, res) => {
  const { title, tags, content } = req.body;

  try {
    const story = await Story.create({ title, tags, content });
    res.status(200).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a story
const deleteStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  const story = await Story.findOneAndDelete({ _id: id });

  if (!story) {
    return res.status(404).json({ error: 'No story found' });
  }

  res.status(200).json(story);
};

// Update a story
const updateStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  const story = await Story.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!story) {
    return res.status(404).json({ error: 'No story found' });
  }

  res.status(200).json(story);
};

module.exports = {
  logRequest,
  errorHandler,
  validateCreateStory,
  getStories,
  getStory,
  createStory,
  deleteStory,
  updateStory,
};
