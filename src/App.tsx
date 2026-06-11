import { Routes, Route } from "react-router-dom";
import { HomePage, NotFound } from "./pages";

function App() {
  return (
    <Routes>
      {/* Loja pelo slug no path (ex.: /shanttcabeleireiros). */}
      <Route path="/:slug" element={<HomePage />} />
      {/* Raiz (sem slug) e qualquer rota desconhecida caem na página 404. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
