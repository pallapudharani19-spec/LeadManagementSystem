require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 Add this here
app.get("/", (req, res) => {
  res.send("Lead Management Backend is Running!");
});

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 👇 Your existing routes start here
app.get("/leads", async (req, res) => {
  // ...
});
