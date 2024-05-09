import React, { useEffect, useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import axios_obj from "../axios";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'rsuite';
import emailjs from '@emailjs/browser';

var storyId;


function loadStoryID() {
  storyId = window.location.pathname.split('/')[2];
}

function getDate() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'short' });

  const formattedDate = `${day} ${month}`;
  return formattedDate;
}

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



function addSpace(str) {
  return str.replaceAll(',', (', '))
}

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

  if (window.location.href.includes('pending') && localStorage.getItem("role") !== 'Admin') {
    window.location.href = `/home`;
  }

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
  
  const fetchParentEmails = async (childNames) => {
    const emails = [];
    for (const childName of childNames) {
      try {
        const response = await axios.get(`/api/users/parent/${childName.trim()}`);
        if (response.status === 200 && response.data.email) {
          emails.push(response.data.email);
        } else {
          console.error(`Email not found for ${childName}`);
        }
      } catch (error) {
        console.error(`Failed to fetch parent email for ${childName}:`, error);
      }
    }
    return emails;
  };
  
  const sendEmails = async (childNames, storyTitle) => {
    const parentEmails = await fetchParentEmails(childNames);
    for (const email of parentEmails) {
      emailjs.init('5kvxyVXjU2JkYqPBO');
      const templateParams = {
        to_name: childNames.join(', '), // Adjust as necessary if you want individual names
        to_email: email,
        story_title: storyTitle,
        from_name: "Goldfields School",
      };
  
      emailjs.send('service_z931pq9', 'template_fda1n9w', templateParams).then(
        (response) => {
          console.log(`Email sent successfully to ${email}!`, response.status, response.text);
        },
        (error) => {
          console.error(`Failed to send email to ${email}:`, error);
        }
      );
    }
  };
  
  const handlePostStory = async () => {
    if (window.confirm("Are you sure you want to post this story?")) {
      const childNames = currentStory.children.split(','); // Assumes children's names are comma-separated
      await sendEmails(childNames, currentStory.title);
  
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

  const loadComments = () => {
    setComments(currentStory.comments);
  }

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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-UK', options);

    return formattedDate;
  };

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

  const commentFooter = () => {
    if (!window.location.href.includes('pending')) {
      return <div className="comment-footer">
        <hr className="solid" />
        <Input onChange={handleCommentChange} className="comment-footer-input" as="textarea" rows={3} placeholder="Add a comment..." />
        <Button onClick={handlePostComment} disabled={!commentPostEnabled} className="comment-post-button">Post</Button>
      </div>
    }
  }

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