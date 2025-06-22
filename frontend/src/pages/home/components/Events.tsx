import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import type { Event } from '../../../types/event';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setError("");
                setLoading(true);
                const res = await fetch(`${VITE_API_URL}/events/`);
                if (!res.ok) throw new Error('Failed to fetch events');
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5 className="text-primary">Loading Events...</h5>
                        <p className="text-muted mb-0">Please wait while we fetch the latest events</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Header Section */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                        <h2 className="mb-0 fw-bold text-primary">Upcoming Events</h2>
                    </div>
                    <p className="text-muted mb-0">Discover amazing events happening near you</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-8">
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            <strong>Error:</strong> {error}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setError("")}
                                aria-label="Close"
                            ></button>
                        </div>
                    </div>
                </div>
            )}

            {/* Events Grid */}
            <div className="row">
                {events.length > 0 ? (
                    events.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card shadow-lg border-0">
                            <div className="card-body text-center py-5">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-muted mb-3">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                </svg>
                                <h4 className="text-muted mb-2">No Events Available</h4>
                                <p className="text-muted mb-0">Check back later for new events!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;