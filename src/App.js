import { useState, useEffect } from "react";
import FirstStartUp from "./pages/FirstStartUp";

import Background from "./components/Background/Background";
import AnimatedRoutes from "./AnimatedRoutes";

import "./style.css";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [data, setData] = useState(Boolean);
  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000");
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
          <AnimatedRoutes />
        </Router>
      </>
    );
  }
};

export default App;
