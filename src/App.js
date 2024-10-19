import { useState, useEffect } from "react";
import FirstStartUp from "./pages/FirstStartUp";
import Home from "./pages/Home";
import Background from "./components/Background/Background";
import CourseCategories from "./pages/CourseCategories";
import Player from "./pages/Player";
import Categories from "./pages/Categories";
import Instructor from "./pages/Instructor";
import Settings from "./pages/Settings";
import IndividualInstrucor from "./pages/IndividualInstructor";
import IndividualCourses from "./pages/IndividualCourses";

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

const App = () => {
  const [data, setData] = useState(Boolean);
  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000");
    setData(res.data[0].isFirstStartUp);
  };
  const cardData = [
    { imgsrc: python, info: "Master Python in 30 Days", id: 1 },
    {
      imgsrc: rails,
      info: "Building Scalable Web Apps with Ruby on Rails",
      id: 2,
    },
    { imgsrc: node, info: "Node For Beginners", id: 3 },
    { imgsrc: php, info: "PHP Fundamentals: Web Development with PHP", id: 4 },
    { imgsrc: javascript, info: "JavaScript: From Basics to Advanced", id: 5 },
    { imgsrc: mongodb, info: "Mastering MongoDB for Developers", id: 6 },
    { imgsrc: webdev, info: "Mastering MongoDB for Developers", id: 7 },
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
            <Route path="/player" element={<Player />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/instructor/:id" element={<IndividualInstrucor />} />
            <Route path="/courses/:id" element={<IndividualCourses />} />
          </Routes>
        </Router>
      </>
    );
  }
};

export default App;
