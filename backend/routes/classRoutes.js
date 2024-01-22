const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Changed to memoryStorage
const {
  getClasses,
  getClass,
  createClass,
  deleteClass,
  updateClass,
  addStudent,
} = require('../controllers/classController');

// Routes for the Class model
router.get('/', getClasses); // Get all classes
router.get('/:id', getClass); // Get a single class by ID
router.post('/', createClass); // Create a new class
router.delete('/:id', deleteClass); // Delete a class by ID
router.patch('/:id', updateClass); // Update a class by ID
router.post('/:id/students', upload.single('image'), addStudent); // Add a student to a class by ID, handling image upload

module.exports = router;
