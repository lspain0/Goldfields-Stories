const Class = require('../models/classModel'); // Make sure to use the correct path to your class model

// Get all classes
const getClasses = async (req, res) => {
  const classes = await Class.find({}).sort({ createdAt: -1 });
  res.status(200).json(classes);
};

// Get a single class
const getClass = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No class found' });
  }

  const singleClass = await Class.findById(id);

  if (!singleClass) {
    return res.status(404).json({ error: 'No class found' });
  }

  res.status(200).json(singleClass);
};

// Create a new class
const createClass = async (req, res) => {
  const { className, subject } = req.body;

  try {
    const newClass = await Class.create({ className, subject });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No class found' });
  }

  const deletedClass = await Class.findOneAndDelete({ _id: id });

  if (!deletedClass) {
    return res.status(404).json({ error: 'No class found' });
  }

  res.status(200).json(deletedClass);
};

// Update a class
const updateClass = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No class found' });
  }

  const updatedClass = await Class.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!updatedClass) {
    return res.status(404).json({ error: 'No class found' });
  }

  res.status(200).json(updatedClass);
};

module.exports = {
  getClasses,
  getClass,
  createClass,
  deleteClass,
  updateClass,
};
