const express = require('express');
const router = express.Router();

// Import the class controller methods
const {
  getClasses,
  getClass,
  createClass,
  deleteClass,
  updateClass,
  addStudent,
  transferStudent,
  updateStudent,
  deleteStudent,
  getStudentInClass,
} = require('../controllers/classController');

// Routes for the Class model
router.get('/', getClasses); // Get all classes
router.get('/:id', getClass); // Get a single class by ID
router.post('/', createClass); // Create a new class
router.delete('/:id', deleteClass); // Delete a class by ID
router.patch('/:id', updateClass); // Update a class by ID
router.post('/:id/students', addStudent); // Add a student to a class, handling image upload
router.post('/transfer-student', transferStudent); // Transfer a student to a new class
router.put('/:classId/students/:studentId', updateStudent); // Update a student in a class, handling image upload
router.delete('/:classId/students/:studentId', deleteStudent); // Delete a student from a class
router.get('/:classId/students/:studentId', getStudentInClass); // Get a student in a class

module.exports = router;
