const Story = require('../models/storyModel')
const mongoose = require('mongoose')

//get all stories
const getStories = async (req, res) => {
    const stories = await Story.find({}).sort({createdAt: -1})

    res.status(200).json(stories)
}


//get a single story
const getStory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No story found'})
    }

    const story = await Story.findById(id)

    if (!story) {
        return res.status(404).json({error: 'No story found'})
    }

    res.status(200).json(story)
}


//create a new story
const createStory = async (req, res) => {
    const {title, tags, content} = req.body

    //add document to db
    try {
        const story = await Story.create({title, tags, content})
        res.status(200).json(story)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


//delete a story
const deleteStory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No story found'})
    }

    const story = await Story.findOneAndDelete({_id: id})

    if (!story) {
        return res.status(404).json({error: 'No story found'})
    }

    res.status(200).json(story)

}

//update a story
const updateStory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No story found'})
    }

    const story = await Story.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!story) {
        return res.status(404).json({error: 'No story found'})
    }

    res.status(200).json(story)
}


module.exports = {
    getStories,
    getStory,
    createStory,
    deleteStory,
    updateStory
}