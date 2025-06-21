import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <Link className="navbar-brand mx-3" to="/">EventApp</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item mx-2">
                                <Link className="nav-link" to="/reservations">My tickets</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <button className="btn btn-outline-danger" onClick={handleLogout}>
                                    Sign Out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item mx-2">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link className="nav-link" to="/sign-up">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;