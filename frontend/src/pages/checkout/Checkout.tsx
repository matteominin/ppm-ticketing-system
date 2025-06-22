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
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(null);

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

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiry(e.target.value);
        setExpiry(formatted);
    };

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
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    <div className="card shadow-lg border-0">
                        {/* Header */}
                        <div className="card-header bg-primary text-white text-center py-4">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                </svg>
                                <h2 className="mb-0 fw-bold">Secure Checkout</h2>
                            </div>
                            <p className="mb-0 opacity-75">Complete your purchase securely</p>
                        </div>

                        <div className="card-body p-4 position-relative">
                            {/* Loading Overlay */}
                            {loading && (
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-95" style={{ zIndex: 1000 }}>
                                    <div className="text-center">
                                        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <h5 className="text-primary">Processing Payment...</h5>
                                        <p className="text-muted mb-0">Please wait while we process your transaction</p>
                                    </div>
                                </div>
                            )}

                            {/* Error Alert */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            {/* Personal Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3 text-primary">
                                    Personal Information
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
                                                onChange={(e) => setName(e.target.value)}
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
                                                onChange={(e) => setSurname(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3 text-primary">
                                    Order Details
                                </h5>
                                <div className="row align-items-end">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="quantity"
                                                placeholder="Quantity"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                required
                                            />
                                            <label htmlFor="quantity">Quantity</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="bg-light p-3 rounded h-100 d-flex align-items-center justify-content-between border-start border-success border-4">
                                            <span className="text-muted">Total Amount:</span>
                                            <h4 className="mb-0 text-success fw-bold">
                                                €{price !== null ? (price * quantity).toFixed(2) : "--"}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3 text-primary">
                                    Payment Information
                                </h5>

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cardNumber"
                                            placeholder="Card Number"
                                            value={cardNumber}
                                            maxLength={19}
                                            onChange={handleCardNumberChange}
                                            required
                                        />
                                        <label htmlFor="cardNumber">Card Number</label>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="expiry"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                maxLength={5}
                                                onChange={handleExpiryChange}
                                                required
                                            />
                                            <label htmlFor="expiry">Expiry Date (MM/YY)</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="cvc"
                                                placeholder="CVC"
                                                value={cvc}
                                                maxLength={4}
                                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                                required
                                            />
                                            <label htmlFor="cvc">CVC Code</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="alert alert-light border-start border-success border-4 mb-4">
                                <div className="d-flex align-items-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-success me-2">
                                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                                    </svg>
                                    <small className="text-muted mb-0">
                                        <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                                    </small>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <button
                                    className="btn btn-success btn-lg py-3 fw-bold"
                                    onClick={handleSubmit}
                                    disabled={loading || quantity < 1}
                                    style={{
                                        background: loading ? undefined : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                        border: 'none'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </span>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                            Pay €{price !== null ? (price * quantity).toFixed(2) : "--"} & Reserve
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            By completing this purchase, you agree to our terms and conditions.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;