const BASE = "http://localhost:5000";

export const checkFreeTicket = async (qr_value) => {
  const res = await fetch(`${BASE}/check-free-ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qr_value })
  });
  return res.json();
};

export const createTicket = async (data) => {
  const res = await fetch(`${BASE}/create-ticket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
