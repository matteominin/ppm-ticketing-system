import { Link } from "react-router";
import type { Event } from "../../../types/event";

const EventCard = ({ event }: { event: Event }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            fullDate: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    };

    const dateInfo = formatDate(event.start_time);
    const isLowStock = event.available_tickets <= 5;

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-lg border-0 position-relative overflow-hidden">
                {/* Availability Badge */}
                {isLowStock && (
                    <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                        <span className="badge bg-warning text-dark">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="me-1">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            Only {event.available_tickets} left
                        </span>
                    </div>
                )}

                <div className="card-body d-flex flex-column p-4" style={{ paddingTop: '5rem' }}>
                    <h5 className="card-title fw-bold text-primary mb-3">{event.name}</h5>

                    <div className="mb-3">
                        <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                            {event.description}
                        </p>
                    </div>

                    <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary me-2">
                                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H20v2h-2V2h-2v2H8V2H6v2H4.5C3.67 4 3 4.67 3 5.5v14c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-14c0-.83-.67-1.5-1.5-1.5zM19 19H5V8h14v11z" />
                            </svg>
                            <small className="text-muted">{dateInfo.fullDate}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary me-2">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <small className="text-muted">{event.location}</small>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="d-flex justify-content-center">
                            <Link
                                to={`/event/${event.id}`}
                                className="btn btn-primary btn-md fw-bold py-2 px-5"
                            >
                                View Event Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;