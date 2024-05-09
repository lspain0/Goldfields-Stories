const Story = require('../models/storyModel');
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/userModel');


// Middleware for logging requests
const logRequest = (req, res, next) => {
  console.log(req.path, req.method);
  next();
};

// Middleware for global error handling
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Validation middleware example (you can replace this with a library like Joi)
const validateCreateStory = (req, res, next) => {
  const { title, tags, content, children } = req.body;

  if (!title || !tags || !content || typeof children !== 'string' || children.trim() === '') {
    return res.status(400).json({ error: 'Title, tags, content, and children (as a non-empty string) are required' });
  }

  next();
};


// Get all stories
const getStories = async (req, res) => {
  console.log(req?.user);
  //Getting childID
  let child_id = req?.user?.child;
  let filter = {};


  if (req?.user?.role == "Parent") {
    filter["children"] = "";
    //Checking if the id of child is present and if present then creates expression filter
    if (child_id) {
      filter["children"] = new RegExp(child_id);
    }
  }


  //Getting stories from mongo
  const stories = await Story.find(filter).sort({ createdAt: -1 });
  res.status(200).json(stories);
};

// Get a single story
const getStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  const story = await Story.findById(id);

  if (!story) {
    return res.status(404).json({ error: 'No story found' });
  }

  res.status(200).json(story);
};

const emailjsServiceId = 'service_z931pq9';
const emailjsTemplateId = 'template_fda1n9w';
const emailjsAPIKey = '5kvxyVXjU2JkYqPBO'

// Function to send email
const sendEmail = (templateParams) => {
  axios({
    method: 'post',
    url: `https://api.emailjs.com/api/v1.0/email/send`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsAPIKey,
      template_params: templateParams
    }
  })
  .then(response => {
    console.log('Email sent successfully:', response.data);
  })
  .catch(error => {
    console.error('Failed to send email:', error);
  });
}

// Create a new story
const createStory = async (req, res) => {
  const { title, children, tags, content, author, state } = req.body;

  try {
    const story = await Story.create({ title, children, tags, content, author, state });

    const childrenArray = children.split(',').map(child => child.trim().toLowerCase());

    User.find({ child: { $in: childrenArray } })
      .then(parents => {
        parents.forEach(parent => {
          const templateParams = {
            to_name: parent.name,
            to_email: parent.email,
            story_title: content,
            from_name: "Goldfields School"
          };
          sendEmail(templateParams);
        });
      })
      .catch(err => {
        console.error("Failed to find parents or send email:", err);
        res.status(500).json({ error: 'Failed to process your request' });
      });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a story
const deleteStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  const story = await Story.findOneAndDelete({ _id: id });

  if (!story) {
    return res.status(404).json({ error: 'No story found' });
  }

  res.status(200).json(story);
};

// Update a story
const updateStory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  try {
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { ...req.body }, // Update story with new values from req.body
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ error: 'No story found' });
    }

    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update the state of a story
const updateStoryState = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No story found' });
  }

  try {
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { state: 'approved' }, // Update state to 'approved'
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ error: 'No story found' });
    }

    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search for stories with filters
const searchStories = async (req, res) => {
  const { search, filter } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    // Initial search query for multiple fields
    let searchQuery = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { children: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ]
    };

    // Extend search query based on the filter
    if (filter) {
      if (filter === 'Individual') {
        // Assuming individual stories have a single child
        searchQuery['$and'] = [{ children: { $not: /,/ } }];
      } else if (filter === 'Group') {
        // Assuming group stories have multiple children separated by commas
        searchQuery['$and'] = [{ children: /,/ }];
      }
    }

    const stories = await Story.find(searchQuery).sort({ createdAt: -1 });

    if (stories.length === 0) {
      return res.status(404).json({ message: 'No matching stories found' });
    }

    res.status(200).json(stories);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error during the search' });
  }
};


module.exports = {
  logRequest,
  errorHandler,
  validateCreateStory,
  getStories,
  getStory,
  createStory,
  deleteStory,
  updateStory,
  updateStoryState,
  searchStories,
};
