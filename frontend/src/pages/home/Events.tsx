import { Link } from 'react-router';
import { useState, useEffect } from 'react';
const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Event {
    id: number;
    name: string;
    start_time: string;
    location: string;
    available_tickets: number;
}

const EventCard = ({ event }: { event: Event }) => {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text">
                        <strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                        <strong>Location:</strong> {event.location}
                    </p>
                    <p className="card-text">
                        <strong>Tickets:</strong>{" "}
                        {event.available_tickets !== null ? event.available_tickets : 'N/A'}
                    </p>
                    <div className="mt-auto">
                        <Link to={`/event/${event.id}`} className="btn btn-primary w-100">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setError("");
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
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Upcoming Events</h2>

            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            <div className="row">
                {events.length > 0 ? (
                    events.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="text-center">No events available at the moment.</div>
                )}
            </div>
        </div>
    );
};

export default Events;
