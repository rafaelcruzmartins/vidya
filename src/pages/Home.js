import Stats from "../components/Stats";
import Navbar from "../components/Navbar/Navbar";
import PreNav from "../components/Navbar/PreNav";
import Cards from "../components/Cards/Cards";
import Loader from "../components/Loader/Loader.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axiosInstance.js";
import { useEffect, useState, useRef } from "react";
import ContinueWatching from "../components/Cards/ContinueWatching.js";
import { ChevronRight } from "../assets/index.js";

const Home = ({ category }) => {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const continueRef = useRef(null);
  const latestRef = useRef(null);
  const handlePlayer = () =>
    navigate(
      `/course/play/${
        homeData?.featuredCourse
          ? homeData.featuredCourse.id
          : homeData.latestCourse[0].id
      }`,
    );
  const formatTime = (duration) => {
    if (duration < 60) {
      return `${duration}S`;
    } else if (duration < 3600) {
      const minutes = (duration / 60).toFixed(1);
      return `${minutes}M`;
    } else if (duration < 86400) {
      const hours = (duration / 3600).toFixed(1);
      return `${hours}H`;
    } else {
      const days = (duration / 86400).toFixed(1);
      return `${days}D`;
    }
  };
  const handleCourse = () => {
    navigate(
      `/courses/${
        homeData?.featuredCourse
          ? homeData.featuredCourse.id
          : homeData.latestCourse[0].id
      }`,
    );
  };
  const handleInstructor = (id) => {
    navigate(`instructor/${id}`);
  };
  const scrollLeft = () => {
    if (latestRef.current) {
      latestRef.current.scrollBy({ left: -900, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (latestRef.current) {
      latestRef.current.scrollBy({ left: 900, behavior: "smooth" });
    }
  };
  const scrollLeftContinue = () => {
    if (continueRef.current) {
      continueRef.current.scrollBy({ left: -900, behavior: "smooth" });
    }
  };

  const scrollRightContinue = () => {
    if (continueRef.current) {
      continueRef.current.scrollBy({ left: 900, behavior: "smooth" });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/home", {
          withCredentials: true,
        });
        setHomeData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const rawStats = homeData?.categoryWatchTime?.categoryWatchtime;
  const topCategoryStats = rawStats
    ? (() => {
        const sorted = [...rawStats].sort((a, b) => b.watchtime - a.watchtime);
        const top5 = sorted.slice(0, 5);
        const rest = sorted.slice(5);
        if (rest.length > 0) {
          top5.push({
            category: "Others",
            watchtime: rest.reduce((sum, item) => sum + item.watchtime, 0),
          });
        }
        return top5;
      })()
    : null;
  const statsColor = [
    "#605F5E",
    "#FB3640",
    "#0A2463",
    "#247BA0",
    "#E9A7FF",
    "#E6C229",
  ];
  return (
    <>
      <PreNav name={"VIDYA"} />
      <Navbar navItem={category} />
      {isLoading && <Loader />}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
        >
          {homeData?.continueWatching?.length > 0 && (
            <section className="home-hero">
              <div className="home-hero-main">
                <span className="home-hero-eyebrow">CONTINUAR DE ONDE PAROU</span>
                <h1 className="home-hero-title">
                  {homeData.continueWatching[0].course?.cleanedName}
                </h1>
                <p className="home-hero-lecture">
                  {homeData.continueWatching[0].lecture?.cleanedName}
                </p>
                <button
                  className="home-hero-button"
                  onClick={() =>
                    navigate(
                      `/course/play/${homeData.continueWatching[0].course.id}`,
                    )
                  }
                >
                  Retomar
                </button>
              </div>

              <div className="home-stats">
                <div className="home-stat">
                  <span className="home-stat-value">
                    {formatTime(homeData?.categoryWatchTime?.totalWatchtime)}
                  </span>
                  <span className="home-stat-label">Tempo assistido</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-value">
                    {homeData?.stats?.courseCount ?? 0}
                  </span>
                  <span className="home-stat-label">Cursos</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-value">
                    {homeData?.stats?.lectureCount ?? 0}
                  </span>
                  <span className="home-stat-label">Aulas</span>
                </div>
                <div className="home-stat">
                  <span className="home-stat-value">
                    {homeData?.stats?.streak ?? 0}
                  </span>
                  <span className="home-stat-label">
                    {homeData?.stats?.streak === 1 ? "Dia seguido" : "Dias seguidos"}
                  </span>
                </div>
              </div>
            </section>
          )}

          {homeData?.continueWatching?.length > 1 && (
            <section className="home-section">
              <h2 className="home-section-title">Continuar assistindo</h2>
              <div className="home-grid">
                {homeData.continueWatching.slice(1).map((item, index) => (
                  <ContinueWatching
                    key={index}
                    lectureName={item.lecture?.cleanedName}
                    courseId={item.course.id}
                    courseName={item.course.cleanedName}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="home-section">
            <h2 className="home-section-title">Seus cursos</h2>
            <div className="home-grid">
              {homeData?.latestCourse?.map((item, index) => (
                <Cards
                  key={index}
                  info={item.cleanedName}
                  courseId={item.id}
                  sectionCount={item.sectionCount}
                  lectureCount={item.lectureCount}
                  duration={item.duration}
                  progress={item.progress}
                />
              ))}
            </div>
          </section>

          {topCategoryStats && topCategoryStats.length > 0 && (
            <section className="home-section">
              <h2 className="home-section-title">Tempo por categoria</h2>
              <div className="home-panel home-categories">
                <div className="home-categories-chart">
                  <Stats watchtimeData={topCategoryStats} />
                </div>
                <div className="labels">
                  {topCategoryStats.map((item, index) => (
                    <div className="label-names" key={index}>
                      <div
                        className="rectangle"
                        style={{ backgroundColor: statsColor[index] }}
                      ></div>
                      {item.category} -{" "}
                      {(
                        (item.watchtime /
                          homeData?.categoryWatchTime?.totalWatchtime) *
                        100
                      ).toFixed(1)}{" "}
                      %
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </motion.div>
      )}
    </>
  );
};

export default Home;
