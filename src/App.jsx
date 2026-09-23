import { lazy, Suspense } from "react";
import "./styles/App.css";
import Searchbar from "./components/Searchbar";
import Footer from "./components/Footer";

// Ruta "escondida" para agregar palabras — cámbiala por la que quieras,
// nadie la va a adivinar por accidente. Ya no depende de process.env (eso
// era lo que rompía en tu setup).
const ADMIN_PATH = "/panel-palabra-x7k2p9";

// Se carga como chunk aparte (code-splitting): el componente no viaja dentro
// del bundle principal, así que alguien inspeccionando main.js no lo ve a
// simple vista.
const AddWord = lazy(() => import("./components/AddWord"));

function App() {
  const isAdminRoute = window.location.pathname === ADMIN_PATH;

  return (
    <div className="App background">
      {isAdminRoute ? (
        <Suspense fallback={null}>
          <AddWord />
        </Suspense>
      ) : (
        <>
          <Searchbar />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
