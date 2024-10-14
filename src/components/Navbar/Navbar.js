import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleYourCourses = () => navigate("/courses");
  const handleWeb = () => navigate("/web");
  const handleMobile = () => navigate("/mobile");
  const handleFinance = () => navigate("/finance");
  const handleHealth = () => navigate("/health");
  const handleBusiness = () => navigate("/business");

  return (
    <>
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
