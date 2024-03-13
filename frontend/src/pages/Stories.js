import { useEffect, useState } from "react"
import { useStoriesContext } from "../hooks/useStoriesContext"
import { Link } from 'react-router-dom'
import axios_obj from "../axios"

// components
import StoryDetails from "../components/StoryDetails"
import Logo from "../components/logo"

const Stories = () => {
  const { stories, dispatch } = useStoriesContext()
  const [role, setRole] = useState("");

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