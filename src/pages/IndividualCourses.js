import React from "react";
import PreNav from "../components/Navbar/PreNav";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  python,
  rails,
  javascript,
  node,
  mongodb,
  php,
  webdev,
  profile,
} from "../assets";
import { useRef, useState, useEffect } from "react";

const cardData = [
  { imgsrc: python, info: "Master Python in 30 Days", id: 1 },
  {
    imgsrc: rails,
    info: "Building Scalable Web Apps with Ruby on Rails",
    id: 2,
  },
  { imgsrc: node, info: "Node For Beginners", id: 3 },
  { imgsrc: php, info: "PHP Fundamentals: Web Development with PHP", id: 4 },
  { imgsrc: javascript, info: "JavaScript: From Basics to Advanced", id: 5 },
  { imgsrc: mongodb, info: "Mastering MongoDB for Developers", id: 6 },
  { imgsrc: webdev, info: "Mastering MongoDB for Developers", id: 7 },
];

const sampleData = [
  {
    id: 1,
    title: "Section 1",
    lectures: [
      { title: "Lecture 1.1", duration: 15 },
      { title: "Lecture 1.2", duration: 20 },
      { title: "Lecture 1.3", duration: 25 },
    ],
  },
  {
    id: 2,
    title: "Section 2",
    lectures: [
      { title: "Lecture 2.1", duration: 30 },
      { title: "Lecture 2.2", duration: 35 },
      { title: "Lecture 2.3", duration: 20 },
    ],
  },
  {
    id: 3,
    title: "Section 3",
    lectures: [
      { title: "Lecture 3.1", duration: 25 },
      { title: "Lecture 3.2", duration: 30 },
      { title: "Lecture 3.3", duration: 35 },
    ],
  },
];

