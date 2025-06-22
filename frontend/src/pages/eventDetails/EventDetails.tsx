import Header from '../../components/header/Header';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

interface Event {
    id: number;
    name: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    price: string;
    total_tickets: number;
    available_tickets: number | null;
    created_at: string;
    updated_at: string;
    organizer: number;
}

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [message, setMessage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');

    const navigate = useNavigate();

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const fetchEvent = async () => {
        try {
            setError('');
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
            if (!res.ok) throw new Error('Failed to fetch event details');
            const data = await res.json();
            setEvent(data);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError('An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError('Event ID is required');
            setLoading(false);
            return;
        }
        fetchEvent();
    }, [id]);

    const handleReserve = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setMessage('You must be logged in to buy tickets.');
            return;
        }

        if (!name.trim() || !surname.trim()) {
            setMessage('Please enter your name and surname.');
            return;
        }

        if (quantity < 1 || (event?.available_tickets && quantity > event.available_tickets)) {
            setMessage('Please select a valid quantity.');
            return;
        }

        const params = new URLSearchParams({
            quantity: quantity.toString(),
            name,
            surname
        });

        navigate({
            pathname: `/checkout/${event?.id}`,
            search: `?${params.toString()}`
        });
    };

    const isLowStock = event?.available_tickets && event.available_tickets <= 5;
    const isOutOfStock = event?.available_tickets === 0;
    const startDateTime = event ? formatDateTime(event.start_time) : null;
    const endDateTime = event ? formatDateTime(event.end_time) : null;

    return (
        <>
            <Header />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-7">
                        {/* Loading State */}
                        {loading && (
                            <div className="card shadow-lg border-0">
                                <div className="card-body text-center py-5">
                                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h5 className="text-primary">Loading Event Details...</h5>
                                    <p className="text-muted mb-0">Please wait while we fetch the event information</p>
                                </div>
                            </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                                </svg>
                                <strong>Error:</strong> {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}

                        {/* Event Details */}
                        {event && !loading && (
                            <div className="card shadow-lg border-0">
                                {/* Header */}
                                <div className="card-header bg-primary text-white py-4 position-relative">
                                    {/* Status Badge */}
                                    {(isLowStock || isOutOfStock) && (
                                        <div className="position-absolute top-0 end-0 m-3">
                                            <span className={`badge ${isOutOfStock ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                                {isOutOfStock ? 'Sold Out' : `Only ${event.available_tickets} left`}
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <div className="d-flex align-items-center justify-content-center mb-2">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                            </svg>
                                            <h2 className="mb-0 fw-bold">{event.name}</h2>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center text-white-50">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-4">
                                    {/* Event Info Section */}
                                    <div className="mb-4">
                                        <h5 className="border-bottom pb-2 mb-3 text-primary">
                                            Event Information
                                        </h5>

                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-success me-2">
                                                        <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H20v2h-2V2h-2v2H8V2H6v2H4.5C3.67 4 3 4.67 3 5.5v14c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-14c0-.83-.67-1.5-1.5-1.5zM19 19H5V8h14v11z" />
                                                    </svg>
                                                    <small className="fw-bold">Start:</small>
                                                </div>
                                                <p className="ms-3 mb-0 text-muted">{startDateTime?.date}</p>
                                                <p className="ms-3 text-muted">{startDateTime?.time}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center mb-2">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-danger me-2">
                                                        <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H20v2h-2V2h-2v2H8V2H6v2H4.5C3.67 4 3 4.67 3 5.5v14c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-14c0-.83-.67-1.5-1.5-1.5zM19 19H5V8h14v11z" />
                                                    </svg>
                                                    <small className="fw-bold">End:</small>
                                                </div>
                                                <p className="ms-3 mb-0 text-muted">{endDateTime?.date}</p>
                                                <p className="ms-3 text-muted">{endDateTime?.time}</p>
                                            </div>
                                        </div>

                                        <p className="text-muted">
                                            <strong>Description:</strong>
                                            {event.description}
                                        </p>
                                    </div>

                                    {/* Pricing & Availability Section */}
                                    <div className="mb-4">
                                        <h5 className="border-bottom pb-2 mb-3 text-primary">
                                            Pricing & Availability
                                        </h5>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <div className="bg-light p-2 rounded border-start border-success border-4">
                                                    <small className="text-muted d-block">Price per ticket</small>
                                                    <h4 className="mb-0 text-success fw-bold">${event.price}</h4>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="bg-light p-2 rounded border-start border-primary border-4">
                                                    <small className="text-muted d-block">Available tickets</small>
                                                    <h4 className="mb-0 text-primary fw-bold">
                                                        {event.available_tickets !== null ? event.available_tickets : "N/A"}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <div className="bg-light p-2 rounded border-start border-secondary border-4">
                                                    <small className="text-muted d-block">Total tickets</small>
                                                    <h4 className="mb-0 text-secondary fw-bold">{event.total_tickets}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Purchase Form Section */}
                                    {!isOutOfStock && (
                                        <div className="mb-4">
                                            <h5 className="border-bottom pb-2 mb-3 text-primary">
                                                Purchase Information
                                            </h5>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="firstName"
                                                            placeholder="First Name"
                                                            value={name}
                                                            onChange={(e) => {
                                                                setMessage('');
                                                                setName(e.target.value);
                                                            }}
                                                            required
                                                        />
                                                        <label htmlFor="firstName">First Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="lastName"
                                                            placeholder="Last Name"
                                                            value={surname}
                                                            onChange={(e) => {
                                                                setMessage('');
                                                                setSurname(e.target.value);
                                                            }}
                                                            required
                                                        />
                                                        <label htmlFor="lastName">Last Name</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row align-items-end">
                                                <div className="col-md-6 mb-3">
                                                    <div className="form-floating">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="quantity"
                                                            placeholder="Quantity"
                                                            min="1"
                                                            max={event.available_tickets || 1}
                                                            value={quantity}
                                                            onChange={(e) => {
                                                                setMessage('');
                                                                setQuantity(Number(e.target.value));
                                                            }}
                                                            required
                                                        />
                                                        <label htmlFor="quantity">Quantity</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="bg-light p-3 rounded h-100 d-flex align-items-center justify-content-between border-start border-success border-4">
                                                        <span className="text-muted">Total Amount:</span>
                                                        <h4 className="mb-0 text-success fw-bold">
                                                            ${(parseFloat(event.price) * quantity).toFixed(2)}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Message Alert */}
                                    {message && (
                                        <div className={`alert alert-dismissible fade show mb-4 ${message.toLowerCase().includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
                                            {message}
                                            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                                        </div>
                                    )}

                                    {/* Purchase Button */}
                                    <div className="d-grid">
                                        {isOutOfStock ? (
                                            <button className="btn btn-secondary btn-lg py-3 fw-bold" disabled>
                                                Event Sold Out
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-lg py-3 fw-bold"
                                                onClick={handleReserve}
                                                style={{
                                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                    border: 'none'
                                                }}
                                            >
                                                Buy {quantity} Ticket{quantity > 1 ? 's' : ''} - ${(parseFloat(event.price) * quantity).toFixed(2)}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetails;