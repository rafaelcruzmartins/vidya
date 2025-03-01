import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Navbar = ({ navItem }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleYourCourses = (id) => {
    if (location.pathname !== `/category/${id}`) {
      navigate(`/category/${id}`);
    }
  };

  const currentPathId = location.pathname.startsWith("/category/")
    ? location.pathname.split("/category/")[1]
    : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="nav-bar"
      >
        {navItem &&
          navItem.map((cat) => (
            <div
              key={cat.id}
              className={
                currentPathId === cat.id.toString()
                  ? "active nav-item"
                  : "nav-item"
              }
              onClick={() => handleYourCourses(cat.id)}
            >
              <span className="nav-item-name">{cat.category}</span>
            </div>
          ))}
      </motion.div>
    </>
  );
};

export default Navbar;
