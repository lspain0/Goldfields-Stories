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
  CheckTree
} from 'rsuite';
import Logo from "../components/logo";
import StoryDetails from "../components/StoryDetails";


const Stories = () => {
  const { stories, dispatch } = useStoriesContext();
  const [role, setRole] = useState("");
  const [selectedRadioValue, setSelectedRadioValue] = useState(null);

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

          <Dropdown className="filter-story-dropdown"
        title="Filter Stories"
      >
      <Dropdown.Item panel>
      <h4>Story Type</h4>
      <RadioGroup name="radio-name">
        <Radio value="A">All Stories</Radio>
        <Radio value="B">Individual Stories</Radio>
        <Radio value="C">Group Stories</Radio>
      </RadioGroup>
      </Dropdown.Item>
      <Dropdown.Separator />


      <Dropdown.Item panel>
        <h4>Children</h4>
        <CheckTree
          height={"150px"}
          data={sortedData}
        />
      </Dropdown.Item>
      <Dropdown.Separator />

      <Dropdown.Item panel>
        <h4>Learning Tags</h4>
        <CheckTree
          height={"150px"}
          data={groupedTags}
          uncheckableItemValues={['1', '2', '3', '4']}
          cascade={false}
        />
      </Dropdown.Item>
      <Dropdown.Separator />

      </Dropdown>
        </div>
      }
      <div className="story-cards-container">
        {stories && stories.map(story => (
          <StoryDetails story={story} key={story._id} />
        ))}
      </div>


    </body>
  )
}

export default Stories