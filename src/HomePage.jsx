import Header from "./Header";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div>
      <Header />

      <section style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div>
          <h3>Fresh fruits, vegetables and much more.</h3>
          <p>We are the best close to home</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}