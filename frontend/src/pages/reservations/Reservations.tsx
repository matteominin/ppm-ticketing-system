import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "../../components/header/Header";
import { apiFetch } from "../../apiClient";
import styles from "./Reservations.module.scss";
const API_URL = import.meta.env.VITE_API_URL;

interface Reservation {
    id: number;
    event: {
        id: number;
        name: string;
        location: string;
        start_time: string;
    };
    name: string;
    surname: string;
    quantity: number;
}

const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editQuantity, setEditQuantity] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [refundMsg, setRefundMsg] = useState<string | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    const location = useLocation();

    useEffect(() => {
        if (location.state?.success) {
            console.log(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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
    }, [refresh]);

    const handleDeleteReservation = (id: number) => async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this reservation?")) {
                return;
            }
            const res = await apiFetch(`${API_URL}/reservations/${id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
                }
            })

            if (!res.ok) {
                throw new Error("Failed to delete reservation");
            }

            setRefresh(prev => !prev);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    const handleEditClick = (reservation: Reservation) => {
        if (editId === reservation.id) {
            setEditId(null);
            setRefundMsg(null);
        } else {
            setEditId(reservation.id);
            setEditQuantity(reservation.quantity);
            setRefundMsg(null);
        }
    };

    const handleSave = async (reservation: Reservation) => {
        if (editQuantity < 1) {
            setError("Quantity must be at least 1");
            return;
        }
        try {
            const res = await apiFetch(`${API_URL}/reservations/${reservation.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
                },
                body: JSON.stringify({ quantity: editQuantity }),
            });
            if (!res.ok) {
                throw new Error("Failed to update reservation");
            }
            setReservations((prev) =>
                prev.map((r) =>
                    r.id === reservation.id ? { ...r, quantity: editQuantity } : r
                )
            );
            setEditId(null);
            if (editQuantity < reservation.quantity) {
                setRefundMsg("You have reduced your ticket quantity. We are sending a refund for the difference.");
            } else {
                setRefundMsg(null);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h1 className="text-center mb-4">My Tickets</h1>

                {location.state?.success && (
                    <div className={styles.success} role="alert">
                        {location.state.message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-info text-center" role="alert">
                        {error}
                    </div>
                )}

                {refundMsg && (
                    <div className="alert alert-success text-center" role="alert">
                        {refundMsg}
                    </div>
                )}

                <div className="row">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{reservation.event.name}</h5>
                                    <p className="mb-2">
                                        <strong>Name:</strong> {reservation.name || "N/A"}<br />
                                        <strong>Surname:</strong> {reservation.surname || "N/A"}
                                    </p>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        Location: {reservation.event.location}
                                    </h6>
                                    <p className="card-text mb-2">
                                        Date:{" "}
                                        {new Date(reservation.event.start_time).toLocaleDateString(undefined, {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }).replace(/(\d{2}) (\w{3}) (\d{4})/, (_, d, m, y) => `${d} ${m.toLowerCase()} ${y}`)}
                                    </p>
                                    <p>
                                        Time:{" "}
                                        {new Date(reservation.event.start_time).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true
                                        })}
                                    </p>
                                    <div className="card-text mt-auto">
                                        {reservation.id === editId ? (
                                            <div>
                                                <label>
                                                    Tickets Bought:{" "}
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={reservation.quantity}
                                                        value={editQuantity}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            if (val > reservation.quantity) {
                                                                setEditQuantity(reservation.quantity);
                                                            } else {
                                                                setEditQuantity(val);
                                                            }
                                                        }}
                                                        className="form-control d-inline-block"
                                                        style={{ width: 80 }}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <>
                                                Tickets Bought: <strong>{reservation.quantity}</strong>
                                            </>
                                        )}
                                    </div>

                                    {reservation.id === editId && editQuantity < reservation.quantity && (
                                        <div className="alert alert-warning mt-2">
                                            You are reducing your ticket quantity. We are sending a refund for the difference.
                                        </div>
                                    )}

                                    <div className="d-flex gap-2 mt-3">
                                        {reservation.id === editId ? (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleSave(reservation)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleEditClick(reservation)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={handleDeleteReservation(reservation.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        </>
    );
};

export default Reservations;
