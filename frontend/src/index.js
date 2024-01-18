import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './class.css';
import App from './App';
import { StoriesContextProvider } from './context/StoriesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoriesContextProvider>
      <App />
      </StoriesContextProvider>
  </React.StrictMode>
);
