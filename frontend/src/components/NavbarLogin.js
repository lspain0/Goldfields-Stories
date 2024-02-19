import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

// Nav bar login/signup componet

const NavbarLogin = () => {


  // Using the useLocation to get current location from router dom
  const location = useLocation(); 
  let pageTitle;

  // Logout handler function
  const logoutHandler = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    // Redirect to the login page
    window.location.href = "/login";
  }
  
  // pagetile based on current location
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
        {/*Links ofr login and signup navgitaiton */}
        <div className="nav-links">
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/signup" className="nav-item">SignUp</Link>
        </div>
      </nav>
    </header>
  );
};


export default NavbarLogin;