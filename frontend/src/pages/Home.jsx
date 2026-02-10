import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";

export default function Home({ onFree, onNormal }) {

  // 🖨 Connect Printer (Wi-Fi / Network / USB)
  const handleConnectPrinter = () => {
    window.print(); // browser printer selection
    localStorage.setItem("printerReady", "true");
  };

  return (
    <>
      {/* TOP RIGHT CONNECT PRINTER */}
      <button className="printer-btn" onClick={handleConnectPrinter}>
        🖨 Connect Printer
      </button>

      <GlassCard>
        <h2>APSRTC Smart Ticket</h2>
        <p>Eluru → Rajahmundry</p>

        <GlassButton text="Free Ticket" onClick={onFree} />
        <GlassButton
          text="Normal Ticket"
          onClick={onNormal}
          type="secondary"
        />
      </GlassCard>
    </>
  );
}
