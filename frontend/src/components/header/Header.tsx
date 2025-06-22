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
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/', {
            replace: true,
            state: { success: false, message: 'Successfully logged out!' }
        });
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{
            backgroundColor: 'rgba(18, 87, 143, 0.8)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span style={{ fontSize: '1.5rem' }}>EventApp</span>
                </Link>

                {/* Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        {isLoggedIn ? (
                            <>
                                {/* My Tickets Link */}
                                <li className="nav-item me-3">
                                    <Link
                                        className="nav-link d-flex align-items-center px-3 py-2 rounded transition-all"
                                        to="/reservations"
                                        style={{
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M22,10V6A2,2 0 0,0 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.9 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10M13,17.5H16V16H13V17.5M13,15H16V13.5H13V15M13,12H16V10.5H13V12M8,15A1.5,1.5 0 0,1 6.5,13.5A1.5,1.5 0 0,1 8,12A1.5,1.5 0 0,1 9.5,13.5A1.5,1.5 0 0,1 8,15Z" />
                                        </svg>
                                        My Tickets
                                    </Link>
                                </li>

                                {/* Sign Out Button */}
                                <li className="nav-item me-2">
                                    <button
                                        className="btn btn-outline-light d-flex align-items-center px-3 py-2"
                                        onClick={handleLogout}
                                        style={{
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Login Link */}
                                <li className="nav-item me-3">
                                    <Link
                                        className="nav-link d-flex align-items-center px-3 py-2 rounded"
                                        to="/login"
                                        style={{
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                                        </svg>
                                        Login
                                    </Link>
                                </li>

                                {/* Sign Up Button */}
                                <li className="nav-item me-2">
                                    <Link
                                        className="btn btn-light d-flex align-items-center px-4 py-2 fw-bold"
                                        to="/sign-up"
                                        style={{
                                            borderRadius: '25px',
                                            color: '#667eea',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                                        </svg>
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;