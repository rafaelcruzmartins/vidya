import Navbar from "../components/Navbar/Navbar";
import PreNav from "../components/Navbar/PreNav";
import Cards from "../components/Cards/Cards";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const CourseCategories = () => {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "/api/category/course",
          { CategoryId: id },
          { withCredentials: true }
        );
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchCategory = async () => {
      const { data } = await axios.get(
        "/api/category/6",

        { withCredentials: true }
      );
      setCategory(data);
    };
    fetchCategory();
  }, []);
  return (
    <>
      <div className="main">
        <div className="container">
          <PreNav name={courses && courses.category} />
          <Navbar navItem={category} />
          <AnimatePresence mode="wait">
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="card-divs-wrap"
            >
              {!loading &&
                courses &&
                courses.courses.map((item, index) => (
                  <Cards
                    key={index}
                    imgsrc={item?.photo}
                    info={item.cleanedName}
                    courseId={item.id}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default CourseCategories;
