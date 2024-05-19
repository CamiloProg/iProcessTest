import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import Pagos from "./components/Pagos/Pagos";
import { EditProvider } from "./context/EditContext";

function App() {
  return (
    <EditProvider>
      <NavBar />
      <Pagos total={182} />
    </EditProvider>
  );
}

export default App;
