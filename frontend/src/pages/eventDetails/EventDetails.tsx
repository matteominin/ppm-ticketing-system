import Header from '../../components/header/Header';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../apiClient';

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
    const [quantity, setQuantity] = useState<number>(1);
    const [message, setMessage] = useState<string>('');

    const fetchEvent = async () => {
        try {
            setError('');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
            if (!res.ok) throw new Error('Failed to fetch event details');
            const data = await res.json();
            setEvent(data);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError('An unknown error occurred');
        }
    };

    useEffect(() => {
        if (!id) {
            setError('Event ID is required');
            return;
        }
        fetchEvent();
    }, [id]);

    const handleReserve = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setMessage('You must be logged in to buy tickets.');
            return;
        }

        try {
            const res = await apiFetch(`${import.meta.env.VITE_API_URL}/reservations/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    event: event?.id,
                    quantity: quantity,
                }),
            });

            if (res.ok) {
                setMessage('Reservation successful!');
                fetchEvent(); // Refresh available_tickets
            } else {
                const errorData = await res.json();
                setMessage(errorData.detail || 'Failed to reserve tickets.');
            }
        } catch {
            setMessage('Something went wrong. Try again.');
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}

                {!error && !event && (
                    <div className="text-center mt-5">
                        <div className="spinner-border" role="status" />
                        <div>Loading...</div>
                    </div>
                )}

                {event && (
                    <div className="card shadow mt-4">
                        <div className="card-body">
                            <h2 className="card-title">{event.name}</h2>
                            <p className="text-muted">
                                {new Date(event.start_time).toLocaleString()} – {new Date(event.end_time).toLocaleString()}
                            </p>
                            <h6 className="card-subtitle mb-2 text-secondary">Location: {event.location}</h6>

                            <p className="card-text mt-3">{event.description}</p>

                            <ul className="list-group list-group-flush mt-3">
                                <li className="list-group-item">Price: <strong>${event.price}</strong></li>
                                <li className="list-group-item">Total Tickets: {event.total_tickets}</li>
                                <li className="list-group-item">
                                    Available Tickets: {event.available_tickets !== null ? event.available_tickets : "N/A"}
                                </li>
                            </ul>

                            {/* Ticket Purchase */}
                            <div className="mt-4">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    className="form-control"
                                    min="1"
                                    max={event.available_tickets || 1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                                <button className="btn btn-primary mt-2" onClick={handleReserve}>
                                    Buy Ticket
                                </button>
                            </div>

                            {message && (
                                <div className="alert alert-info mt-3" role="alert">
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default EventDetails;
