import { Link, Route, Routes } from "react-router-dom";
import Image from "./image/image";
import Streaming from "./streaming/streaming";

function App() {
  return (
    <>
      <div className="app" style={{ height: "100vh" }}>
        <Routes>
          <Route path="/" element={<Image />} />
          <Route path="/streaming" element={<Streaming />} />
        </Routes>
        <div style={{ position: "fixed", bottom: 15, right: 15 }}>
          <Link
            to={"https://github.com/khoavutri/emotion-detection"}
            target="_blank"
          >
            Github
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;
