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
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== password2) {
            setMessage('❌ Passwords do not match.');
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
                setMessage('✅ Signup successful! You can now log in.');
                navigate("/login"); // TODO: autmatically login user after signup
            } else {
                const errorData = await response.json();
                const errorMsg = errorData.detail || Object.values(errorData).flat().join(' ') || '❌ Signup failed.';
                setMessage(errorMsg);
            }
        } catch (err) {
            setMessage('❌ Something went wrong. Please try again later.');
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Sign Up</h2>
                                <form onSubmit={handleSignup}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address <span className="text-muted">(optional)</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password2}
                                            onChange={e => setPassword2(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">
                                        Register
                                    </button>
                                </form>
                                {message && (
                                    <div className="alert alert-info mt-3 text-center" role="alert">
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
