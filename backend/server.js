require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// ✅ CORS FIX (important for Vercel frontend)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ✅ DB CONNECTION (Neon safe config)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// ✅ TEST DB CONNECTION ON START
pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ DB connection error:", err.message));

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Lead Management Backend is Running!");
});

// GET ALL LEADS
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err.message);
    res.status(500).json({ error: "Database Error" });
  }
});

// ADD LEAD (FIXED + DEBUGGED)
app.post("/leads", async (req, res) => {
  try {
    console.log("📩 Incoming Data:", req.body);

    const { name, phone, source, status } = req.body;

    // strict validation
    if (!name || !phone) {
      return res.status(400).json({
        error: "Name and phone are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO leads (name, phone, source, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name,
        phone,
        source ?? "Call",
        status ?? "Interested",
      ]
    );

    console.log("✅ Inserted Row:", result.rows[0]);

    return res.status(201).json({
      message: "Lead added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ POST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE LEAD
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, source, status } = req.body;

    const result = await pool.query(
      `UPDATE leads
       SET name=$1, phone=$2, source=$3, status=$4
       WHERE id=$5
       RETURNING *`,
      [name, phone, source, status, id]
    );

    res.json({
      message: "Lead updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ error: "Database Error" });
  }
});

// DELETE LEAD
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM leads WHERE id=$1", [id]);

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ error: "Database Error" });
  }
});

// CREATE TABLE
app.get("/create-table", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        source TEXT DEFAULT 'Call',
        status TEXT DEFAULT 'Interested'
      );
    `);

    res.send("Table created successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error creating table");
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});