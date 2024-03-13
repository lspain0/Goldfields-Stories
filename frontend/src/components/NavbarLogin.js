import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Nav bar login/signup componet

const NavbarLogin = () => {


  // Using the useLocation to get current location from router dom
  const location = useLocation(); 
  let pageTitle;

  
  // Links to page based on current location
  switch (location.pathname) {
    case '/':
      pageTitle = 'Goldfields';
      break;
    case '/stories':
      pageTitle = 'Stories';
      break;
    case '/class':
      pageTitle = 'Create a New Class';
      break;
    case '/search':
      pageTitle = 'Search Stories';
      break;
    default:
      pageTitle = ''; 
  }

  // Render the component
  return (
    <header>
      <nav className="navbar">
        {/* displaying page title*/}
        <Link to="/" className="nav-logo">
          <h1>{pageTitle}</h1>
        </Link>
        {/*Links of login and signup navgitaiton */}
        <div className="nav-links">
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/signup" className="nav-item">SignUp</Link>
        </div>
      </nav>
    </header>
  );
};


export default NavbarLogin;