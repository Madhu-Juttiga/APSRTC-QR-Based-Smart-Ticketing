import { useState } from "react";
import { ROUTE } from "../utils/routeData";
import { createTicket } from "../services/api";
import { generateTicketPDF } from "../utils/pdfGenerator";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";

export default function RouteSelect({ ticketType, qrValue, onDone }) {
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  const handleGenerate = async () => {
    if (!boarding) return;

    setLoading(true);
    const response = await createTicket({
      ticket_type: ticketType,
      source: boarding.name,
      destination: ROUTE.destination,
      fare: ticketType === "FREE" ? 0 : boarding.fare,
      qr_value: ticketType === "FREE" ? qrValue : null,
    });

    if (response?.ticket) {
      generateTicketPDF(response.ticket);
    }

    onDone();
    setLoading(false);
  };

  return (
    <>
      <GlassCard className="route-screen">
        <h2 className="route-title">Journey Details</h2>

        {/* ROUTE HEADER */}
        <div className="route-header">
          <div className="route-city">
            <span>From</span>
            <strong>Eluru</strong>
          </div>
          <div className="route-arrow">→</div>
          <div className="route-city">
            <span>To</span>
            <strong>{ROUTE.destination}</strong>
          </div>
        </div>

        {/* BOARDING PICKER */}
        <div className="form-group">
          <label>Choose Boarding Point</label>
          <button
            className="boarding-btn"
            onClick={() => setShowSheet(true)}
          >
            {boarding ? boarding.name : "Select a city"}
          </button>
        </div>

        {/* FARE + CTA */}
        {boarding && (
          <div className="action-area">
            <div className="fare-box">
              Fare
              <span>₹{ticketType === "FREE" ? 0 : boarding.fare}</span>
            </div>

            <GlassButton
              text={loading ? "Generating Ticket..." : "Generate Ticket"}
              onClick={handleGenerate}
              disabled={loading}
            />
          </div>
        )}
      </GlassCard>

      {/* BOTTOM SHEET */}
      {showSheet && (
        <div className="sheet-overlay" onClick={() => setShowSheet(false)}>
          <div
            className="sheet-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Select Boarding Stop</h3>

            {ROUTE.stops
              .filter((s) => s.name !== ROUTE.destination)
              .map((s) => (
                <button
                  key={s.name}
                  className="sheet-item"
                  onClick={() => {
                    setBoarding(s);
                    setShowSheet(false);
                  }}
                >
                  <span>{s.name}</span>
                  <strong>₹{s.fare}</strong>
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
