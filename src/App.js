import { useState, useEffect } from "react";
import FirstStartUp from "./pages/FirstStartUp";
import Home from "./pages/Home";
import Background from "./components/Background/Background";
import CourseCategories from "./pages/CourseCategories";
import "./style.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  python,
  rails,
  javascript,
  node,
  mongodb,
  php,
  webdev,
} from "./assets";

function App() {
  const [data, setData] = useState(Boolean);
  const fetchData = async () => {
    const res = await axios.get("http://192.168.1.34:5000");
    setData(res.data[0].isFirstStartUp);
  };
  const cardData = [
    { imgsrc: python, info: "Master Python in 30 Days" },
    { imgsrc: rails, info: "Building Scalable Web Apps with Ruby on Rails" },
    { imgsrc: node, info: "Node For Beginners" },
    { imgsrc: php, info: "PHP Fundamentals: Web Development with PHP" },
    { imgsrc: javascript, info: "JavaScript: From Basics to Advanced" },
    { imgsrc: mongodb, info: "Mastering MongoDB for Developers" },
    { imgsrc: webdev, info: "Mastering MongoDB for Developers" },
  ];
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
            <Route
              path="/courses"
              element={
                <CourseCategories name={"COURSES"} cardData={cardData} />
              }
            />
            <Route
              path="/web"
              element={<CourseCategories name={"WEB"} cardData={cardData} />}
            />
            <Route
              path="/mobile"
              element={<CourseCategories name={"MOBILE"} cardData={cardData} />}
            />
            <Route
              path="/finance"
              element={
                <CourseCategories name={"FINANCE"} cardData={cardData} />
              }
            />
            <Route
              path="/health"
              element={<CourseCategories name={"HEALTH"} cardData={cardData} />}
            />
            <Route
              path="/business"
              element={
                <CourseCategories name={"BUSINESS"} cardData={cardData} />
              }
            />
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
