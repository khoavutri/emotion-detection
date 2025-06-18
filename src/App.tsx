import { Link, Route, Routes } from "react-router-dom";
import Image from "./image/image";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<Image />} />
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
