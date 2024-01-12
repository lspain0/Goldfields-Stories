import { useEffect } from "react"
import { useStoriesContext } from "../hooks/useStoriesContext"

// components
import StoryForm from "../components/StoryForm"
import StoryDetails from "../components/StoryDetails"

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
    <div className="home">
      <div className="stories">
        {stories && stories.map(story => (
          <StoryDetails story={story} key={story._id} />
        ))}
      </div>
      <StoryForm />
    </div>
  )
}

export default Home