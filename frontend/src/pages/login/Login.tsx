import { useState } from 'react';
import Header from '../../components/header/Header';
import { useNavigate } from 'react-router';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            const response = await fetch(`${VITE_API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh || '');
                setMessage('Login successful!');
                setTimeout(() => {
                    navigate('/', {
                        replace: true,
                        state: { success: true, message: 'Successfully Logged In!' }
                    });
                }, 1000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-xl-5">
                        <div className="card shadow-lg border-0">
                            {/* Header */}
                            <div className="card-header bg-primary text-white text-center py-4">
                                <div className="d-flex align-items-center justify-content-center mb-2">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                    </svg>
                                    <h2 className="mb-0 fw-bold">Welcome Back</h2>
                                </div>
                                <p className="mb-0 opacity-75">Sign in to your account</p>
                            </div>

                            <div className="card-body p-4 position-relative">
                                {/* Loading Overlay */}
                                {loading && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-95" style={{ zIndex: 1000 }}>
                                        <div className="text-center">
                                            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <h5 className="text-primary">Signing you in...</h5>
                                            <p className="text-muted mb-0">Please wait while we authenticate you</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error Alert */}
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                        <div className="d-flex align-items-center">
                                            <span>{error}</span>
                                        </div>
                                        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                    </div>
                                )}

                                {/* Success Alert */}
                                {message && (
                                    <div className="alert alert-light border-start border-success border-4 mb-4">
                                        <div className="d-flex align-items-center">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-success me-2">
                                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                                            </svg>
                                            <span className="text-muted">{message}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Login Form */}
                                <form onSubmit={handleLogin}>
                                    {/* Credentials Section */}
                                    <div className="mb-4">

                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Username"
                                                    value={username}
                                                    onChange={e => setUsername(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <label htmlFor="username">Username</label>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <label htmlFor="password">Password</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg py-3 fw-bold"
                                            disabled={loading || !username || !password}
                                            style={{
                                                background: loading ? undefined : '#007bff',
                                                border: 'none'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </span>
                                                    Signing In...
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                        <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                                                    </svg>
                                                    Sign In to Account
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}