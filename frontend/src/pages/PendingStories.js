//This page is basically a duplicate of the stories page, but used for approving pending stories instead of creating new ones
//This page should only be visible to admins
import { useEffect } from "react"
import { useStoriesContext } from "../hooks/useStoriesContext"

// components
import StoryDetails from "../components/StoryDetails"
import Logo from "../components/logo"

const PendingStories = () => {
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