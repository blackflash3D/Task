import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login or signup
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    postcode: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Signup only
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect based on role
      if (data.role === "producer") window.location.href = "/producer";
      else window.location.href = "/";
      return;
    }

    // Login only
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      return;
    }

    // Redirect based on role
    if (data.role === "producer") window.location.href = "/producer";
    else window.location.href = "/";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "login" && (
            <>
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
            </>
          )}

          {mode === "signup" && (
            <>
              <div style={styles.row}>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  style={styles.halfInput}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  style={styles.halfInput}
                />
              </div>
              <div style={styles.row}>
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.halfInput}
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  style={styles.halfInput}
                />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={styles.input}
              />
              <div style={styles.row}>
                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  style={styles.halfInput}
                />
                <input
                  name="postcode"
                  placeholder="Postcode"
                  value={form.postcode}
                  onChange={handleChange}
                  style={styles.halfInput}
                />
              </div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select role</option>
                <option value="consumer">Consumer</option>
                <option value="producer">Producer</option>
              </select>
            </>
          )}

          <button type="submit" style={styles.button}>
            {mode === "login" ? "Login" : "Create Account"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>

        <p style={styles.switchText}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <span style={styles.link} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? " Sign up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#d4edda",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column" },
  input: { margin: "8px 0", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  halfInput: { flex: 1, margin: "8px 0", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  row: { display: "flex", gap: "10px" },
  button: { marginTop: "15px", padding: "10px", border: "none", borderRadius: "5px", backgroundColor: "#2e7d32", color: "white", cursor: "pointer", transition: "0.3s" },
  switchText: { marginTop: "15px", fontSize: "14px" },
  link: { color: "#1b5e20", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red", marginTop: "10px", fontSize: "14px" },
};