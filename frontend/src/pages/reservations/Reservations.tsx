import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import { apiFetch } from "../../apiClient";
const API_URL = import.meta.env.VITE_API_URL;

interface Reservation {
    id: number;
    event: {
        id: number;
        name: string;
        location: string;
        start_time: string;
    };
    quantity: number;
}

const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await apiFetch(`${API_URL}/reservations/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch reservations");
                }
                const data = await res.json();
                setReservations(data);
                if (data.length === 0) {
                    setError("You have no tickets reserved.");
                } else {
                    setError(null);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unexpected error occurred");
                }
            }
        };
        fetchReservations();
    }, []);

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h1 className="text-center mb-4">My Tickets</h1>

                {error && (
                    <div className="alert alert-info text-center" role="alert">
                        {error}
                    </div>
                )}

                <div className="row">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{reservation.event.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        Location: {reservation.event.location}
                                    </h6>
                                    <p className="card-text mb-2">
                                        Date:{" "}
                                        {new Date(reservation.event.start_time).toLocaleString()}
                                    </p>
                                    <p className="card-text mt-auto">
                                        Tickets Bought: <strong>{reservation.quantity}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Reservations;
