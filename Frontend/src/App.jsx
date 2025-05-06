import Appbar from "./components/Appbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <Appbar/>
      <Outlet/>
    </div>
  )
}

export default App;
