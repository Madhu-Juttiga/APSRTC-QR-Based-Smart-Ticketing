import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkFreeTicket } from "../services/api";
import GlassCard from "../components/GlassCard";

export default function FreeTicket({ onValid, onLimitReached }) {
  const qrInstanceRef = useRef(null);
  const isProcessingRef = useRef(false);
  const beepRef = useRef(null);

  const [message, setMessage] = useState("Starting camera...");
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 🔔 Load beep sound ONCE
    beepRef.current = new Audio("/beep.mp3");

    const startCamera = async () => {
      try {
        await new Promise((r) => setTimeout(r, 150));

        const container = document.getElementById("qr-reader");
        if (!container || !isMounted) return;

        container.innerHTML = "";

        const scanner = new Html5Qrcode("qr-reader");
        qrInstanceRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 220 },
          async (decodedText) => {
            // 🔒 prevent multiple triggers
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;

            // 🔔 PLAY BEEP (QR detected)
            try {
              beepRef.current.currentTime = 0;
              beepRef.current.play();
            } catch {
              // ignore autoplay errors
            }

            setMessage("Validating ticket...");

            try {
              await scanner.stop();
              scanner.clear();
            } catch {}

            try {
              const res = await checkFreeTicket(decodedText);

              // ✅ FREE ALLOWED
              if (res.allowed) {
                onValid(decodedText);
                return;
              }

              // 🚨 LIMIT REACHED
              setShowLimitModal(true);
            } catch (err) {
              console.error(err);
              isProcessingRef.current = false;
              setMessage("Validation failed. Try again.");
            }
          }
        );

        setMessage("Scanning QR Code...");
      } catch (err) {
        console.error("Camera error:", err);
        setMessage("Camera permission denied or unavailable");
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      isProcessingRef.current = false;

      try {
        if (qrInstanceRef.current) {
          qrInstanceRef.current.stop();
          qrInstanceRef.current.clear();
          qrInstanceRef.current = null;
        }
      } catch {}
    };
  }, [onValid]);

  return (
    <>
      <GlassCard className="free-ticket-screen">
        <h3>Scan QR Code</h3>

        <div className="qr-wrapper">
          <div id="qr-reader" className="qr-reader"></div>
        </div>

        <p>{message}</p>
      </GlassCard>

      {/* 🔥 IN-APP MODAL */}
      {showLimitModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Free Ticket Limit Reached</h3>
            <p>Please take a normal ticket to continue.</p>

            <button
              className="glass-btn"
              onClick={() => {
                setShowLimitModal(false);
                onLimitReached();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
