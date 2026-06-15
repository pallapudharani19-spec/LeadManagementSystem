require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test Route
app.get("/", (req, res) => {
  res.send("Lead Management Backend is Running!");
});

// GET all leads
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// ADD lead
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

// UPDATE lead
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, source, status } = req.body;

    if (!name && !phone && !source) {
      await pool.query(
        "UPDATE leads SET status=$1 WHERE id=$2",
        [status, id]
      );
    } else {
      await pool.query(
        "UPDATE leads SET name=$1, phone=$2, source=$3, status=$4 WHERE id=$5",
        [name, phone, source, status, id]
      );
    }

    res.json({ message: "Lead updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// DELETE lead
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM leads WHERE id=$1",
      [id]
    );

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.get("/create-table", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT,
        phone TEXT,
        source TEXT,
        status TEXT
      );
    `);

    res.send("Table created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating table");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});