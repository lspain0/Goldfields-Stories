import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation(); // This hook gives us the current location object
    let pageTitle;
    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        window.location.href = "/login";

    }
    // Determine the page title based on the current path
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
        // Add more cases as needed for other routes
        default:
            pageTitle = 'Goldfields'; // Fallback title
    }

    return (
        <header>
            <nav className="navbar">
                {/* Display the determined page title */}
                <Link to="/" className="nav-logo">
                    <h1>{pageTitle}</h1>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/stories" className="nav-item">Stories</Link>
                    <Link to="/class" className="nav-item">Class</Link>
                    <Link to="/search" className="nav-item">Search Stories</Link>
                    <Link to="/logout" onClick={() => logoutHandler()} className="nav-item">Logout</Link>
                    <FaUserCircle className="nav-icon" />
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
