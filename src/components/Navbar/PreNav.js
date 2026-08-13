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
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const PreNav = ({ name, progress }) => {
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
                <div
                  key="back-button"
                  className="navbar-btn"
                  onClick={handleBack}
                >
                  <div className="svg-div">
                    <ArrowBack />
                  </div>
                </div>
                <div
                  key="home-button"
                  className="navbar-btn"
                  onClick={handleHome}
                >
                  <div className="svg-div">
                    <HomeAlt2 />
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>
          <div className="menu-bar navbar-btn" onClick={toggleSidebar}>
            <div className="svg-div">
              <Menu />
            </div>
          </div>
          <div className="pre-nav-name">{name}</div>
        </div>
        <div className="search-bar">
          <Search />
        </div>
        <div className="profile">
          <ThemeToggle />
          <div className="svg-div">
            {progress ? (
              progress
            ) : (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/settings")}
              >
                <User />
              </span>
            )}
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
          <div className="lecture-label">Cursos</div>
          <motion.div
            className="lecture-categories"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text)" }}
            onClick={handleCourses}
          >
            <div className="svg-div">
              <ChalkboardSolid />
            </div>
            Todos os cursos
          </motion.div>
          <motion.div
            className="lecture-categories"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text)" }}
            onClick={handleCategories}
          >
            <div className="svg-div">
              <CategoryAlt />
            </div>
            Categorias
          </motion.div>
          <motion.div
            className="lecture-instructor"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text)" }}
            onClick={handleInstructor}
          >
            <div className="svg-div">
              <GraduationSolid />
            </div>
            Instrutores
          </motion.div>
        </div>
        <div className="user">
          <div className="user-label">Usuário</div>
          <motion.div
            className="dashboard-nav"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text)" }}
            onClick={handleDashboard}
          >
            <div className="svg-div">
              <DashboardSolid />
            </div>
            Painel
          </motion.div>
          <motion.div
            className="settings"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text)" }}
            onClick={handleSettings}
          >
            <div className="svg-div">
              <Cog />
            </div>
            Configurações
          </motion.div>
          <motion.div
            className="log-out"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: "var(--text)" }}
            onClick={handleLogOut}
          >
            <div className="svg-div">
              <LogOutCircle />
            </div>
            Sair
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PreNav;
