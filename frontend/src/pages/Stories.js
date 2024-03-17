import { useEffect, useState } from "react";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { Link } from 'react-router-dom';
import axios_obj from "../axios";
import StudentList from "../components/docs/StudentList";
import { groupedTags } from "../components/docs/tags";
import {
  Dropdown,
  RadioGroup,
  Radio,
  CheckTree,
  Button,
  ButtonToolbar
} from 'rsuite';
import Logo from "../components/logo";
import StoryDetails from "../components/StoryDetails";

const Stories = () => {
  const { stories, dispatch } = useStoriesContext();
  var sortedStories = null;
  const [role, setRole] = useState(""); //current user role state
  const [selectedRadioValue, setSelectedRadioValue] = useState("All"); //dropdown radio value state
  const [selectedChildrenFilters, setChildren] = useState(''); //dropdown checktree children state
  const [selectedTagFilters, setTags] = useState(''); //dropdown checktree tag state
  const [reset, setReset] = useState(''); //state to reset checktrees when updated
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [sortOption, setSortOption] = useState("Story Date"); // Selected Story Sort Option

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

  sortedStories = sortStories(stories);
  
  return (
    <body>
      <div>
      <Logo />
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
            <button className="pending-story-button">Pending Stories</button>
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
            uncheckableItemValues={['1', '2', '3', '4']}
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

export default Stories
