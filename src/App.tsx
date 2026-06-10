import { Routes, Route } from "react-router-dom";
import { HomePage, NotFound } from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Catch-all: qualquer rota desconhecida cai na página de não encontrado. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
