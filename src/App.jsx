import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import Pagos from "./components/Pagos/Pagos";

function App() {
  return (
    <>
      <NavBar />
      <Pagos total={182} />
    </>
  );
}

export default App;
