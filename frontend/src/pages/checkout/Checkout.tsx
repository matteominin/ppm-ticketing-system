import { useParams, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { apiFetch } from "../../apiClient";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const initialQuantity = parseInt(query.get("quantity") || "1");
    const initialName = query.get("name") || "";
    const initialSurname = query.get("surname") || "";

    const [quantity, setQuantity] = useState(initialQuantity);
    const [name, setName] = useState(initialName);
    const [surname, setSurname] = useState(initialSurname);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        if (!eventId) {
            setError("Event ID is required.");
            return;
        }

        const fetchEventDetails = async () => {
            try {
                const res = await apiFetch(`${API_URL}/events/${eventId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch event details");
                }
                const data = await res.json();
                if (data.available_tickets === 0) {
                    setError("This event is sold out.");
                }
                setPrice(data.price);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };

        fetchEventDetails();
    }, [eventId]);


    const handleSubmit = async () => {
        if (quantity < 1) {
            setError("Quantity must be at least 1.");
            return;
        }

        if (!name.trim() || !surname.trim()) {
            setError("Please enter your name and surname.");
            return;
        }

        if (!cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
            setError("Please enter all card details.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await apiFetch(`${API_URL}/checkout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    event_id: eventId,
                    quantity,
                    name: name.trim(),
                    surname: surname.trim(),
                    card_number: cardNumber.trim(),
                    expiry: expiry.trim(),
                    cvc: cvc.trim(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error || "Payment or reservation failed");
            }

            navigate("/reservations", {
                state: { success: true, message: "Payment successful! Your reservation has been made." }
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Checkout</h2>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Surname</label>
                <input
                    type="text"
                    className="form-control"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    min="1"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </div>
            <hr />
            <h5>Card Details</h5>
            <div className="mb-3">
                <label className="form-label">Card Number</label>
                <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    onChange={(e) => setCardNumber(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Expiry (MM/YY)</label>
                <input
                    type="text"
                    className="form-control"
                    value={expiry}
                    maxLength={5}
                    placeholder="MM/YY"
                    onChange={(e) => setExpiry(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">CVC</label>
                <input
                    type="text"
                    className="form-control"
                    value={cvc}
                    maxLength={4}
                    placeholder="CVC"
                    onChange={(e) => setCvc(e.target.value)}
                />
            </div>

            {quantity > 0 && (
                <div className="mb-3">
                    <strong>Total:</strong> €{price !== null ? (price * quantity).toFixed(2) : "--"}
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading || quantity < 1}
            >
                {loading ? "Processing..." : "Pay and Reserve"}
            </button>
        </div>
    );
};

export default Checkout;
