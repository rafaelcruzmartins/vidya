import Navbar from "../components/Navbar/Navbar";
import PreNav from "../components/Navbar/PreNav";
import Cards from "../components/Cards/Cards";
import { motion, AnimatePresence } from "framer-motion";

const CourseCategories = ({ name, cardData }) => {
  return (
    <>
      <div className="main">
        <div className="container">
          <PreNav name={name} />
          <Navbar />

          <div className="card-divs-wrap">
            {cardData.map((item, index) => (
              <Cards key={index} imgsrc={item.imgsrc} info={item.info} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCategories;
