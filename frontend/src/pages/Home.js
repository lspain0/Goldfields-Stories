import { useEffect } from "react"
import { useStoriesContext } from "../hooks/useStoriesContext"
import { Link } from 'react-router-dom'

// components
import StoryDetails from "../components/StoryDetails"
import Logo from "../components/logo"

const Home = () => {
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
          <Link to="/createstory">  
            <button className="create-story-button">Create a new Story</button>
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

export default Home