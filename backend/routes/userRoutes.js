const express = require('express')
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
    validateDeleteUser
} = require('../controllers//userController')

const router = express.Router()


//POST a new story
router.post('/create', validateCreateUser, createUser)

//POST a new story
router.post('/login', validateLoginUser, loginUser)

router.get('/checkValidity', authenticateToken, (req, res) => {
    res.status(200).json({ suucess: 'Passed', role: req?.user?.role });
})

//Delete user
router.post('/delete', validateDeleteUser, deleteUser)

//Updating tab
router.post('/update', validateUpdateUser, updateUser)

//Getting all users
router.post('/userList', UserList)


module.exports = router