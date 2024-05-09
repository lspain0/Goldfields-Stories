const express = require('express');
const {
    loginUser,
    createUser,
    validateCreateUser,
    validateLoginUser,
    authenticateToken,
    UserList,
    validateUpdateUser,
    deleteUser,
    updateUser,
    validateDeleteUser,
    getParentsByChildName
} = require('../controllers/userController');

const router = express.Router();

// POST a new user
router.post('/create', validateCreateUser, createUser);

// POST to login a user
router.post('/login', validateLoginUser, loginUser);

// GET to check token validity and user role
router.get('/checkValidity', authenticateToken, (req, res) => {
    res.status(200).json({ success: 'Passed', role: req.user.role });
});

// POST to delete a user
router.post('/delete', validateDeleteUser, deleteUser);

// POST to update a user
router.post('/update', validateUpdateUser, updateUser);

// POST to get all users
router.post('/userList', UserList);

// GET parents by child's name using URL parameters
router.get('/parent/:childName', getParentsByChildName);

module.exports = router;
