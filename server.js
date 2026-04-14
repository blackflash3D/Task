// ================= SERVER =================
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;
const SECRET = "mysecretkey123";

app.use(cors());
app.use(bodyParser.json());

// ================= DB =================
const db = new sqlite3.Database("./glh.db");

// ================= TABLES =================
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producer_id INTEGER,
      image TEXT,
      name TEXT,
      price REAL,
      stock INTEGER,
      amount_per_sale INTEGER,
      description TEXT,
      is_out_of_stock INTEGER DEFAULT 0,
      FOREIGN KEY (producer_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_price REAL,
      date TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER
    )
  `);
});

// ================= AUTH =================
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).send("Missing fields");

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashed, role],
    function (err) {
      if (err) return res.status(400).send(err.message);

      const token = jwt.sign({ id: this.lastID, role }, SECRET);
      res.json({ token, role });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token, role: user.role, userId: user.id });
  });
});

// ================= PRODUCTS =================

// GET ALL (LIVE FEED SOURCE)
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(400).send(err.message);
    res.json(rows);
  });
});

// CREATE PRODUCT
app.post("/products", (req, res) => {
  const {
    producer_id,
    image,
    name,
    price,
    stock,
    amount_per_sale,
    description
  } = req.body;

  db.run(
    `INSERT INTO products 
    (producer_id, image, name, price, stock, amount_per_sale, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [producer_id, image, name, price, stock, amount_per_sale, description],
    function (err) {
      if (err) return res.status(400).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE PRODUCT
app.put("/products/:id", (req, res) => {
  const {
    image,
    name,
    price,
    stock,
    amount_per_sale,
    description
  } = req.body;

  db.run(
    `UPDATE products
     SET image=?, name=?, price=?, stock=?, amount_per_sale=?, description=?
     WHERE id=?`,
    [image, name, price, stock, amount_per_sale, description, req.params.id],
    (err) => {
      if (err) return res.status(400).send(err.message);
      res.sendStatus(200);
    }
  );
});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(400).send(err.message);
    res.sendStatus(200);
  });
});

// TOGGLE STOCK STATUS
app.patch("/products/:id/stock", (req, res) => {
  db.run(
    "UPDATE products SET is_out_of_stock = NOT is_out_of_stock WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(400).send(err.message);
      res.sendStatus(200);
    }
  );
});

// ================= START =================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});