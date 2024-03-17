//This page is basically a duplicate of the stories page, but used for approving/editing pending stories instead of creating/viewing new ones
//This page should only be visible to admins
import { useEffect } from "react"
import { useStoriesContext } from "../hooks/useStoriesContext"
import { Link } from 'react-router-dom';

// components
import StoryDetails from "../components/StoryDetails"
import Logo from "../components/logo"

var roleCheck = false;

function checkRole () {
  const role = localStorage.getItem("role");

  if (role.includes("Admin"))
  {
    roleCheck = true
  }
  else if (role.includes("Teacher"))
  {
    roleCheck = true
  }
}

const PendingStories = () => {
  checkRole();
  if (roleCheck === false)
  {
    window.location.href = `/`;
  }
  const { stories, dispatch } = useStoriesContext()

  useEffect(() => {
    const fetchStories = async () => {
      const response = await fetch('/api/stories')
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_STORIES', payload: json})
      }
    }

    fetchStories()
  }, [dispatch])

  return (
    <body>
      <Logo />
      <div className="createstorylink">  
          <Link to={`/stories`}>
            <button className="create-story-button">Approved Stories</button>
          </Link>
          </div>
        <div className="story-cards-container">
          {stories && stories.map(story => (
            <StoryDetails story={story} key={story._id} />
          ))}
      </div>
    </body>
  )
}

export default PendingStories