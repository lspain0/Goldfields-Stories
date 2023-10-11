const express = require('express')
const {
    getStories,
    getStory,
    createStory,
    deleteStory,
    updateStory
} = require('../controllers/storyController')

const router = express.Router()

//GET all stories
router.get('/', getStories)

//GET single story
router.get('/:id', getStory)

//POST a new story
router.post('/', createStory)

//DELETE a story
router.delete('/:id', deleteStory)

//UPDATE a story
router.patch('/:id', updateStory)


module.exports = router