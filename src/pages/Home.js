import {
  python,
  rails,
  javascript,
  node,
  mongodb,
  php,
  webdev,
} from "../assets";
import Stats from "../components/Stats";
import Navbar from "../components/Navbar/Navbar";
import PreNav from "../components/Navbar/PreNav";
import Cards from "../components/Cards/Cards";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axiosInstance.js";
import { useEffect, useState } from "react";
import ContinueWatching from "../components/Cards/ContinueWatching.js";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const navigate = useNavigate();
  const handlePlayer = () =>
    navigate(
      `/course/play/${
        homeData?.featuredCourse
          ? homeData.featuredCourse.id
          : homeData.latestCourse[1].id
      }`
    );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/home/", {
          withCredentials: true,
        });
        setHomeData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="main">
      <div className="container">
        <PreNav name={"VIDYA"} />
        <Navbar />
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
        >
          <div className="featured">
            <p className="pinned-title">FEATURED</p>
            <div className="feat-stats">
              <div className="featured-course">
                <div className="featured-image">
                  <img src={python} alt="" />
                </div>
                <div className="featured-info">
                  <div className="featured-info-details">
                    <div className="info-title">
                      {homeData &&
                        (!homeData.featuredCourse === null
                          ? homeData.featuredCourse.cleanedName
                          : homeData.latestCourse[1].cleanedName)}
                    </div>
                    <div className="instructor-name">by Andre Sivan</div>
                    <div className="play-button" onClick={handlePlayer}>
                      Play Now
                    </div>
                  </div>
                </div>
              </div>
              <Tilt className="stats" perspective={4000} gyroscope={true}>
                <Stats />
                <div className="watch">
                  <div className="watch-hours">WATCH HOURS</div>
                  <div className="hours">19H</div>
                </div>
                <div className="labels">
                  <div className="label-names">
                    <div className="rectangle first"></div>Web - 40%
                  </div>
                  <div className="label-names">
                    <div className="rectangle second"></div>Mobile - 30%
                  </div>
                  <div className="label-names">
                    <div className="rectangle third"></div>Finance - 10%
                  </div>
                  <div className="label-names">
                    <div className="rectangle fourth"></div>Health - 12%
                  </div>
                  <div className="label-names">
                    <div className="rectangle fifth"></div>Others - 8%
                  </div>
                </div>
              </Tilt>
            </div>
          </div>

          <div className="continue">
            <p className="pinned-title">CONTINUE LEARNING</p>
            <div className="card-divs">
              {homeData &&
                homeData.continueWatching.map((item, index) => (
                  <ContinueWatching
                    key={index}
                    imgsrc={webdev}
                    info={item.lecture.cleanedName}
                    courseId={item.course.id}
                  />
                ))}
            </div>
          </div>
          <div className="latest-courses">
            <p className="pinned-title">LATEST COURSES</p>
            <div className="card-divs">
              {homeData &&
                homeData.latestCourse.map((item, index) => (
                  <Cards
                    key={index}
                    imgsrc={webdev}
                    info={item.cleanedName}
                    courseId={item.id}
                  />
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
