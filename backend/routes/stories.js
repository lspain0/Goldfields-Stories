const express = require('express')
const {
    getStories,
    getStory,
    createStory,
    deleteStory,
    updateStory,
    updateStoryState
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
router.put('/:id', updateStory);

// PUT request to update the state of a story
router.put('/:id/state', updateStoryState);

module.exports = router