import { useState, useEffect } from "react";
import FirstStartUp from "./pages/FirstStartUp";
import Home from "./pages/Home";
import Background from "./components/Background/Background";
import Courses from "./pages/Courses";
import "./style.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  const [data, setData] = useState(Boolean);
  const fetchData = async () => {
    const res = await axios.get("http://192.168.1.34:5000");
    setData(res.data[0].isFirstStartUp);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data) {
    return <FirstStartUp />;
  } else {
    return (
      <>
        <Router>
          <Background />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
