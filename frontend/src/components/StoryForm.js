//this component is a forn that is used for the creation of stories, it can be used for creation of both education and family stories
//however the layout is slighly different for each of these
//this form can also be used for editing stories that have already been made and are pending approval

import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { CheckTreePicker, ButtonToolbar, Modal, Button, Input, Divider, TagInput, Nav } from 'rsuite';
import '../index.css';
import { convertStringToGroupedTags, splitLines } from "./docs/tags";
import StudentList from "./docs/StudentList";
import ClassList from "./docs/ClassList";
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.2/dist/quill.snow.css" />

//global variables
var editing = false;
var storyId;
var optimisedUrl
var roleCheck = false;
var groupedTags = [];
const numbers = Array.from({ length: 101 }, (_, index) => index.toString());
var role = localStorage.getItem("role");
var child = localStorage.getItem("child");

//checks role of current user
function checkRole () {
  if (role.includes("Admin"))
  {
    roleCheck = true
  }
  else if (role.includes("Teacher"))
  {
    roleCheck = true
  }
}

//checks if the form is being used to edit an exisitng story
function isEditing() {
  if (window.location.pathname.includes('editstory')) {
    editing = true;
    storyId = window.location.pathname.split('/')[2];
  }
  else {
    editing = false;
  }
};

//gets name of ucrrent user to use as author entry
function getName(str) {
  var firstName = str.split(' ')[0];
  var lastName = str.split(' ')[1];
  var fullName = firstName.charAt(0).toUpperCase() + firstName.slice(1) + (' ') + lastName.charAt(0).toUpperCase() + lastName.slice(1)

  return fullName;
}

//cloudinary upload widget used for image uploads
const UploadWidget = ({ onImageUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'drpnvb7qc',
      uploadPreset: 'tetlineq',
      sources: [ 'local '],
      clientAllowedFormats: ['image']
    }, function (error, result) {
      if (!error && result && result.event === "success") {
        const imageUrl = result.info.secure_url;
        onImageUpload(imageUrl);
      }
    });
  }, [onImageUpload]);

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent the form from being submitted
    widgetRef.current.open();
  };

  return (
    <button className="story-form-button" onClick={handleButtonClick}>
      Upload image
    </button>
  );
};

//cloudinary upload widget for video upload
const UploadWidgetVideo = ({ onVideoUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'drpnvb7qc',
      uploadPreset: 'tetlineq',
      sources: [ 'local '],
      clientAllowedFormats: ['video'],
      //maxFileSize: 500000000
    }, function (error, result) {
      if (!error && result && result.event === "success") {
        let videoUrl = result.info.secure_url;
        let replacement = "f_auto:video,q_auto";
        optimisedUrl = videoUrl.replace(/(\/upload\/)[^/]+/, "$1" + replacement);
        onVideoUpload(optimisedUrl);
      }
    });
  }, [onVideoUpload]);

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent the form from being submitted
    widgetRef.current.open();
  };

  return (
    <button className="story-form-button" onClick={handleButtonClick}>
      Upload Video
    </button>
  );
};


