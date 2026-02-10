import { useState } from "react";
import Home from "./pages/Home";
import FreeTicket from "./pages/FreeTicket";
import RouteSelect from "./pages/RouteSelect";
import NormalTicket from "./pages/NormalTicket";
import "./App.css";

const SCREENS = {
  HOME: "HOME",
  FREE: "FREE",
  ROUTE_FREE: "ROUTE_FREE",
  NORMAL: "NORMAL",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [history, setHistory] = useState([]);
  const [qrValue, setQrValue] = useState("");

  const navigate = (next) => {
    if (next === screen) return; // prevent duplicate history
    setHistory((h) => [...h, screen]);
    setScreen(next);
  };

  const goBack = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setScreen(prev);
  };

  const goHome = () => {
    setHistory([]);
    setScreen(SCREENS.HOME);
  };

  return (
    <div className="app-bg">
      {history.length > 0 && (
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>
      )}

      {screen === SCREENS.HOME && (
        <Home
          onFree={() => navigate(SCREENS.FREE)}
          onNormal={() => navigate(SCREENS.NORMAL)}
        />
      )}

      {/* ✅ FREE TICKET FLOW */}
      {screen === SCREENS.FREE && (
        <FreeTicket
          key={screen} // camera remount
          onValid={(qr) => {
            setQrValue(qr);
            navigate(SCREENS.ROUTE_FREE);
          }}
          onLimitReached={() => {
            navigate(SCREENS.NORMAL); // 🔥 redirect after popup OK
          }}
        />
      )}

      {/* ✅ FREE → ROUTE SELECT */}
      {screen === SCREENS.ROUTE_FREE && (
        <RouteSelect
          ticketType="FREE"
          qrValue={qrValue}
          onDone={goHome}
        />
      )}

      {/* ✅ NORMAL TICKET FLOW */}
      {screen === SCREENS.NORMAL && (
        <NormalTicket onDone={goHome} />
      )}
    </div>
  );
}
