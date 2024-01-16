const express = require('express');
const router = express.Router();
const {
  getClasses,
  getClass,
  createClass,
  deleteClass,
  updateClass,
} = require('../controllers/classController'); // Adjust the path to where your classController is located

// Routes for the Class model
router.get('/', getClasses); // Get all classes
router.get('/:id', getClass); // Get a single class by ID
router.post('/', createClass); // Create a new class
router.delete('/:id', deleteClass); // Delete a class by ID
router.patch('/:id', updateClass); // Update a class by ID

module.exports = router;
