const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// =============================
// TEST API
// =============================
app.get("/", (req, res) => {
  res.send("QR Ticketing Backend is running");
});

// =============================
// API 1: CHECK FREE TICKET LIMIT
// =============================
app.post("/check-free-ticket", async (req, res) => {
  try {
    const { qr_value } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const result = await pool.query(
      "SELECT * FROM qr_daily_usage WHERE qr_value = $1 AND usage_date = $2",
      [qr_value, today]
    );

    // First time scan today
    if (result.rows.length === 0) {
      await pool.query(
        "INSERT INTO qr_daily_usage (qr_value, usage_date, trip_count) VALUES ($1, $2, 1)",
        [qr_value, today]
      );

      return res.json({
        allowed: true,
        count: 1,
        message: "Free ticket allowed (1/4)"
      });
    }

    const currentCount = result.rows[0].trip_count;

    if (currentCount < 4) {
      await pool.query(
        "UPDATE qr_daily_usage SET trip_count = trip_count + 1 WHERE qr_value = $1 AND usage_date = $2",
        [qr_value, today]
      );

      return res.json({
        allowed: true,
        count: currentCount + 1,
        message: `Free ticket allowed (${currentCount + 1}/4)`
      });
    }

    // Limit reached
    return res.json({
      allowed: false,
      count: currentCount,
      message: "Free ticket limit reached. Please take normal ticket."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// API 2: CREATE TICKET
// =============================
app.post("/create-ticket", async (req, res) => {
  try {
    const { ticket_type, fare, source, destination, qr_value } = req.body;

    const result = await pool.query(
      `INSERT INTO tickets (ticket_type, fare, source, destination, qr_value)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [ticket_type, fare, source, destination, qr_value]
    );

    res.json({
      success: true,
      ticket: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// =============================
// API 3: GET ALL TICKETS
// =============================
app.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tickets ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// =============================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
