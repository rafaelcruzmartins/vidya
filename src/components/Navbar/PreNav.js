import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../Search/Search";
import {
  ArrowBack,
  CategoryAlt,
  ChalkboardSolid,
  Cog,
  DashboardSolid,
  GraduationSolid,
  HomeAlt2,
  LogOutCircle,
  Menu,
  User,
} from "../../assets";
import { useAuth } from "../../context/AuthContext";

const PreNav = ({ name }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const handleBack = () => navigate(-1);
  const handleHome = () => navigate("/");
  const handleCategories = () => navigate("/categories");
  const handleInstructor = () => navigate("/instructor");
  const handleCourses = () => navigate("/courses");
  const handleSettings = () => navigate("/settings");
  const handleDashboard = () => navigate("/dashboard");
  const { logout } = useAuth();
  const handleLogOut = async () => {
    logout();
  };
  const isRootPage = location.pathname === "/";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="pre-nav">
        <div className="left-group">
          <AnimatePresence>
            {!isRootPage && (
              <>
                <motion.div
                  key="back-button"
                  className="navbar-btn"
                  onClick={handleBack}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="svg-div">
                    <ArrowBack />
                  </div>
                </motion.div>
                <motion.div
                  key="home-button"
                  className="navbar-btn"
                  onClick={handleHome}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="svg-div">
                    <HomeAlt2 />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <motion.div
            className="menu-bar navbar-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={toggleSidebar}
          >
            <div className="svg-div">
              <Menu />
            </div>
          </motion.div>
          <motion.div
            className="pre-nav-name"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {name}
          </motion.div>
        </div>
        <motion.div
          className="search-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Search />
        </motion.div>
        <div className="profile">
          <div className="svg-div">
            <User />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={sidebarRef}
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? 0 : "-120%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <div className="lectures">
          <div className="lecture-label">Courses</div>
          <motion.div
            className="lecture-categories"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "#0a2463" }}
            onClick={handleCourses}
          >
            <div className="svg-div">
              <ChalkboardSolid />
            </div>
            All Courses
          </motion.div>
          <motion.div
            className="lecture-categories"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "#0a2463" }}
            onClick={handleCategories}
          >
            <div className="svg-div">
              <CategoryAlt />
            </div>
            Categories
          </motion.div>
          <motion.div
            className="lecture-instructor"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "#0a2463" }}
            onClick={handleInstructor}
          >
            <div className="svg-div">
              <GraduationSolid />
            </div>
            Instructors
          </motion.div>
        </div>
        <div className="user">
          <div className="user-label">User</div>
          <motion.div
            className="dashboard-nav"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "#0a2463" }}
            onClick={handleDashboard}
          >
            <div className="svg-div">
              <DashboardSolid />
            </div>
            Dashboard
          </motion.div>
          <motion.div
            className="settings"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "#0a2463" }}
            onClick={handleSettings}
          >
            <div className="svg-div">
              <Cog />
            </div>
            Settings
          </motion.div>
          <motion.div
            className="log-out"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "#0a2463" }}
            onClick={handleLogOut}
          >
            <div className="svg-div">
              <LogOutCircle />
            </div>
            Log Out
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PreNav;
