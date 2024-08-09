import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideosList from "./components/VideosList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideosList />} />
      </Routes>
    </Router>
  );
}

export default App;

