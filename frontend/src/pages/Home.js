import { useEffect, useState } from 'react'

//components
import StoryDetails from '../components/StoryDetails'
import StoryForm from '../components/StoryForm'

const Home = () => {
    const [stories, setStories] = useState(null)

    useEffect(() => {
        const fetchStories = async () => {
            const response = await fetch('/api/stories')
            const json = await response.json()

            if (response.ok) {
                setStories(json)
            }
        }

        fetchStories()
    }, [])

    return (
        <div className="home">
            <div className="stories">
                {stories && stories.map((story) => (
                    <StoryDetails ke ={story._id} story={story} />
                ))}
            </div>
            <StoryForm />
        </div>
    )
}

export default Home