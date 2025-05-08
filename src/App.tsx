import { useState } from "react";
import ComponenteClientes from "./componentes/ComponenteClientes";
import ComponenteParqueo from "./componentes/ComponenteParqueos";
import ComponentePagos from "./componentes/ComponentePagos";
import ComponenteMultas from "./componentes/componenteMultas";
import ComponenteInicio from "./componentes/componenteInicio";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState(""); // Sin pestaña activa

  const renderContent = () => {
    switch (activeTab) {
      case "Parqueos":
        return <ComponenteParqueo />;
      case "Multas":
        return <ComponenteMultas />;
      case "Clientes":
        return <ComponenteClientes />;
      case "Pagos":
        return <ComponentePagos />;
      default:
        return <ComponenteInicio />; // Pantalla de inicio
    }
  };

  return (
    <div className="container">
      <h1>PARQUEO-UMG</h1>
      <div className="tabs">
        {["Parqueos", "Multas", "Clientes", "Pagos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="content-box">{renderContent()}</div>
    </div>
  );
};

export default App;
