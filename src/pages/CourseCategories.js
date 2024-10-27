import Navbar from "../components/Navbar/Navbar";
import PreNav from "../components/Navbar/PreNav";
import Cards from "../components/Cards/Cards";
import { motion } from "framer-motion";
const CourseCategories = ({ name, cardData }) => {
  return (
    <>
      <div className="main">
        <div className="container">
          <PreNav name={name} />
          <Navbar />

          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ ease: "easeInOut" }}
            className="card-divs-wrap"
          >
            {cardData.map((item, index) => (
              <Cards
                key={index}
                imgsrc={item.imgsrc}
                info={item.info}
                courseId={item.id}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CourseCategories;
