import Navbar from "../components/Navbar/Navbar";
import Cards from "../components/Cards/Cards";
import { motion, AnimatePresence } from "framer-motion";
import {
  python,
  rails,
  javascript,
  node,
  mongodb,
  php,
  webdev,
} from "../assets";

const CourseCategories = ({ name, cardData }) => {
  return (
    <>
      <div className="main">
        <div className="container">
          <Navbar name={name} />
          <AnimatePresence>
            <motion.div
              className="card-divs-wrap"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {cardData.map((item, index) => (
                <Cards key={index} imgsrc={item.imgsrc} info={item.info} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default CourseCategories;
