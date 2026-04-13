export default function Navbar() {
    return (
      <div style={styles.navCard}>
        <a href="/" style={styles.link}>Home</a>
        <a href="/login" style={styles.link}>Login</a>
        <a href="/products" style={styles.link}>Products</a>
        <a href="/cart" style={styles.link}>Orders</a>
      </div>
    );
  }
  
  const styles = {
    navCard: {
      position: "absolute",
      top: "70px",
      right: "30px",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      minWidth: "180px",
      zIndex: 3,
      alignItems: "flex-start", // FIX
    },
  
    link: {
      textDecoration: "none",
      color: "#106516",
      fontWeight: "500",
      textAlign: "left",
    },
  };