const Section = ({ title, lectures }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalDuration = lectures.reduce(
    (sum, lecture) => sum + lecture.duration,
    0
  );

  return (
    <div className="section">
      <div className="section-title" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <div className="section-info">
          <div className="section-icon">
            {isOpen ? (
              <i className="bx bxs-chevron-down"></i>
            ) : (
              <i className="bx bxs-chevron-right"></i>
            )}
          </div>
          <div className="section-duration">{totalDuration} min</div>
        </div>
      </div>
      <div className={`section-content ${isOpen ? "open" : ""}`}>
        <div className="lecture-list">
          {lectures.map((lecture, index) => (
            <div key={index} className="lecture-item">
              <span>{lecture.title}</span>
              <span className="lecture-duration">{lecture.duration} min</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IndividualCourses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const course = cardData.find((course) => course.id === parseInt(id));

  // State for categories
  const [addCategory, setAddCategory] = useState([
    {
      id: 1,
      name: "Web",
      bxname: "bx bxs-file-js",
      delay: "0",
      color: "#FB3640",
    },
  ]);
  // State for categories list
  const [categoriesList, setCategoriesList] = useState([
    {
      id: 1,
      name: "Web",
      bxname: "bx bxs-file-js",
      delay: "0",
      color: "#FB3640",
    },
    {
      id: 2,
      name: "Mobile",
      bxname: "bx bx-mobile-alt",
      delay: ".25s",
      color: "#0A2463",
    },
    {
      id: 3,
      name: "Finance",
      bxname: "bx bxs-bank",
      delay: ".5s",
      color: "#DDD92A",
    },
    {
      id: 4,
      name: "Health",
      bxname: "bx bx-plus-medical",
      delay: ".75s",
      color: "#7A306C",
    },
    {
      id: 5,
      name: "Business",
      bxname: "bx bxs-business",
      delay: "1s",
      color: "#00A6A6",
    },
  ]);

  // State for Instructor list
  const [instructorList, setInstructorList] = useState([
    { name: "Alex Bataliga", id: 1, Courses: 5 },
    { name: "Sam Pitroda", id: 2, Courses: 7 },
    { name: "Ajay Kumar", id: 3, Courses: 6 },
    { name: "Sumit Singh", id: 4, Courses: 2 },
    { name: "Danish Kaneria", id: 5, Courses: 1 },
  ]);
  // State for input of quick new categories
  const [newCategoryInput, setnewCategoryInput] = useState("");

  // State for input of new instructor
  const [newInstructorInput, setnewInstructorInput] = useState("");
  // New state for instructors
  const [courseInstructors, setCourseInstructors] = useState([
    { name: "Alex Bataliga", id: 1, Courses: 5 },
  ]);

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] =
    useState(false);
  const [courseTitle, setCourseTitle] = useState(course?.info);

  // Refs for click outside handling
  const addCategoryRef = useRef(null);
  const addInstructorRef = useRef(null);

  // Category handlers
  const handleRemoveCategory = (e) => {
    setAddCategory(addCategory.filter((a) => a.id !== e.id));
  };

  const handleAddCategory = (e) => {
    const category = addCategory.find((category) => category.id === e.id);
    if (!category) {
      setAddCategory([...addCategory, e]);
    }
    closeAddCategoryModal();
  };

  // New instructor handlers
  const handleRemoveInstructor = (instructor) => {
    setCourseInstructors(
      courseInstructors.filter((i) => i.id !== instructor.id)
    );
  };

  const handleAddInstructor = (instructor) => {
    const exists = courseInstructors.find((i) => i.id === instructor.id);
    if (!exists) {
      setCourseInstructors([...courseInstructors, instructor]);
    }
    closeAddInstructorModal();
  };

  // New quick category handlers

  const addNewQuickCategory = () => {
    if (newCategoryInput.trim()) {
      const newCategory = {
        id: categoriesList.length - 1,
        name: newCategoryInput.trim(),
        bxname: "bx bxs-file-js",
        delay: "0",
        color: "#FB3640",
      };
      setCategoriesList([...categoriesList, newCategory]);
      setnewCategoryInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newCategoryInput.trim()) {
      const newCategory = {
        id: categoriesList.length - 1,
        name: newCategoryInput.trim(),
        bxname: "bx bxs-file-js",
        delay: "0",
        color: "#FB3640",
      };
      setCategoriesList([...categoriesList, newCategory]);
      setnewCategoryInput("");
    }
  };

  // New Quick instructor handler
  const addNewQuickInstructor = () => {
    if (newInstructorInput.trim()) {
      const newInstructor = {
        id: instructorList.length - 1,
        name: newInstructorInput.trim(),
        bxname: "bx bxs-file-js",
        delay: "0",
        color: "#FB3640",
      };
      setInstructorList([...instructorList, newInstructor]);
      setnewInstructorInput("");
    }
  };

  const handleKeyDownInstructor = (e) => {
    if (e.key === "Enter" && newInstructorInput.trim()) {
      const newInstructor = {
        id: instructorList.length - 1,
        name: newInstructorInput.trim(),
        bxname: "bx bxs-file-js",
        delay: "0",
        color: "#FB3640",
      };
      setInstructorList([...instructorList, newInstructor]);
      setnewInstructorInput("");
    }
  };
  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
    setnewCategoryInput("");
  };
  const closeAddCategoryModal = () => setIsAddCategoryModalOpen(false);
  const openAddInstructorModal = () => setIsAddInstructorModalOpen(true);
  const closeAddInstructorModal = () => setIsAddInstructorModalOpen(false);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addCategoryRef.current &&
        !addCategoryRef.current.contains(event.target)
      ) {
        setIsAddCategoryModalOpen(false);
      }
      if (
        addInstructorRef.current &&
        !addInstructorRef.current.contains(event.target)
      ) {
        setIsAddInstructorModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="main">
      <div className="container">
        <PreNav name={course?.info} />
        <div className="course-instructor-info">
          <div className="course-instructor-info-container">
            <div className="top">
              <div className="top-container">
                <div className="course-instructor-title">
                  {course?.info || "Title Not Found"}
                  <div className="edit-information">
                    <i
                      className="bx bx-dots-vertical-rounded"
                      onClick={openModal}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="bottom-container">
                <div className="instructor-section">
                  Instructors:
                  {courseInstructors.map((instructor) => (
                    <span
                      onClick={() => navigate(`/instructor/${instructor.id}`)}
                    >
                      {" "}
                      {instructor.name}
                    </span>
                  ))}
                </div>
                <div className="description">
                  <span className="drop-cap">Description : </span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </div>
                <div>Course Duration : 20Hr</div>
                <div>Watched : 10Hr , 50% of 20Hr</div>
              </div>
            </div>
            <div className="img-container course-info-image instructor-info-image">
              <img src={course?.imgsrc} alt="" />
            </div>
          </div>
        </div>

        {/* Edit Course Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="modal-overlay">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="modal big-modal"
              >
                <div className="edit-course-modal">
                  <div className="edit-course-modal-inner">
                    <div className="modal-heading">Edit Course</div>
                    <div className="edit-course-form">
                      <div className="course-title-edit">
                        <div>Edit Title</div>
                        <div className="modal-input-course-edit">
                          <input
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="input"
                            value={courseTitle}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="course-title-edit">
                        <div>Edit Image</div>
                        <div className="modal-input-course-edit">
                          <input className="input" type="file" />
                        </div>
                      </div>
                      <div className="course-title-edit">
                        <div className="add-categories">
                          Category
                          <i
                            title="Add Categories"
                            className="bx bx-plus"
                            onClick={openAddCategoryModal}
                          ></i>
                        </div>
                        <div className="category-list">
                          {addCategory.map((e) => (
                            <div key={e.id} className="single-category">
                              {e.name}
                              <i
                                className="bx bxs-trash-alt"
                                onClick={() => handleRemoveCategory(e)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="course-title-edit">
                        <div className="add-instructors">
                          Instructors
                          <i
                            title="Add Instructors"
                            className="bx bx-plus"
                            onClick={openAddInstructorModal}
                          ></i>
                        </div>
                        <div className="instructor-list">
                          {courseInstructors.map((instructor) => (
                            <div
                              key={instructor.id}
                              className="single-instructor"
                            >
                              {instructor.name}
                              <i
                                className="bx bxs-trash-alt"
                                onClick={() =>
                                  handleRemoveInstructor(instructor)
                                }
                                style={{ cursor: "pointer" }}
                              ></i>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="modal-buttons-group-user modal-buttons-group-edit-course">
                      <motion.div
                        className="modal-buttons"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ color: "#00a6a6" }}
                      >
                        Save
                      </motion.div>
                      <motion.div
                        className="modal-buttons"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ color: "#45312d" }}
                        onClick={closeModal}
                      >
                        Cancel
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Add Category Modal */}
        <AnimatePresence>
          {isAddCategoryModalOpen && (
            <div className="modal-overlay add-category-overlay">
              <motion.div
                className="list-modal"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                ref={addCategoryRef}
              >
                <div className="select-category-instructor-group">
                  <div className="select-category-instructor">
                    Select Category
                  </div>
                  <div
                    onClick={closeAddCategoryModal}
                    style={{ cursor: "pointer" }}
                    className="close-button"
                  >
                    <i className="bx bx-x"></i>
                  </div>
                </div>
                <div className="add-category-instructor-input">
                  <input
                    type="text"
                    onChange={(e) => setnewCategoryInput(e.target.value)}
                    value={newCategoryInput}
                    onKeyDown={handleKeyDown}
                    placeholder="create new category"
                  />
                  <i
                    className="bx bx-plus-circle"
                    style={{ cursor: "pointer" }}
                    onClick={addNewQuickCategory}
                  ></i>
                </div>
                <div className="list-modal-wrap">
                  {categoriesList.map((e) => (
                    <div
                      key={e.id}
                      className="single-add-category"
                      onClick={() => handleAddCategory(e)}
                    >
                      {e.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Add Instructor Modal */}
        <AnimatePresence>
          {isAddInstructorModalOpen && (
            <div className="modal-overlay add-instructor-overlay">
              <motion.div
                className="list-modal"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                ref={addInstructorRef}
              >
                <div className="select-category-instructor-group">
                  <div className="select-category-instructor">
                    Select Instructor
                  </div>
                  <div
                    onClick={closeAddInstructorModal}
                    style={{ cursor: "pointer" }}
                    className="close-button"
                  >
                    <i className="bx bx-x"></i>
                  </div>
                </div>
                <div className="add-category-instructor-input">
                  <input
                    type="text"
                    onChange={(e) => setnewInstructorInput(e.target.value)}
                    value={newInstructorInput}
                    onKeyDown={handleKeyDownInstructor}
                    placeholder="create new instructor"
                  />
                  <i
                    className="bx bx-plus-circle"
                    style={{ cursor: "pointer" }}
                    onClick={addNewQuickInstructor}
                  ></i>
                </div>
                <div className="list-modal-wrap">
                  {instructorList.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="single-add-instructor"
                      onClick={() => handleAddInstructor(instructor)}
                    >
                      {instructor.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Course Content Section */}
        <div className="content-heading">Course Content</div>
        <div className="course-content">
          <div className="course-section">
            <div className="section-list">
              {sampleData.map((section) => (
                <Section
                  key={section.id}
                  title={section.title}
                  lectures={section.lectures}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCourses;
