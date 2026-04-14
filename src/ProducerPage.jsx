import { useState, useEffect } from "react";
import Header from "./Header";

export default function ProducerPage() {
  const producerId = 1;

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    image: "",
    name: "",
    price: "",
    stock: "",
    amount_per_sale: "",
    description: "",
  });

  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data =>
        setProducts(data.filter(p => p.producer_id === producerId))
      );
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 2000); // LIVE FEED
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async () => {
    await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        producer_id: producerId,
      }),
    });

    setForm({
      image: "",
      name: "",
      price: "",
      stock: "",
      amount_per_sale: "",
      description: "",
    });

    fetchProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  const toggleStock = async (p) => {
    await fetch(`http://localhost:5000/products/${p.id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_stock: p.in_stock ? 0 : 1 }),
    });

    fetchProducts();
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>

        {/* FORM */}
        <div style={styles.form}>
          <h2>Add Product</h2>

          <input placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
          />

          <input placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <input placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />

          <input placeholder="Amount per sale"
            type="number"
            value={form.amount_per_sale}
            onChange={e => setForm({ ...form, amount_per_sale: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ height: "150px" }}
          />

          <button onClick={handleAdd}>Add Product</button>
        </div>

        {/* PRODUCT LIST */}
        <div style={styles.list}>
          <h2>Your Products</h2>

          {products.map(p => (
            <div key={p.id} style={styles.card}>
              <img src={p.image} style={styles.img} />

              <div style={{ flex: 1 }}>
                <h3>{p.name}</h3>
                <p>£{p.price}</p>
                <p>{p.stock} stock</p>
                <p>Status: {p.in_stock ? "Active" : "Out of stock"}</p>
              </div>

              <button onClick={() => toggleStock(p)}>
                Toggle Stock
              </button>

              <button onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "sans-serif" },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "20px",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #ddd",
    padding: "20px",
  },
  list: {
    border: "1px solid #ddd",
    padding: "20px",
  },
  card: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },
  img: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
  },
};