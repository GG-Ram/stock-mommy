import { Routes, Route, Link, useParams } from "react-router-dom";
import MarketPage from "./pages/marketPage/MarketPage.jsx";
import Navbar from "./components/NavBar/Navbar";
import ShopPage from "./pages/ShopPage/ShopPage";
import "./app.css";

function Home() {
  return <h2>Home Page ✅</h2>;
}

function About() {
  return <h2>About Page ✅</h2>;
}

function User() {
  let { name } = useParams();
  return <h2>Hello, {name}! ✅</h2>;
}

function App() {
  return (
    <div style={{ padding: 20 }}>
      {/* Routes */}
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/avatar" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
