import { useState } from 'react';
import { useNavigate } from 'react-router'
import Header from '../../components/header/Header';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        if (password !== password2) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${VITE_API_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, phone_number: phone, address }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh || '');
                setMessage('Signup successful!');
                setTimeout(() => {
                    navigate("/", {
                        replace: true,
                        state: { success: true, message: 'Successfully Signed Up!' }
                    });
                }, 1000);
            } else {
                const errorData = await response.json();
                const errorMsg = errorData.detail || Object.values(errorData).flat().join(' ') || 'Signup failed. Please try again.';
                setError(errorMsg);
            }
        } catch (err) {
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
                            <div className="card-header bg-success text-white text-center py-4">
                                <div className="d-flex align-items-center justify-content-center mb-2">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                        <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                                    </svg>
                                    <h2 className="mb-0 fw-bold">Create Account</h2>
                                </div>
                            </div>

                            <div className="card-body p-4 position-relative">
                                {/* Loading Overlay */}
                                {loading && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-95" style={{ zIndex: 1000 }}>
                                        <div className="text-center">
                                            <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <h5 className="text-success">Creating your account...</h5>
                                            <p className="text-muted mb-0">Please wait while we process your information</p>
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

                                {/* Signup Form */}
                                <form onSubmit={handleSignup}>
                                    {/* Personal Information Section */}
                                    <div className="mb-4">
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <label htmlFor="email">Email Address</label>
                                            </div>
                                        </div>

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
                                                    type="tel"
                                                    className="form-control"
                                                    id="phone"
                                                    placeholder="Phone Number"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <label htmlFor="phone">Phone Number</label>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="address"
                                                    placeholder="Address"
                                                    value={address}
                                                    onChange={e => setAddress(e.target.value)}
                                                    disabled={loading}
                                                />
                                                <label htmlFor="address">Address <span className="text-muted">(optional)</span></label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div className="mb-4">
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

                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password2"
                                                    placeholder="Confirm Password"
                                                    value={password2}
                                                    onChange={e => setPassword2(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <label htmlFor="password2">Confirm Password</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg py-3 fw-bold"
                                            disabled={loading || !email || !username || !password || !password2 || !phone}
                                            style={{
                                                background: loading ? undefined : '#28a745',
                                                border: 'none'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </span>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                        <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                                                    </svg>
                                                    Create Account
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