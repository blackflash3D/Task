import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header toggleNav={() => {}} />

      <div style={{ padding: "20px" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />

        <div style={styles.grid}>
          {filtered.map(p => (
            <div key={p.id} style={styles.card} onClick={() => setSelected(p)}>
              <img src={p.image} style={styles.image} />
              <h3>{p.name}</h3>
              <p>£{p.price} / {p.amount_per_sale}</p>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <img src={selected.image} style={styles.modalImage} />
            <h2>{selected.name}</h2>
            <p>£{selected.price} per {selected.amount_per_sale}</p>
            <p>Stock: {selected.stock}</p>
            <p>{selected.description}</p>

            <button onClick={() => addToCart(selected)}>
              Add to Cart
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

const styles = {
  grid: { display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" },
  card: { border: "1px solid #ccc", padding: "10px", cursor: "pointer" },
  image: { width: "100%", height: "150px", objectFit: "cover" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: "20px", borderRadius: "10px", width: "300px" },
  modalImage: { width: "100%", height: "200px", objectFit: "cover" }
};