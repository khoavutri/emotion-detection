import { Route, Routes } from "react-router-dom";
import Image from "./image/image";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<Image />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
