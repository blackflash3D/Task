import { useState, useEffect } from "react";
import Header from "./Header";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePay = () => {
    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ user_id:1, items:cart, total_price:total })
    }).then(() => {
      localStorage.removeItem("cart");
      setCart([]);
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2>Cart</h2>

        {cart.map(i => (
          <div key={i.id}>
            {i.name} x {i.quantity} - £{i.price}
          </div>
        ))}

        <h3>Total: £{total.toFixed(2)}</h3>

        <button onClick={handlePay}>Pay</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.4)"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px"
  }
};