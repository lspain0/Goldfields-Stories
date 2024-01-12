import { createContext, useReducer } from 'react'

export const StoriesContext = createContext()

export const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return { 
        stories: action.payload 
      }
    case 'CREATE_STORY':
      return { 
        stories: [action.payload, ...state.stories] 
      }
    default:
      return state
  }
}

export const StoriesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storiesReducer, { 
    stories: null
  })
  
  return (
    <StoriesContext.Provider value={{ ...state, dispatch }}>
      { children }
    </StoriesContext.Provider>
  )
}