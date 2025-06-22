import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Header from "../../components/header/Header";
import { apiFetch } from "../../apiClient";
import Notification from "../../components/notification/Notification";
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
    const [loading, setLoading] = useState<boolean>(false);

    const location = useLocation();

    useEffect(() => {
        if (location.state?.success) {
            console.log(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
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
            setRefresh(prev => !prev);
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
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12">
                        {/* Page Header */}
                        <div className="text-center mb-5">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary me-3">
                                    <path d="M22,10V6A2,2 0 0,0 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.9 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10M13,17.5H11V16.5H13V17.5M13,15.5H11V14.5H13V15.5M13,13.5H11V12.5H13V13.5M13,11.5H11V10.5H13V11.5M13,9.5H11V8.5H13V9.5M13,7.5H11V6.5H13V7.5Z" />
                                </svg>
                                <h1 className="mb-0 fw-bold text-primary display-5">My Tickets</h1>
                            </div>
                            <p className="text-muted fs-5">Manage your event reservations</p>
                        </div>

                        <Notification />

                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-light border-start border-primary border-4 mb-4" role="alert">
                                <div className="d-flex align-items-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary me-2">
                                        <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                    </svg>
                                    <span className="text-muted mb-0">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Success Alert */}
                        {refundMsg && (
                            <div className="alert alert-light border-start border-success border-4 mb-4" role="alert">
                                <div className="d-flex align-items-center">
                                    <svg width="20" height="20" viewBox="0 0 20 20">
                                        <circle cx="10" cy="10" r="10" fill="#198754" />
                                        <polyline points="6,10 8.5,12.5 14,7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-muted mb-0 mx-3">{refundMsg}</span>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <h5 className="text-primary">Loading your tickets...</h5>
                                <p className="text-muted mb-0">Please wait while we fetch your reservations</p>
                            </div>
                        )}

                        {/* Reservations Grid */}
                        {!loading && (
                            <div className="row">
                                {reservations.map((reservation) => (
                                    <div key={reservation.id} className="col-xl-4 mb-4">
                                        <div className="card shadow-lg border-1 h-100">
                                            {/* Card Header */}
                                            <div
                                                className="card-header text-white py-3"
                                                style={{
                                                    background: "rgba(31, 99, 144, 0.8) ",
                                                }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                        <path d="M15,7H20.5L15,1.5V7M8,0H16L22,6V18A2,2 0 0,1 20,20H8C6.89,20 6,19.1 6,18V2A2,2 0 0,1 8,0M17,12H15V14H17V12M14,12H12V14H14V12M11,12H9V14H11V12M8,12H6V14H8V12Z" />
                                                    </svg>
                                                    <h5 className="mb-0 fw-bold">{reservation.event.name}</h5>
                                                </div>
                                            </div>

                                            <div className="card-body p-4 d-flex flex-column">
                                                {/* Personal Info Section */}
                                                <div className="mb-3">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <small className="text-muted">First Name</small>
                                                            <p className="mb-2 fw-bold">{reservation.name || "N/A"}</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <small className="text-muted">Last Name</small>
                                                            <p className="mb-2 fw-bold">{reservation.surname || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Event Details Section */}
                                                <div className="mb-3">
                                                    <h6 className="border-bottom pb-2 mb-3 text-primary">
                                                        Event Details
                                                    </h6>
                                                    <div className="mb-2">
                                                        <small className="text-muted">Location</small>
                                                        <p className="mb-1 fw-bold">{reservation.event.location}</p>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <small className="text-muted">Date</small>
                                                            <p className="mb-1 fw-bold">
                                                                {new Date(reservation.event.start_time).toLocaleDateString(undefined, {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }).replace(/(\d{2}) (\w{3}) (\d{4})/, (_, d, m, y) => `${d} ${m.toLowerCase()} ${y}`)}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <small className="text-muted">Time</small>
                                                            <p className="mb-1 fw-bold">
                                                                {new Date(reservation.event.start_time).toLocaleTimeString(undefined, {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    hour12: true
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity Section */}
                                                <div className="mb-3 mt-auto">
                                                    {reservation.id === editId ? (
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id={`quantity-${reservation.id}`}
                                                                placeholder="Quantity"
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
                                                            />
                                                            <label htmlFor={`quantity-${reservation.id}`}>Number of Tickets</label>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-light p-3 rounded d-flex align-items-center justify-content-between border-start border-4">
                                                            <span className="text-muted">Tickets Bought:</span>
                                                            <h5 className="mb-0 text-success fw-bold">{reservation.quantity}</h5>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="d-flex gap-2">
                                                    {reservation.id === editId ? (
                                                        <>
                                                            <button
                                                                className="btn btn-success flex-fill py-2"
                                                                onClick={() => handleSave(reservation)}
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                                </svg>
                                                                Save Changes
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                onClick={() => setEditId(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-primary flex-fill py-2"
                                                                onClick={() => handleEditClick(reservation)}
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={handleDeleteReservation(reservation.id)}
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-1">
                                                                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reservations;