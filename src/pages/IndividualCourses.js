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
import Toast from "../components/Toast/Toast.js";
import { useAuth } from "../context/AuthContext.js";
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

  // State for categories

  const [categoriesList, setCategoriesList] = useState([]);

  const [instructorList, setInstructorList] = useState([]);
  const [newCategoryInput, setnewCategoryInput] = useState("");

  const [newInstructorInput, setnewInstructorInput] = useState("");
  const [courseInstructors, setCourseInstructors] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] =
    useState(false);
  const addCategoryRef = useRef(null);
  const addInstructorRef = useRef(null);
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const {
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    showToast,
    setShowToast,
  } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post(
          "/api/course/individual",
          { CourseId: id },
          { withCredentials: true }
        );
        setCourse(data.course);
        setCourseTitle(data.course.cleanedName);
        setCourseCategory(data.course.category ? [data.course.category] : []);
        setRole(data.role);
        setCategoriesList(data.categories);
        setInstructorList(data.instructors);
        setCourseInstructors(
          data.course.instructors ? data.course.instructors : []
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const addCategoryBackend = async (category) => {
    try {
      const catogories = await axios.post("/api/admin/category", category, {
        withCredentials: true,
      });
      return catogories;
    } catch (error) {
      console.error(error);
    }
  };
  const addInstructorBackend = async (instructor) => {
    try {
      const instructors = await axios.post(
        "/api/admin/instructor",
        instructor,
        {
          withCredentials: true,
        }
      );
      return instructors;
    } catch (error) {
      console.error(error);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleRemoveCategory = (e) => {
    setCourseCategory(courseCategory.filter((a) => a.id !== e.id));
  };

  const handleAddCategory = (e) => {
    const category = courseCategory.find((category) => category.id === e.id);
    if (!category) {
      setCourseCategory([e]);
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

  const addNewQuickCategory = async () => {
    if (newCategoryInput.trim()) {
      const newCategory = {
        name: newCategoryInput.trim(),
      };
      const category = await addCategoryBackend(newCategory);
      setCategoriesList(category.data);
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

  const addNewQuickInstructor = async () => {
    if (newInstructorInput.trim()) {
      const newInstructor = {
        name: newInstructorInput.trim(),
      };
      const instructor = await addInstructorBackend(newInstructor);
      setInstructorList(instructor.data);
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

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("CourseId", id);
    formData.append("CategoryId", courseCategory[0].id);
    formData.append(
      "Instructors",
      JSON.stringify(courseInstructors.map((instructor) => instructor.id))
    );
    formData.append("CourseName", courseTitle);
    try {
      if (file) {
        formData.append("file", file);
        setToastType("progress");
        setToastMessage("uplaoding");
        setShowToast(true);
      }

      const response = await axios.post("/api/admin/form/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
      setToastType("error");
      setToastMessage("error updating course");
      setShowToast(true);
    } finally {
      setToastType("success");
      setToastMessage("updated course");
      setShowToast(true);
      setIsModalOpen(false);
    }
  };
  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="main">
        <div className="container">
          <PreNav name={course?.cleanedName} />
          <div className="course-instructor-info">
            <div className="course-instructor-info-container">
              <div className="top">
                <div className="top-container">
                  <div className="course-instructor-title">
                    {course?.cleanedName || "Title Not Found"}
                    {role === "admin" && (
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
                    )}
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
                <img src={process.env.REACT_APP_API + course?.photo} alt="" />
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
                            <input
                              className="input"
                              accept="image/*"
                              type="file"
                              onChange={handleFileChange}
                            />
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
                            {courseCategory.map((e) => (
                              <div key={e.id} className="single-category">
                                {e.category}
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
                      onClick={handleUpload}
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
                        {e.category}
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
    </>
  );
};

export default IndividualCourses;
