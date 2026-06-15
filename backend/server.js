reuire("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// ✅ GET all leads
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// ✅ ADD new lead
app.post("/leads", async (req, res) => {
  try {
    const { name, phone, source, status } = req.body;

    const result = await pool.query(
      "INSERT INTO leads(name, phone, source, status) VALUES($1,$2,$3,$4) RETURNING *",
      [name, phone, source, status]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// ✅ UPDATE (edit full lead OR only status)
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, source, status } = req.body;

    // If only status is sent
    if (!name && !phone && !source) {
      await pool.query(
        "UPDATE leads SET status=$1 WHERE id=$2",
        [status, id]
      );
    } else {
      // Full update
      await pool.query(
        "UPDATE leads SET name=$1, phone=$2, source=$3, status=$4 WHERE id=$5",
        [name, phone, source, status, id]
      );
    }

    res.json({ message: "Lead Updated Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// ✅ DELETE lead
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM leads WHERE id=$1", [id]);

    res.json({ message: "Lead Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// Server start
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});