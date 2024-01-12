import { StoriesContext } from "../context/StoriesContext"
import { useContext } from "react"

export const useStoriesContext = () => {
  const context = useContext(StoriesContext)

  if(!context) {
    throw Error('useStoriesContext must be used inside an StoriesContextProvider')
  }

  return context
}