const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up multer for image file handling
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

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
router.post('/:id/students', upload.single('image'), addStudent); // Add a student to a class, handling image upload
router.post('/transfer-student', transferStudent); // Transfer a student to a new class
router.put('/:classId/students/:studentId', upload.single('image'), updateStudent);
router.delete('/:classId/students/:studentId', deleteStudent);
router.get('/:classId/students/:studentId', getStudentInClass);



module.exports = router;
