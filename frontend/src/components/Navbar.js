import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Example using react-icons

const Navbar = () => {
    return (
        <header>
            <nav className="navbar">
                <Link to="/" className="nav-logo">
                    <h1>Goldfields</h1>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/stories" className="nav-item">Stories</Link>
                    <Link to="/class" className="nav-item">Class</Link>
                    <Link to="/search" className="nav-item">Search Stories</Link>
                    <Link to="/logout" className="nav-item">Logout</Link>
                    <FaUserCircle className="nav-icon"/>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