const StoryForm = () => {

  //variables
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const sortedData = StudentList().sort((a, b) => {
    const nameA = a.label.split(' ')[0].toLowerCase();
    const nameB = b.label.split(' ')[0].toLowerCase();
    return nameA.localeCompare(nameB);
  });
  
  isEditing();
  const { dispatch } = useStoriesContext();
  const [title, setTitle] = useState('');
  const [children, setChildren] = useState([]);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [state, setState] = useState('pending');
  const [error, setError] = useState('');
  const [selectedCheckTreeValuesTags, setSelectedCheckTreeValuesTags] = useState([]); 
  const [selectedCheckTreeValuesChildren, setSelectedCheckTreeValuesChildren] = useState([]);
  const quillRef = useRef();
  const [currentUser, setUser] = useState(localStorage.getItem("name"));
  const [tagSet, setTagSet] = useState('')
  const tagID = "65f7a048017d08e34c5e8ee9" //id of the tag set in mongodb
  const [tagsArray, setTagsArray] = useState([]);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [originalTagGroups, setOriginalTagGroups] = useState([]);
  const [checkTreeChildrenOpen, setCheckTreeChildrenOpen] = useState(false); // State to manage tree visibility
  const [checkTreeTagsOpen, setCheckTreeTagsOpen] = useState(false); // State to manage tree visibility 
  const [active, setActive] = React.useState('individual');

  //navbar
  const Navbar = ({ active, onSelect, ...props }) => {
    return (
      <Nav {...props} activeKey={active} onSelect={onSelect} style={{ marginLeft: 50, marginTop: 5, maxWidth: 150}}>
        <Nav.Item eventKey="individual">Individual Story</Nav.Item>
        <Nav.Item eventKey="class">Class Story</Nav.Item>
      </Nav>
    )
  };

  //will return a different check tree picker depending on if a class or individual story is selected
  const checkTreeState = () => {
    //individual checktreepicker
    if (active === 'individual') {
      return <CheckTreePicker
      className="check-tree"
      placeholder="Add children to this story..."
      data={sortedData}
      uncheckableItemValues={['1-1', '1-1-2']}
      value={selectedCheckTreeValuesChildren}
      onOpenChange={setCheckTreeChildrenOpen}
      onChange={handleCheckTreePickerChangeChildren}
      onClick={toggleCheckTreePickerChildren}
      cascade={false}
      open={checkTreeChildrenOpen}
      renderExtraFooter={() => (
        <div
          style={{
            padding: '10px 2px',
            borderTop: '1px solid #e5e5e5'
          }}
        >
          <Button inline className="checktree-close" appearance="primary" onClick={toggleCheckTreePickerChildren}>
            Done
          </Button>
        </div>
      )}
    />
    }
    //class checktreepicker
    else {
      return <CheckTreePicker
      className="check-tree"
      placeholder="Add a class to this story..."
      data={ClassList()}
      uncheckableItemValues={['1-1', '1-1-2']}
      value={selectedCheckTreeValuesChildren}
      onOpenChange={setCheckTreeChildrenOpen}
      onChange={handleCheckTreePickerChangeChildren}
      onClick={toggleCheckTreePickerChildren}
      cascade={false}
      open={checkTreeChildrenOpen}
      renderExtraFooter={() => (
        <div
          style={{
            padding: '10px 2px',
            borderTop: '1px solid #e5e5e5'
          }}
        >
          <Button inline className="checktree-close" appearance="primary" onClick={toggleCheckTreePickerChildren}>
            Done
          </Button>
        </div>
      )}
    />
    }
  }

  useEffect(() => {
    const fetchStoryById = async () => {
      //if currently editing a story, gets the story from mongodb database
      if (editing === true) {
        const storyId = window.location.pathname.split('/')[2];

        if (storyId) {
          try {
            const response = await fetch(`/api/stories/${storyId}`);
            const json = await response.json();

            //sets the content of the form according to the story retrieved from the database
            if (response.ok) {
              setTitle(json.title);
              setChildren(json.children ? json.children.split(',').map(child => child.trim()) : []);
              setContent(json.content);
              setUser(json.author);
              let tagsArray = (json.tags).split('|');
              let childrenArray = (json.children).split(',');

              handleCheckTreePickerChangeTags(tagsArray);
              handleCheckTreePickerChangeChildren(childrenArray);
            } else {
              console.error(`Error fetching story with ID ${storyId}:`, json);
            }
          } catch (error) {
            console.error(`Error fetching story with ID ${storyId}:`, error);
          }
        }
      }
    };

    fetchStoryById();
  }, []);

  //reactquill wysiwyg
  useEffect(() => {
    if (quillRef.current) {
      // Additional setup or handling can be added here
    }
  }, []);

  //handles change in selected values for the tag checktreepicker
  const handleCheckTreePickerChangeTags = (values) => {
    setSelectedCheckTreeValuesTags(values);
    const tagsString = Array.isArray(values) ? values.join('|') : '';
    setTags(tagsString);
  };

  //handles change in selected values for the children checktreepicker
  const handleCheckTreePickerChangeChildren = (values) => {
    setSelectedCheckTreeValuesChildren(values);
    const childrenString = Array.isArray(values) ? values.join(',') : '';
    setChildren(childrenString);
  };

    //toggles tree visibility
    const toggleCheckTreePickerChildren = () => {
      setCheckTreeChildrenOpen(!checkTreeChildrenOpen);
      if (checkTreeTagsOpen) {
        toggleCheckTreePickerTags();
      }
    };

    //toggles tree visibility
    const toggleCheckTreePickerTags = () => {
      setCheckTreeTagsOpen(!checkTreeTagsOpen);
      if (checkTreeChildrenOpen) {
        toggleCheckTreePickerChildren();
      }
    };

    //handle image upload to cloudinary as well as retrieving the link to the image and adding it to the story content
  const handleImageUpload = imageUrl => {
    if (imageUrl.includes("f_auto:video,q_auto"))
    {
      setContent(content + `\n<div id="upload-div">
      <div class="sub"></div><iframe
      title="test"
      src=${optimisedUrl}
      width="640"
      height="360" 
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowfullscreen
      frameborder="0"
    ></iframe></div>\n`);}
    else {
      setContent(content + `\n<div id="upload-div">
      <img src="${imageUrl}" align="center" alt="uploaded" />\n`);
    }   
  };

  //handle story submit - when post story button is clicked 
  const handleSubmit = async (e) => {

    e.preventDefault();
    const childrenArray = Array.isArray(children) ? children : [{ value: children }];
    const childrenString = childrenArray.map((child) => child.value).join(',');
    const tagsString = tags;
    const story = {
      title,
      children: childrenString,
      tags: tagsString,
      content,
      author: currentUser,
      state,
    };

    //if editing it will find the story and update it
    if (editing === true) {
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'PUT',
          body: JSON.stringify(story), // Include updated story data here
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        await response.json();
    
        if (!response.ok) {
          throw new Error(`Error updating story: ${response.statusText}`);
        }
    
        alert("Story Updated!");
        setTimeout(function() {
          window.location.href = `/pending/${storyId}`;
        }, 1);

      } catch (error) {
        console.error('Error updating story:', error);
      }
    }

    //if not editing post a new story entry
    else {
      try {
        const response = await fetch('/api/stories', {
          method: 'POST',
          body: JSON.stringify(story),
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const json = await response.json();
  
        if (!response.ok) {
          alert(json.error);
        }
  
        if (response.ok) {
          setTitle('');
          setChildren([]);
          setTags('');
          setContent('');
          setState('');
          setError(null);
          console.log('New Story Posted', json);
          dispatch({ type: 'CREATE_STORY', payload: json });
          alert("Story Posted!");
          setTimeout(function() {
            window.location.href = '/stories';
          }, 1);
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        setError('An error occurred while submitting the form.');
      }
    }
  };
  //function to post the initial tag set on mongodb, should only ever need to be used once if there is not already an exisiing tag set
  /*const postTags = async () => {
    try {
      // Convert grouped tags to a string using convertToString function
      const tagsContent = convertToString(groupedTags);
  
      // Construct the request body with the required content field
      const requestBody = {
        content: tagsContent
      };
  
      // Send the POST request to the backend API
      const response = await fetch('/api/tags', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        throw new Error(json.error);
      }
  
      console.log('Tags posted successfully:', json);
      // You can add any further handling here, such as updating state or showing a success message
    } catch (error) {
      console.error('Error posting tags:', error);
      // Handle the error as per your application's requirements
    }
  };*/

  //the modal display used by admins to edit the tags that are available
const editTagsDisplay = () => {
  if (role.includes("Admin")) {
    return <div>
          <ButtonToolbar>
          <Button onClick={handleOpenTags}> Edit Tags</Button>
        </ButtonToolbar>
        <Modal backdrop="static" open={open} onClose={handleClose}>
    <Modal.Header>
      <Modal.Title>Edit Tags</Modal.Title>
    </Modal.Header>
    <Modal.Body>   
    {renderTagInputs()}
    <Divider></Divider>
    <Button appearance="primary" className="dropdown-primary" onClick={addTagGroup}>
      Create New Tag Group
    </Button>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={handleCancel} appearance="subtle">
        Cancel
      </Button>
      <Button onClick={updateTagsContent} className="dropdown-primary" appearance="primary">
      Save Changes
    </Button>
    </Modal.Footer>
  </Modal>
        </div>
  }
}


// Function to update the mongodb tag set
const updateTagsContent = async () => {
  try {
    // Gather the text and tags from within the modal body div
    let modalText = '';
    const inputElements = document.querySelectorAll('.rs-modal-body input');
    inputElements.forEach((input, index) => {
      modalText += `${input.value}\n`; // Add a new line after each tag
    });

    // Replace commas with new line characters only if there's no space after them
    modalText = modalText.replace(/,(?!\s)/g, '\n');

    const tagsContent = modalText.trim();
    const requestBody = {
      content: tagsContent
    };

    const response = await fetch(`/api/tags/${tagID}`, {
      method: 'PUT',
      body: JSON.stringify(requestBody), // Include updated tags data here
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await response.json();

    if (!response.ok) {
      throw new Error(`Error updating tags: ${response.statusText}`);
    }
    else {
      groupedTags = convertStringToGroupedTags(tagsContent);
    }

    // Close the modal and set tagGroups to updatedGroups
    setOpen(false);

  } catch (error) {
    console.error('Error updating tags:', error);
  }

};

  //used for family stories
  const setStateFamily = () => {
    if (state !== 'family') {
      setState('family');
      setTitle('zzznull');
      setChildren(child);
    }
  }

  //get tag set from mongodb
  const getTags = async () => {
    try {
      const response = await fetch(`/api/tags/${tagID}`);
      const json = await response.json();

      if (response.ok) {
        setTagSet(json.content);
      } else {
        console.error(`Error fetching tags`);
      }
    } catch (error) {
      console.error(`Error fetching tags`);
    }
  }

  useEffect(() => {
    if (tagsArray.length < 1) {
      getTags().then(() => {
        // Check if tagSet is not an empty string and is properly set
        if (tagSet && tagSet !== '') {
          // Split the tagSet using splitLines function
          const splitTagsArray = splitLines(tagSet);
          // Update the state with the split tags array
          setTagsArray(splitTagsArray);
          groupedTags = convertStringToGroupedTags(tagSet);
        }
      });
      }
  });

  useEffect(() => {
    // Update tagGroups whenever tagsArray changes
    setTagGroups(groupTags(tagsArray));
  }, [tagsArray]);

  // Function to group tags based on asterisk delimiter
  const groupTags = (tagsArray) => {
    const groups = [];
    let currentGroup = [];
    tagsArray.forEach((tag) => {
      if (tag.endsWith("*")) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
      currentGroup.push(tag.replace("*", ""));
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  };

  const [tagGroups, setTagGroups] = useState(groupTags(tagsArray));

  // Function to add a new tag group
  const addTagGroup = () => {
    setTagGroups([...tagGroups, [""]]);
  };
  

// Function to delete a tag group
const deleteTagGroup = (index) => {
  // Set the index to be deleted
  setIndexToDelete(index);

  const updatedGroups = tagGroups.filter((_, i) => i !== index);
  setTagGroups(updatedGroups);
  // Reset indexToDelete after deleting the group
  setIndexToDelete(null);
};

//handle change in tags
const handleTagChange = (value, index) => {
  var updatedGroups = [...tagGroups];
  updatedGroups[index] = value;
  setTagGroups(updatedGroups)
};

//handles opening tag selection
const handleOpenTags = () => {
  setOpen(true);
  // Save the current tagGroups state as the originalTagGroups state
  setOriginalTagGroups(tagGroups);
};

//cancel button handling
const handleCancel = () => {
  // Revert back to the original tagGroups state when cancel button is clicked
  setTagGroups(originalTagGroups);
  setOpen(false); // Close the modal
};

//if the form is being used for a family story, get the current users child
const familyMomentGetChild = () => {
  if (role.includes("Parent") || role.includes("Family")) {
    return <h2>Family moment for {child}</h2>
  }
  else {
    //if a admin or teacher is using the family story form, include a checktreepicker to select a child
    return (<div><h2>Family moment for {child}     <span><CheckTreePicker
      placeholder="Select Child"
      data={sortedData}
      uncheckableItemValues={['1-1', '1-1-2']}
      value={selectedCheckTreeValuesChildren}
      onOpenChange={setCheckTreeChildrenOpen}
      onChange={handleCheckTreePickerChangeChildren}
      onClick={toggleCheckTreePickerChildren}
      cascade={false}
      open={checkTreeChildrenOpen}
      renderExtraFooter={() => (
        <div
          style={{
            padding: '10px 2px',
            borderTop: '1px solid #e5e5e5',
            borderBottom: '5px'
          }}
        >
          <Button inline className="checktree-close" appearance="primary" onClick={toggleCheckTreePickerChildren}>
            Done
          </Button>
        </div>
      )}
    /></span></h2>
    </div>
    )
  }
};

// Function to render tag inputs for each group
const renderTagInputs = () => {
  return tagGroups.map((group, index) => (
    <div key={JSON.stringify(group)+index}>
      {/* Render the div only if the index is not the one to be deleted */}
      {index !== indexToDelete && (
        <>
          <Input 
            defaultValue={group[0]}
            onChange={(defaultValue) => group[0] = (defaultValue)}
          ></Input>
          <TagInput
            block
            value={group.slice(1)} // Exclude the first element as header
            onChange={(value) => handleTagChange([group[0], ...value], index)}
          />
          <Button className="dropdown-delete-button" onClick={() => deleteTagGroup(index)} color="red" appearance="primary">Delete Group</Button>
          <Divider />
        </>
      )}
    </div>
  ));
};
//story form for creation of education stories
  if (!window.location.pathname.includes('family'))
  {
    //redirect users without permissions
    checkRole();
    if (roleCheck === false)
    {
      window.location.href = `/`;
    }
    return (
      <body className="story-form">
        <Navbar className='story-form-select-bar' appearance='subtle' default='education' active={active} onSelect={setActive} />
        <form className="create-story" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              className="short-input"
              placeholder={"Story title..."}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="author-input" readOnly>
              Author: {getName(currentUser)}
            </span>
          </div>
  
          {checkTreeState()}
          
          <UploadWidget onImageUpload={handleImageUpload} />
          <div></div>

          <CheckTreePicker
            className="check-tree2"
            placeholder="Learning tags..."
            data={groupedTags}
            uncheckableItemValues={numbers}
            value={selectedCheckTreeValuesTags}
            onOpenChange={setCheckTreeTagsOpen}
            onChange={handleCheckTreePickerChangeTags}
            onClick={toggleCheckTreePickerTags}
            open={checkTreeTagsOpen}
            cascade={false}
            style={{ width: 660 }}
            renderMenu={(menu) => (
              <div style={{ maxWidth: 'calc(100vh - 100px)' }}>
                {menu}
              </div>
            )}
            renderExtraFooter={() => (
              <div
                style={{
                  padding: '10px 2px',
                  borderTop: '1px solid #e5e5e5'
                }}
              >
                <Button inline className="checktree-close" appearance="primary" onClick={toggleCheckTreePickerTags}>
                  Done
                </Button>
              </div>
            )}
          />
          
          <UploadWidgetVideo onVideoUpload={handleImageUpload} />
  
        {editTagsDisplay()}
  
          <div className="quill">
            <ReactQuill
              ref={quillRef}
              placeholder="Start writing..."
              onChange={(value) => setContent(value)}
              value={content}
              modules={{
                toolbar: {
                  container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                  ],
                },
              }}
              style={{ height: '63vh' }}
            />
          </div>
  
          <div className="centered-button">
            <button className="story-form-button">Post Story</button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </body>
    );
  }

  //story form for family stories
  else {
    setStateFamily()
    return (
    <body className="story-form">
    <form className="create-story" onSubmit={handleSubmit}>
      <div className="input-container">
      </div>
      <br></br>

      {familyMomentGetChild()}
      <span><UploadWidget onImageUpload={handleImageUpload}/> </span>
      <span><UploadWidgetVideo onVideoUpload={handleImageUpload} /></span>
      <div className="quill">
        <ReactQuill
          ref={quillRef}
          placeholder="Start writing..."
          onChange={(value) => setContent(value)}
          value={content}
          modules={{
            toolbar: {
              container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
              ],
            },
          }}
          style={{ height: '75vh' }}
        />
      </div>

      <div className="centered-button">
        <button className="story-form-button">Post Story</button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  </body>
    )
  }

};

export default StoryForm;
