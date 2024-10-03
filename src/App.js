import { useState, useEffect } from "react";
import FirstStartUp from "./components/FirstStartUp";
import Home from "./components/Home";
import "./style.css";
import axios from "axios";
function App() {
  const [data, setData] = useState(Boolean);
  const fetchData = async () => {
    const res = await axios.get("http://192.168.1.34:5000");
    setData(res.data[0].isFirstStartUp);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data ? <FirstStartUp /> : <Home />;
}

export default App;
