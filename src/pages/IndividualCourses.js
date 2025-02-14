import React from "react";
import PreNav from "../components/Navbar/PreNav";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../api/axiosInstance.js";
import {
  DotsVerticalRounded,
  Plus,
  TrashAltSolid,
  PlusCircle,
  X,
  ChevronRight,
} from "../assets";
import { useRef, useState, useEffect, memo, useCallback } from "react";

const SectionHeader = memo(
  ({ sectionOrder, title, hasLectures, isExpanded, onToggle }) => (
    <div onClick={onToggle} className={`section-header `}>
      <span className="playlist-section-title">
        {sectionOrder}: {title}
      </span>
      {hasLectures && (
        <span className={`chevron-icon ${isExpanded ? "expanded" : ""}`}>
          <div className="svg-div">
            <ChevronRight />
          </div>
        </span>
      )}
    </div>
  )
);

const LectureItem = memo(
  ({
    lectureId,
    title,

    onToggle,

    lectureOrder,

    sectionOrder,
  }) => (
    <div className={`playlist-lecture-item`}>
      <span
        className="checkbox"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(lectureId);
        }}
      >
        <div className="svg-div"></div>
      </span>
      <span className="lecture-title">
        {sectionOrder}.{lectureOrder}: {title}
      </span>
    </div>
  )
);

const IndividualCourses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState(course?.cleanedName);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post(
          "/api/course/individual",
          { CourseId: id },
          { withCredentials: true }
        );
        setCourse(data);
        setCourseTitle(data.cleanedName);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
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

  const [instructorList, setInstructorList] = useState([
    { name: "Alex Bataliga", id: 1, Courses: 5 },
    { name: "Sam Pitroda", id: 2, Courses: 7 },
    { name: "Ajay Kumar", id: 3, Courses: 6 },
    { name: "Sumit Singh", id: 4, Courses: 2 },
    { name: "Danish Kaneria", id: 5, Courses: 1 },
  ]);
  const [newCategoryInput, setnewCategoryInput] = useState("");

  const [newInstructorInput, setnewInstructorInput] = useState("");
  const [courseInstructors, setCourseInstructors] = useState([
    { name: "Alex Bataliga", id: 1, Courses: 5 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] =
    useState(false);

  const addCategoryRef = useRef(null);
  const addInstructorRef = useRef(null);

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
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
    setnewCategoryInput("");
  };
  const closeAddCategoryModal = () => setIsAddCategoryModalOpen(false);
  const openAddInstructorModal = () => setIsAddInstructorModalOpen(true);
  const closeAddInstructorModal = () => setIsAddInstructorModalOpen(false);

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
  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);
  return (
    <div className="main">
      <div className="container">
        <PreNav name={course?.cleanedName} />
        <div className="course-instructor-info">
          <div className="course-instructor-info-container">
            <div className="top">
              <div className="top-container">
                <div className="course-instructor-title">
                  {course?.cleanedName || "Title Not Found"}
                  <div className="edit-information">
                    <div
                      title="Edit Instructor"
                      style={{ cursor: "pointer" }}
                      className="svg-div"
                      onClick={openModal}
                    >
                      <DotsVerticalRounded />
                    </div>
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
                  {course?.description}
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
                          <div
                            title="Add Categories"
                            className="svg-div icon-plus"
                            onClick={openAddCategoryModal}
                          >
                            <Plus />
                          </div>
                        </div>
                        <div className="category-list">
                          {addCategory.map((e) => (
                            <div key={e.id} className="single-category">
                              {e.name}
                              <div
                                className="svg-div"
                                onClick={() => handleRemoveCategory(e)}
                                style={{ cursor: "pointer" }}
                              >
                                <TrashAltSolid />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="course-title-edit">
                        <div className="add-instructors">
                          Instructors
                          <div
                            title="Add Instructors"
                            className="svg-div icon-plus"
                            onClick={openAddInstructorModal}
                          >
                            <Plus />
                          </div>
                        </div>
                        <div className="instructor-list">
                          {courseInstructors.map((instructor) => (
                            <div
                              key={instructor.id}
                              className="single-instructor"
                            >
                              {instructor.name}
                              <div
                                className="svg-div"
                                onClick={() =>
                                  handleRemoveInstructor(instructor)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <TrashAltSolid />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
                    <div className="svg-div">
                      <X />
                    </div>
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
                  <div
                    className="svg-div "
                    style={{ cursor: "pointer" }}
                    onClick={addNewQuickCategory}
                  >
                    <PlusCircle />
                  </div>
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
                    <div className="svg-div">
                      <X />
                    </div>
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
                  <div
                    className="svg-div"
                    style={{ cursor: "pointer" }}
                    onClick={addNewQuickInstructor}
                  >
                    <PlusCircle />
                  </div>
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

        <div className="content-heading">Course Content</div>
        <div className="course-content">
          <div className="course-section">
            <div className="section-list">
              {" "}
              {course?.sections.map((section) => (
                <div key={section.id} className="section-item-course">
                  <SectionHeader
                    sectionOrder={section.order}
                    title={section.cleanedName}
                    hasLectures={section.lectures.length > 0}
                    isExpanded={expandedSections.has(section.id)}
                    onToggle={() => toggleSection(section.id)}
                  />
                  <AnimatePresence>
                    {expandedSections.has(section.id) &&
                      section.lectures.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="lectures-container"
                        >
                          {section.lectures.map((lecture) => (
                            <LectureItem
                              key={lecture.id}
                              lectureId={lecture.id}
                              lectureOrder={lecture.order}
                              sectionOrder={section.order}
                              title={lecture.cleanedName}
                            />
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCourses;
