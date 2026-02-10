import jsPDF from "jspdf";

export const generateTicketPDF = (ticket) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 160], 
  });

  const pageWidth = 80;
  const pageHeight = 160;
  const centerX = pageWidth / 2;
  const leftX = 8;
  const rightX = 72;
  let y = 10;

  /* ===== BACKGROUND ===== */
  // Set fill color to a nice ticket-blue (RGB)
  doc.setFillColor(30, 144, 255); // DodgerBlue
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Set text color to white for contrast against blue background
  doc.setTextColor(255, 255, 255);
  // Set line color to white
  doc.setDrawColor(255, 255, 255);

  /* ===== HEADER ===== */
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  doc.text("APSRTC", centerX, y, { align: "center" });

  y += 6;
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text("QR-Based Smart Ticketing", centerX, y, { align: "center" });

  y += 4;
  doc.line(leftX, y, rightX, y);

  /* ===== ROUTE ===== */
  y += 8;
  doc.setFontSize(10);

  const from = ticket.from || ticket.source || ticket.boarding || "-";
  const to = ticket.to || ticket.destination || "-";

  doc.text(`FROM : ${from}`, leftX, y);
  y += 6;
  doc.text(`TO   : ${to}`, leftX, y);

  /* ===== FARE (No Background Highlight) ===== */
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14); // Made slightly larger for visibility
  const fareValue = Number(ticket.fare || 0).toFixed(2);
  doc.text(`Fare : Rs. ${fareValue}`, leftX, y);

  /* ===== META INFO ===== */
  y += 12;
  doc.setFont("courier", "normal");
  doc.setFontSize(9);

  const ticketId = `ST-${ticket.id || Date.now()}`;
  doc.text(`Ticket ID   : ${ticketId}`, leftX, y);

  y += 6;
  const dateTime = new Date(ticket.created_at || Date.now()).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(/,/g, "");

  doc.text(`Date & Time : ${dateTime}`, leftX, y);

  y += 6;
  doc.text(`Type        : ${ticket.ticket_type || "NORMAL"}`, leftX, y);

  /* ===== FOOTER ===== */
  y += 12;
  doc.line(leftX, y, rightX, y);

  y += 8;
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.text("Thank you • Safe Journey", centerX, y, { align: "center" });

  y += 6;
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text("Regards", centerX, y, { align: "center" });

  y += 5;
  doc.text("Developer Madhu J", centerX, y, { align: "center" });

  /* ===== OUTPUT ===== */
  doc.autoPrint();
  const blob = doc.output("bloburl");
  window.open(blob, "_blank");
};