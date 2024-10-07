import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const Navbar = ({ name }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);
  const handleHome = () => navigate("/");
  const handleYourCourses = () => navigate("/courses");
  const handleWeb = () => navigate("/web");
  const handleMobile = () => navigate("/mobile");
  const handleFinance = () => navigate("/finance");
  const handleHealth = () => navigate("/health");
  const handleBusiness = () => navigate("/business");

  const isRootPage = location.pathname === "/";
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
                  <i class="bx bx-arrow-back"></i>
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
                  <i class="bx bx-home-alt-2"></i>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <motion.div
            className="menu-bar navbar-btn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <i className="bx bx-menu"></i>
          </motion.div>

          <motion.div
            className="server-name"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {name}
          </motion.div>
        </div>
        <motion.div
          className="search-bar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="search">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"
                fill="#0A2463"
              />
            </svg>
          </div>
        </motion.div>
        <div className="profile">
          <i className="bx bx-user"></i>
        </div>
      </div>
      <div className="nav-bar">
        <div
          className={
            location.pathname === "/courses" ? "active nav-item" : "nav-item"
          }
          onClick={handleYourCourses}
        >
          Your Courses
        </div>

        <div
          className={
            location.pathname === "/web" ? "active nav-item" : "nav-item"
          }
          onClick={handleWeb}
        >
          Web
        </div>
        <div
          className={
            location.pathname === "/mobile" ? "active nav-item" : "nav-item"
          }
          onClick={handleMobile}
        >
          Mobile
        </div>
        <div
          className={
            location.pathname === "/finance" ? "active nav-item" : "nav-item"
          }
          onClick={handleFinance}
        >
          Finance
        </div>
        <div
          className={
            location.pathname === "/health" ? "active nav-item" : "nav-item"
          }
          onClick={handleHealth}
        >
          Health
        </div>
        <div
          className={
            location.pathname === "/business" ? "active nav-item" : "nav-item"
          }
          onClick={handleBusiness}
        >
          Business
        </div>
      </div>
    </>
  );
};

export default Navbar;
