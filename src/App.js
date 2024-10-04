import { useState, useEffect } from "react";
import FirstStartUp from "./components/FirstStartUp";
import Home from "./components/Home";
import Background from "./components/Background";
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

  if (data) {
    return <FirstStartUp />;
  } else {
    return (
      <>
        <Background />
        <Home />
      </>
    );
  }
}

export default App;
