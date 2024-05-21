//this page contains the full view of a story, here users can see all information regarding the story as well as being able to make comments
//this page can also be interacted with by admins to delete, edit, or post pending stories
//there is also logic for sending an email to a parent when a pending story containing their child is posted 

import React, { useEffect, useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import axios_obj from "../axios";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'rsuite';
import emailjs from '@emailjs/browser';

var storyId;

//get story id from link
function loadStoryID() {
  storyId = window.location.pathname.split('/')[2];
}

//get current date - used for comments
function getDate() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'short' });

  const formattedDate = `${day} ${month}`;
  return formattedDate;
}

//hanlde deletion of story by admin user
const handleDeleteStory = async () => {
  if (window.confirm("Are you sure you want to delete this story?")) {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Update state or perform any necessary actions upon successful update
        alert("Story Deleted!");
        setTimeout(function () {
          window.location.href = '/stories';
        }, 1);

      } else {
        const errorResponseText = await response.text();
        console.error(`Error deleting story with ID ${storyId}:`, errorResponseText);
      }

    } catch (error) {
      console.error(`Error deleting story with ID ${storyId}:`, error);
    }
  }
};

//add space in place of comma
function addSpace(str) {
  return str.replaceAll(',', (', '))
}

//get full name of author
function getName(str) {
  var firstName = str.split(' ')[0];
  var lastName = str.split(' ')[1];
  var fullName = firstName.charAt(0).toUpperCase() + firstName.slice(1) + (' ') + lastName.charAt(0).toUpperCase() + lastName.slice(1)

  return fullName;
}


const StoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStory, setCurrentStory] = useState(null);
  const [comments, setComments] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentPostEnabled, setCommentPostEnabled] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name"));

  //redirect users without permissions 
  if (window.location.href.includes('pending') && localStorage.getItem("role") !== 'Admin') {
    window.location.href = `/home`;
  }

  //display admin controls for pending stories
  function adminControls() {
    if (window.location.href.includes('pending')) {
      return (
        <div className="pending-story-admin-controls">
          <button className="create-story-button" onClick={handlePostStory}>Post Story</button>
          <Link to={`/editstory/${storyId}`}>
            <button className="pending-story-button">Edit Story</button>
          </Link>
          <button className="pending-story-button" onClick={handleDeleteStory}>Delete Story</button>
        </div>
      );
    }
  }
  
  //get parent emails - used to notify parents by email when childs story is posted
  const fetchParentEmails = async (childName) => {
    try {
      const response = await axios.get(`/api/users/parent/${childName.trim()}`);
      if (response.status === 200 && response.data.length) {
        return response.data.map(parent => parent.email);  // Return an array of emails
      } else {
        throw new Error(`Emails not found for ${childName}`);
      }
    } catch (error) {
      console.error(`Failed to fetch parent emails for ${childName}:`, error);
      return [];  // Return empty array if there is an error
    }
  };
  
  //send email to parents
  const sendEmail = async (childName, storyTitle) => {
    const parentEmails = await fetchParentEmails(childName);
    if (!parentEmails.length) {
      console.log(`No emails found for the parents of ${childName}`);
      return;
    }
  
    parentEmails.forEach(email => {
      emailjs.init('EpPv7PHQnymglutDn');
      const templateParams = {
        to_name: childName,
        to_email: email,
        story_title: storyTitle,
        from_name: "Goldfields School",
      };
  
      emailjs.send('service_gh6zyr9', 'template_7a90zid', templateParams).then(
        (response) => {
          console.log(`SUCCESS! Email sent to ${email}`, response.status, response.text);
        },
        (error) => {
          console.error(`FAILED to send email to ${email}`, error);
        }
      );
    });
  };
  
  //handles posting pending story - changes state to approved
  const handlePostStory = async () => {
    if (window.confirm("Are you sure you want to post this story?")) {
      const childNames = currentStory.children.split(',');
      for (const childName of childNames) {
        await sendEmail(childName.trim(), currentStory.title);
      }
  
      try {
        const response = await fetch(`/api/stories/${storyId}/state`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ state: 'approved' })
        });
  
        if (response.ok) {
          alert("Story Posted!");
          setTimeout(() => {
            console.log(`Story with ID ${storyId} has been successfully approved.`);
            navigate('/stories');
          }, 1000);
        } else {
          const errorResponseText = await response.text();
          console.error(`Error approving story with ID ${storyId}:`, errorResponseText);
        }
      } catch (error) {
        console.error(`Error approving story with ID ${storyId}:`, error);
      }
    }
  };
  
  //handle posting comment
  const handlePostComment = async () => {
    let firstComment = true;
    setName(localStorage.getItem("name"));
    // Update comments in the state
    if (comments == null) {
      setComments(newComment);
    }
    else {
      setComments((prevComments) => prevComments + newComment);
      firstComment = false;
    }

    try {
      // Fetch request to update comments in the backend
      let commentSubmit;

      if (firstComment === true) {
        commentSubmit = newComment;
      }
      else {
        commentSubmit = comments + newComment;
      }

      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comments: commentSubmit }) // Update state to 'approved'
      });

      if (!response.ok) {
        const errorResponseText = await response.text();
        console.error(`Error posting comment: `, errorResponseText);
      }
    } catch (error) {
      console.error(`Error posting comment: `, error);
    }
    setNewComment('');

    // Clear the input field
    document.querySelector('.comment-footer-input').value = '';
  };

  //get story from database using id from link
  useEffect(() => {
    const fetchStoryById = async () => {
      const storyId = location.pathname.split('/')[2];

      if (storyId) {
        try {
          const response = await axios_obj.get(`/stories/${storyId}`);
          const json = response.data;

          if (parseInt(response.status) === 200) {
            setCurrentStory(json);
          } else {
            console.error(`Error fetching story with ID ${storyId}:`, json);
          }
        } catch (error) {
          console.error(`Error fetching story with ID ${storyId}:`, error);
        }
      }
    };

    fetchStoryById();
  }, [location.pathname]);

  //load existing comments for story
  const loadComments = () => {
    setComments(currentStory.comments);
  }

  //handle change in comment entry field
  const handleCommentChange = (values) => {
    if (values.trim() !== '') {
      setNewComment('<sub>' + name + '<br>' + getDate() + '<br><br></sub>' + (values.replace(/<\/?[^>]+(>|$)/g, "")).replace(/(?:\r\n|\r|\n)/g, '<br>') + '<br><br><br>');
      setCommentPostEnabled(true);
    } else {
      setNewComment('');
      setCommentPostEnabled(false);
    }
  };

  useEffect(() => {
    if (currentStory) {
      loadComments();
    }
  }, [currentStory]);


  // Render nothing while currentStory is being loaded
  if (!currentStory) {
    return null;
  }

  // Function to parse HTML string
  const parseHTML = (html) => {
    return { __html: html };
  };

  //formats timestamp used for comments
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-UK', options);

    return formattedDate;
  };

  //generate story info and layout using mongodb content
  const generateStoryInfoHTML = () => {
    return (
      <div className="story-info">
        <div className="info-line">
          <p>Author:</p>
          <p className="info-content">{getName(currentStory.author)}</p>
        </div>
        <hr className="solid" />
        <div className="info-line">
          <p>Story Date:</p>
          <p className="info-content">{formatTimestamp(currentStory.createdAt)}</p>
        </div>
        <hr className="solid" />
        <p>Children in this story:</p>
        <p>{addSpace(currentStory.children)}</p>
        <hr className="solid" />
        {currentStory.tags !== '' && (
          <>
            <p>Learning Tags:</p>
            <div className="tags-container">
              {currentStory.tags.split('|').map((tag, index, array) => (
                <React.Fragment key={index}>
                  <div style={{ border: '2px solid lightblue', borderRadius: '4px', marginBottom: '4px', display: 'inline-block' }}>
                    <sub style={{ margin: '0', padding: '2px 4px', display: 'block' }}>{tag.trim()}</sub>
                  </div>
                  {index !== array.length - 1 && ' '}
                </React.Fragment>
              ))}
            </div>
            <hr className="solid" />
          </>
        )}
        <p>Comments: </p>
        <br></br>
        <div className="story-comments" dangerouslySetInnerHTML={parseHTML(comments)} />
      </div>
    );
  };

  //footer for comment entry
  const commentFooter = () => {
    if (!window.location.href.includes('pending')) {
      return <div className="comment-footer">
        <hr className="solid" />
        <Input onChange={handleCommentChange} className="comment-footer-input" as="textarea" rows={3} placeholder="Add a comment..." />
        <Button onClick={handlePostComment} disabled={!commentPostEnabled} className="comment-post-button">Post</Button>
      </div>
    }
  }

  //page layout
  return (
    <body className="story-page-body">
      <div className="back-arrow" onClick={() => navigate(-1)}>&larr; Back</div>
      {loadStoryID()}
      {adminControls()}
      <div className="story-content">
        {/* Conditional rendering for h2 */}
        {currentStory.title !== 'zzznull' ? <h2 dangerouslySetInnerHTML={parseHTML(currentStory.title)} /> : null}
        <div dangerouslySetInnerHTML={parseHTML(currentStory.content)} />
      </div>
      {generateStoryInfoHTML()}
      {commentFooter()}
    </body>
  );

};

export default StoryPage;