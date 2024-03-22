import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { SocketProvider } from "./providers/Socket";

function App() {
  return (
    <div className="App">
      <Routes>
        <SocketProvider>
          <Route path="/" element={<HomePage />} />
        </SocketProvider>
      </Routes>
    </div>
  );
}

export default App;
