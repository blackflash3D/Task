import { useState } from "react";
import Navbar from "./Navbar";

export default function Header() {
  const [showNav, setShowNav] = useState(false);

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <h1 style={styles.logo}>Greenfield Local Hub</h1>
        <div style={styles.menuIcon} onClick={() => setShowNav(!showNav)}>
          &#9776;

        </div>

      </div>

      {showNav && <Navbar />}
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#1b5e20",
    color: "white",
    padding: "10px 20px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "18px",
  },
  menuIcon: {
    fontSize: "24px",
    cursor: "pointer",
  },
};