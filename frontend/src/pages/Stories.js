//this page contains a list of all stories available to the current user, as well as links to the create story page
//some links are only to users with certain roles - for example only admins can access pending stories
//only admins and teachers can access the create story page for education stories

import React from 'react';
import { useEffect, useState } from "react";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { Link } from 'react-router-dom';
import axios_obj from "../axios";
import StudentList from "../components/docs/StudentList";
import {
  Dropdown,
  RadioGroup,
  Radio,
  CheckTree,
  Button,
  ButtonToolbar,
  Nav,
  Badge
} from 'rsuite';
import StoryDetails from "../components/StoryDetails";
import { convertStringToGroupedTags, splitLines } from "../components/docs/tags";

const numbers = Array.from({ length: 101 }, (_, index) => index.toString());
var groupedTags = [];

//navbar
const Navbar = ({ active, onSelect, ...props }) => {
    return (
      <Nav {...props} activeKey={active} onSelect={onSelect} style={{ marginLeft: 50, marginTop: 15, maxWidth: 150}}>
        <Nav.Item eventKey="education">Education</Nav.Item>
        <Nav.Item eventKey="family">Family</Nav.Item>
        <Nav.Item eventKey="mystories">My Stories</Nav.Item>
      </Nav>
    )
};

const Stories = () => {
  //variables
    const { stories, dispatch } = useStoriesContext();
  var sortedStories = null;
  const [role, setRole] = useState(""); //current user role state
  const [selectedRadioValue, setSelectedRadioValue] = useState("All"); //dropdown radio value state
  const [selectedChildrenFilters, setChildren] = useState(''); //dropdown checktree children state
  const [selectedTagFilters, setTags] = useState(''); //dropdown checktree tag state
  const [reset, setReset] = useState(''); //state to reset checktrees when updated
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [sortOption, setSortOption] = useState("Story Date"); // Selected Story Sort Option
  const [tagSet, setTagSet] = useState('')
  const tagID = "65f7a048017d08e34c5e8ee9" //id of the tag set in mongodb
  const [tagsArray, setTagsArray] = useState([]);
  const [active, setActive] = React.useState('education');

  //get tag set from mongodb database - used for story filter menu
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

    //Getting the route path from window location
    const currentRoute = window.location.pathname;
    try {
      //if current route is not in change password then checks for change in the localStorage
      if (currentRoute != "/change_password") {
        let change = localStorage.getItem("change");

        //if change is set to '1' that means user needs to change password
        if (change == "1") {
          window.location.href = "/change_password";
        }
      }
    }
    //Catching any exceptions that might happen, does nothing if it does happen
    catch (ex) {
    }
  }, []);
  
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

  //sorts studentlist alphabetically for dropdown
  const sortedData = StudentList().sort((a, b) => {
    const nameA = a.label.split(' ')[0].toLowerCase();
    const nameB = b.label.split(' ')[0].toLowerCase();
    return nameA.localeCompare(nameB);
  });

  //handles change in dropdown radio filter
  const handleRadioChange = (value) => {
    setSelectedRadioValue(value);
  };
  

  //get stories from mongodb database
  useEffect(() => {
    const fetchStories = async () => {
      const response = await axios_obj.get('/stories')
      const json = response.data
      if (parseInt(response?.status) === 200) {
        dispatch({ type: 'SET_STORIES', payload: json })
      }
    }

    setRole(localStorage.getItem("role"));

    fetchStories()
  }, [dispatch])

  //handles change in children filter
  const handleCheckTreeChangeChildren = (values) => {
    const childrenString = Array.isArray(values) ? values.join(',') : '';
    setChildren(childrenString);
  
  };

  //handles change in tag filter
  const handleCheckTreeChangeTags = (values) => {
    const tagString = Array.isArray(values) ? values.join(',') : '';
    setTags(tagString);
  };

  //resets dropdown
  const resetFilters = () => {
    setSelectedRadioValue('All');
    setChildren('');
    setTags('');
    setReset(reset+' ');
  };

  //handles close button for dropdown
  const handleDoneClick = () => {
    setDropdownOpen(false);
  };
  
  //toggles dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  //handle change in sort option dropdown
  const handleSortOptionChange = (option) => {
    setSortOption(option)
  }

  //displays number of current pending stories
  const getPendingStoryCount = (stories) => {
    let pendingStories = stories.filter(story => story.state === 'pending');
    let numberOfPendingStories = pendingStories.length;

    return numberOfPendingStories;
  }

  //sort stories according to selected sort option
  const sortStories = (stories) => {

    if (sortOption === "Story Title") {
      return [...stories].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    }
    else {
      return stories;
    }
  }

  //closes dropdown when user clicks outside of it
  useEffect(() => {
    const closeDropdown = (event) => {
      if (!event.target.closest('.filter-story-dropdown')) {
        setDropdownOpen(false);
      }
    };
  
    document.body.addEventListener('click', closeDropdown);
  
    return () => {
      document.body.removeEventListener('click', closeDropdown);
    };
  }, []); 

  useEffect(() => {
    if (active === 'family') {
      resetFilters();
      handleSortOptionChange("Story Date");
    }
  }, [active]); 
  

  //sort stories
  sortedStories = sortStories(stories)
  
  //display education stories
  if (active === 'education') {
    return (
      <body>
        <Navbar className='story-page-select-bar' appearance='subtle' default='education' active={active} onSelect={setActive} />
        <div>
      
        {/* Display for Teacher Role */}
        {
          ["Teacher"].includes(role) &&
  
          <span className="createstorylink">
            <Link to="/createstory">
              <button className="create-story-button">Create a new Story</button>
            </Link>
          </span>
        }
        {/* Display for Admin Role */}
        {
          
          ["Admin"].includes(role) &&
          <span className="createstorylink">
            <Link to="/createstory">
              <button className="create-story-button">Create a new Story</button>
            </Link>
            <Link to="/pending">
            {getPendingStoryCount(stories) > 0 && (
            <Badge content={getPendingStoryCount(stories)}>
              <button className="pending-story-button">Pending Stories</button>
            </Badge>)}
            </Link>
          </span>
        }
        {/* Dropdown for sorting stories */}
        <span>
        <Dropdown
          className="story-sort-dropdown"
          title={"Sorted by "+sortOption}>
          <Dropdown.Item onClick={() => handleSortOptionChange("Story Date")}>Story Date</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortOptionChange("Story Title")}>Story Title</Dropdown.Item>
        </Dropdown>
        </span>
        {/* Dropdown for filtering stories */}
        <span className="stories-dropdown">
          <Dropdown className="filter-story-dropdown"
            onOpenChange={setDropdownOpen}
            open={dropdownOpen}
            title="Filter Stories"
            onClick={toggleDropdown}
          >
            {/* Radio for storytype */}
          <Dropdown.Item panel className="dropdown-radio">
          <h4 className="dropdown-header">Story Type</h4>
          <RadioGroup name="dropdown-radio" value={selectedRadioValue} onChange={handleRadioChange}>
            <Radio value="All">All Stories</Radio>
            <Radio value="Individual">Individual Stories</Radio>
            <Radio value="Group">Group Stories</Radio>
          </RadioGroup>
          </Dropdown.Item>
          <Dropdown.Separator />
  
          {/* Checktree for children filter */}
          <Dropdown.Item panel className="dropdown-children">
            <h4 className="dropdown-header">Children</h4>
            <CheckTree
              key={reset.length}
              height={"150px"}
              data={sortedData}
              onChange={handleCheckTreeChangeChildren}
            />
          </Dropdown.Item>
          <Dropdown.Separator />
  
          {/* Checktree for tag filter */}
          <Dropdown.Item panel className="dropdown-tags">
            <h4 className="dropdown-header">Learning Tags</h4>
            <CheckTree
              className="checktree-tags"
              key={reset.length}
              height={"150px"}
              data={groupedTags}
              uncheckableItemValues={numbers}
              cascade={false}
              onChange={handleCheckTreeChangeTags}
            />
          </Dropdown.Item>
          <Dropdown.Separator />
  
          {/* Container for reset and done button */}
          <div className="dropdown-button-container">
            <Dropdown.Item panel>
                <ButtonToolbar>
                  <Button onClick={resetFilters} appearance="subtle">
                    Reset
                  </Button>
                  <Button className="dropdown-primary" onClick={handleDoneClick} appearance="primary">
                    Done
                  </Button>
              </ButtonToolbar>
            </Dropdown.Item>
          </div>
          </Dropdown>
        </span>
        </div>
        {/* Displays all stories as cards on the page */}
        <div className="story-cards-container">
          {sortedStories && sortedStories.map(story => (
            <StoryDetails story={story} key={story._id} selectedRadioValue={selectedRadioValue} 
            selectedChildrenFilters={selectedChildrenFilters} selectedTagFilters={selectedTagFilters} sortOption={sortOption} />
          ))}
        </div>
      </body>
    )
  }

  else {
    //display other story pages
    return (
      <body>
        <div>
          <Navbar className='story-page-select-bar' appearance='subtle' default='education' active={active} onSelect={setActive} />
          {active === 'family' ? (
            <span className="createstorylink">
              <Link to="/createfamilystory">
                <button className="family-story-button">Create a new Family Story</button>
              </Link>
            </span>
          ) : null}
        </div>
        {/* Displays all stories as cards on the page */}
        <div className="story-cards-container">
          {sortedStories && sortedStories.map(story => (
            <StoryDetails story={story} key={story._id} selectedRadioValue={selectedRadioValue} 
              selectedChildrenFilters={selectedChildrenFilters} selectedTagFilters={selectedTagFilters} sortOption={sortOption} currentState={active} />
          ))}
        </div>
      </body>
    )
  }
}

export default Stories
