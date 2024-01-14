import { useEffect } from "react"
import { useStoriesContext } from "../hooks/useStoriesContext"
import { Link } from 'react-router-dom'

// components
import StoryForm from "../components/StoryForm"
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
      <div className="home">
        <Logo />
      </div>
      <Link to="/createstory">
        <div className="createstorylink">      
            <h3>Create a new Story</h3>
        </div></Link>

      <div className="home">
        <div className="stories">
          {stories && stories.map(story => (
            <StoryDetails story={story} key={story._id} />
          ))}
        </div>
      </div>
    </body>
  )
}

export default Home