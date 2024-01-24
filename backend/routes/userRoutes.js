const express = require('express')
const {
    loginUser,
    createUser,
    validateCreateUser,
    validateLoginUser,
    authenticateToken
} = require('../controllers//userController')

const router = express.Router()


//POST a new story
router.post('/create', validateCreateUser, createUser)

//POST a new story
router.post('/login', validateLoginUser, loginUser)

router.get('/checkValidity', authenticateToken, (req, res) => {
    res.status(200).json({ suucess: 'Passed' });
})


module.exports = router