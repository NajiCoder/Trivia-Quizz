import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Quizz from "./components/Quizz";

function App() {
  return (
    <main className="bg-mainBg">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quizz" element={<Quizz />} />
      </Routes>
    </main>
  );
}

export default App;
