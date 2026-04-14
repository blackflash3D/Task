import { useState, useEffect } from "react";
import Header from "./Header";

const API = "http://localhost:5000";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(setProducts);
  };

  // LIVE FEED
  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 3000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header />

      {/* SEARCH BAR (CENTERED) */}
      <div style={styles.searchWrap}>
        <div style={styles.searchBox}>
          🔍
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={styles.grid}>
        {filtered.map(p => (
          <div key={p.id} style={styles.card} onClick={() => setSelected(p)}>
            <img src={p.image} style={styles.image} />
            <h3>{p.name}</h3>
            <p>£{p.price}</p>
            {p.is_out_of_stock ? <span>OUT OF STOCK</span> : null}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} style={styles.modalImage} />
            <h2>{selected.name}</h2>
            <p>£{selected.price}</p>
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
  searchWrap: {
    display: "flex",
    justifyContent: "center",
    padding: "15px"
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    padding: "5px 10px",
    borderRadius: "20px",
    width: "300px"
  },
  searchInput: {
    border: "none",
    outline: "none",
    marginLeft: "8px",
    width: "100%"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
    gap: "20px",
    padding: "20px"
  },
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    cursor: "pointer"
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#fff",
    padding: "20px",
    width: "350px"
  },
  modalImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover"
  }
};