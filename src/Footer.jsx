export default function Footer() {
    return (
      <footer style={styles.footer}>
        © 2026 Greenfield Local Hub. All rights reserved.
      </footer>
    );
  }
  
  const styles = {
    footer: {
      backgroundColor: "#106516", // matches header
      color: "white",
      textAlign: "center",
      padding: "15px",
      fontSize: "14px",
    },
  };