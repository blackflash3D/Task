import { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomePage() {
  const [showNav, setShowNav] = useState(false);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <Header toggleNav={() => setShowNav(!showNav)} />

      {/* FLOATING NAVBAR */}
      {showNav && <Navbar />}

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.overlay}>
          <h3 style={styles.heroTitle}>
            Fresh fruits, vegetables and much more.
          </h3>
          <p style={styles.heroText}>
            We are the best close to home
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
    },
    
hero: {
  flex: 1,
  position: "relative",
  display: "flex",
  justifyContent: "center",   
  alignItems: "center",
  backgroundImage: "url('')", // direct image
  backgroundSize: "cover",
  backgroundPosition: "center",
},
    overlay: {
        color: "grey",
        padding: "40px",
        borderRadius: "12px",
        textAlign: "center",
        maxWidth: "600px",
    },

    heroTitle: {
        fontSize: "24px",
        marginBottom: "15px",
    },

    heroText: {
        fontSize: "12px",
    },
};