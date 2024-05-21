//this file contains all routes used to interact with stories on the mongodb database

const express = require('express')
const {
    getStories,
    getStory,
    createStory,
    deleteStory,
    updateStory,
    updateStoryState,
    searchStories,
     
} = require('../controllers/storyController')
const { authenticateToken } = require('../controllers/userController')


const router = express.Router()

//GET all stories
router.get('/', authenticateToken,getStories)

// Search stories route
router.get('/search', searchStories);

//GET single story
router.get('/:id', getStory)

//POST a new story
router.post('/', createStory)

//DELETE a story
router.delete('/:id', deleteStory)

//UPDATE a story
router.put('/:id', updateStory);

// PUT request to update the state of a story
router.put('/:id/state', updateStoryState);

module.exports = router