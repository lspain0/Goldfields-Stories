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
  const [role, setRole] = useState("");
  const [selectedRadioValue, setSelectedRadioValue] = useState("All");
  const [selectedChildrenFilters, setChildren] = useState('');
  const [selectedTagFilters, setTags] = useState('');
  const [reset, setReset] = useState('');


  const sortedData = StudentList().sort((a, b) => {
    const nameA = a.label.split(' ')[0].toLowerCase();
    const nameB = b.label.split(' ')[0].toLowerCase();
    return nameA.localeCompare(nameB);
  });

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


  const handleCheckTreeChangeChildren = (values) => {
    const childrenString = Array.isArray(values) ? values.join(',') : '';
    setChildren(childrenString);
  
  };

  const handleCheckTreeChangeTags = (values) => {
    const tagString = Array.isArray(values) ? values.join(',') : '';
    setTags(tagString);
  };

  const resetFilters = () => {
    setChildren('');
    setTags('');
    setReset(reset+' ');
  };
  
  return (
    <body>
      <Logo />
      {/* Display of Teacher Role */}
      {
        ["Teacher"].includes(role) &&

        <div className="createstorylink">
          <Link to="/createstory">
            <button className="create-story-button">Create a new Story</button>
          </Link>
        </div>
      }
      {/* Display of Admin Role */}
      {
        
        ["Admin"].includes(role) &&
        <div className="createstorylink">
          <Link to="/createstory">
            <button className="create-story-button">Create a new Story</button>
          </Link>
          <Link to="/pending">
            <button className="pending-story-button">Pending Stories</button>
          </Link>
        </div>
      }
                <Dropdown className="filter-story-dropdown"
        title="Filter Stories"
      >
      <Dropdown.Item panel className="dropdown-radio">
      <h4 className="dropdown-header">Story Type</h4>
      <RadioGroup name="dropdown-radio" value={selectedRadioValue} onChange={handleRadioChange}>
        <Radio value="All">All Stories</Radio>
        <Radio value="Individual">Individual Stories</Radio>
        <Radio value="Group">Group Stories</Radio>
      </RadioGroup>
      </Dropdown.Item>
      <Dropdown.Separator />

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

      <Dropdown.Item panel className="dropdown-tags">
        <h4 className="dropdown-header">Learning Tags</h4>
        <CheckTree
          key={reset.length}
          height={"150px"}v
          data={groupedTags}
          uncheckableItemValues={['1', '2', '3', '4']}
          cascade={false}
          onChange={handleCheckTreeChangeTags}
        />
      </Dropdown.Item>
      <Dropdown.Separator />

      <Dropdown.Item panel>
        <ButtonToolbar>
        <Button onClick={resetFilters}>
          Reset
        </Button>
        <Button>
          Done
        </Button>
      </ButtonToolbar>
      </Dropdown.Item>

      </Dropdown>
      <div className="story-cards-container">
        {stories && stories.map(story => (
          <StoryDetails story={story} key={story._id} selectedRadioValue={selectedRadioValue} selectedChildrenFilters={selectedChildrenFilters} selectedTagFilters={selectedTagFilters}/>
        ))}
      </div>


    </body>
  )
}

export default Stories
