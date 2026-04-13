import { useState, useEffect } from "react";
import Header from "./Header";

export default function ProducerPage() {
  const producerId = 1;

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    amount_per_sale: "",
    image: "",
  });

  // ---- FETCH ----
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    const data = await res.json();

    setProducts(data.filter(p => p.producer_id === producerId));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---- ADD (OPTIMISTIC + SAFE) ----
  const handleAdd = async () => {
    const newProduct = {
      ...form,
      producer_id: producerId,
    };

    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    const created = await res.json();

    // 🔥 instant UI update (no waiting for refetch)
    setProducts(prev => [
      ...prev,
      { id: created.id, ...newProduct },
    ]);

    // reset form
    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      amount_per_sale: "",
      image: "",
    });
  };

  // ---- DELETE (OPTIMISTIC REMOVE) ----
  const handleDelete = async (id) => {
    // remove immediately from UI
    setProducts(prev => prev.filter(p => p.id !== id));

    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        {/* FORM */}
        <div style={styles.formCard}>
          <h2>Add New Product</h2>

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
          />

          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />

          <input
            placeholder="Amount per sale"
            type="number"
            value={form.amount_per_sale}
            onChange={e =>
              setForm({ ...form, amount_per_sale: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button onClick={handleAdd}>Add Product</button>
        </div>

        {/* LIST */}
        <div style={styles.list}>
          <h2>Your Products</h2>

          {products.map(p => (
            <div key={p.id} style={styles.productCard}>
              <img src={p.image} style={styles.image} />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "18px", margin: 0 }}>
                  {p.name}
                </h3>

                <p style={{ fontSize: "16px" }}>
                  £{p.price}
                </p>

                <p style={{ fontSize: "15px", color: "#666" }}>
                  Stock: {p.stock}
                </p>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(p.id)}
              >
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
    gridTemplateColumns: "1fr 1.3fr",
    gap: "20px",
    padding: "20px",
  },
  formCard: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
  },
  list: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
  },
  productCard: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    padding: "12px 0",
  },
  image: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  deleteBtn: {
    padding: "6px 10px",
    fontSize: "13px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};