import { useState, useEffect } from "react";
import FirstStartUp from "./pages/FirstStartUp";
import Spinner from "./components/Spinner/Spinner";
import Background from "./components/Background/Background";
import AnimatedRoutes from "./AnimatedRoutes";

import "./style.css";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [data, setData] = useState(null); // Initialize as null to indicate loading state

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000");
      setData(res.data[0].isFirstStartUp);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show loading state or nothing while data is being fetched
  if (data === null) {
    return (
      <Router>
        <Background />
        <Spinner />
      </Router>
    );
  }

  return (
    <Router>
      <Background />
      {data ? <FirstStartUp /> : <AnimatedRoutes />}
    </Router>
  );
};

export default App;
