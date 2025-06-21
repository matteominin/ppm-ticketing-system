import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./pages/login/Login"
import SignUp from "./pages/signup/SignUp"
import Home from "./pages/home/Home"
import EventDetails from "./pages/eventDetails/EventDetails"
import Reservations from "./pages/reservations/Reservations"
import Checkout from "./pages/checkout/Checkout"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/checkout/:eventId" element={<Checkout />} />
          <Route path="/success" element={<div className="container mt-4"><h2>Payment Successful!</h2></div>} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
