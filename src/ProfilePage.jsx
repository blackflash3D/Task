import { useEffect, useState } from "react";
import Header from "./Header";

export default function ProfilePage({ token }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You are not logged in");
      return;
    }

    fetch("http://localhost:5000/profile", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUser)
      .catch(() => setError("Access denied"));
  }, [token]);

  if (error) return <><Header token={token}/><h2>{error}</h2></>;
  if (!user) return <><Header token={token}/><h2>Loading...</h2></>;

  return (
    <div>
      <Header token={token} />

      <div style={styles.card}>
        <h2>Profile</h2>

        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>

        <hr />

        <h3>Loyalty Points</h3>
        <p>{user.loyalty_points || 0}</p>
      </div>
    </div>
  );
}

const styles = {
  card:{
    maxWidth:500,
    margin:"50px auto",
    padding:20,
    border:"1px solid #ddd",
    borderRadius:10
  }
};