import { Routes, Route, Link, useParams } from "react-router-dom";
import MarketPage from "./pages/marketPage/MarketPage.jsx";
import Navbar from "./components/NavBar/Navbar";
import ShopPage from "./pages/ShopPage/ShopPage";
import { UserProvider } from "./Hooks/userContext.jsx";
import Portfolio from "./pages/Portfolio/Portfolio.jsx";
import AvatarPage from './pages/AvatarPage/AvatarPage.jsx';
import "./app.css";



function App() {
  return (
    <div style={{ padding: 20 }}>
      {/* Routes */}
      <UserProvider>
      <Navbar/>
      
      <Routes>
        <Route path="/market" element={<MarketPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/Portfolio" element={<Portfolio />} />
      </Routes>
     </UserProvider>
    </div>
  );
}

export default App;
