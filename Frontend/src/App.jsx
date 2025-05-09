import Appbar from "./components/Appbar";
import Appbar_Guest from "./components/Appbar_Guest";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isGuestRoute = location.pathname.startsWith("/guest");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {isGuestRoute ? <Appbar_Guest /> : <Appbar />}
      <div style={{ alignSelf: "center", flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
