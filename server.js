// ---- IMPORTS ----
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ---- APP SETUP ----
const app = express();
const port = 5000;
const SECRET = "mysecretkey123"; // move to env in production

app.use(cors());
app.use(bodyParser.json());

// ---- DATABASE ----
const db = new sqlite3.Database("./glh.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
});

// ---- TABLE CREATION ----
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
      name TEXT,
      price REAL,
      stock INTEGER,
      description TEXT,
      amount_per_sale INTEGER,
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
      quantity INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
});

// ---- AUTH ROUTES ----

// SIGNUP
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).send("Missing fields");
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashed, role],
      function (err) {
        if (err) return res.status(400).send(err.message);

        const token = jwt.sign(
          { id: this.lastID, role },
          SECRET
        );

        res.json({ token, role });
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err || !user) return res.status(400).send("User not found");

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).send("Wrong password");

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET
      );

      res.json({ token, role: user.role });
    }
  );
});

// ---- PRODUCT ROUTES ----

// GET ALL PRODUCTS
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(400).send(err.message);
    res.json(rows);
  });
});

// ADD PRODUCT
app.post("/products", (req, res) => {
  const {
    producer_id,
    name,
    price,
    stock,
    description,
    amount_per_sale,
    image
  } = req.body;

  db.run(
    `INSERT INTO products 
    (producer_id, name, price, stock, description, amount_per_sale, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [producer_id, name, price, stock, description, amount_per_sale, image],
    function (err) {
      if (err) return res.status(400).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE PRODUCT
app.put("/products/:id", (req, res) => {
  const {
    name,
    price,
    stock,
    description,
    amount_per_sale,
    image
  } = req.body;

  db.run(
    `UPDATE products
     SET name = ?, price = ?, stock = ?, description = ?, amount_per_sale = ?, image = ?
     WHERE id = ?`,
    [name, price, stock, description, amount_per_sale, image, req.params.id],
    function (err) {
      if (err) return res.status(400).send(err.message);
      res.sendStatus(200);
    }
  );
});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {
  db.run(
    "DELETE FROM products WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(400).send(err.message);
      res.sendStatus(200);
    }
  );
});

// ---- ORDER ROUTES ----

app.post("/orders", (req, res) => {
  const { user_id, items, total_price } = req.body;
  const date = new Date().toISOString();

  db.run(
    "INSERT INTO orders (user_id, total_price, date) VALUES (?, ?, ?)",
    [user_id, total_price, date],
    function (err) {
      if (err) return res.status(400).send(err.message);

      const orderId = this.lastID;

      items.forEach((item) => {
        db.run(
          "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
          [orderId, item.id, item.quantity]
        );
      });

      res.json({ message: "Order placed successfully" });
    }
  );
});

// ---- START SERVER ----
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});