import PreNav from "../components/Navbar/PreNav";
import { useParams, useNavigate } from "react-router-dom";
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
import { useState } from "react";

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
  const handleInstructor = () => {
    navigate("/instructor/1");
  };
  const { id } = useParams();
  const course = cardData.find((course) => course.id === parseInt(id));

  return (
    <div className="main">
      <div className="container">
        <PreNav name={course.info} />
        <div className="course-instructor-info">
          <div className="course-instructor-info-container">
            <div className="top">
              <div className="top-container">
                <div className="course-instructor-title">
                  {course?.info || "Title Not Found"}
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="bottom-container">
                <div>
                  Instructor :{" "}
                  <span
                    onClick={handleInstructor}
                    style={{ cursor: "pointer" }}
                  >
                    Alex Bataliga
                  </span>
                </div>
                <div className="description">
                  <span className="drop-cap">Description : </span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                  ullam voluptatibus molestias sapiente ea, quidem id dolor
                  animi eum non esse vel asperiores incidunt optio consequatur
                  sunt quis culpa cum?
                </div>
                <div>Course Duration : 20Hr</div>
                <div>Watched : 10Hr , 50% of 20Hr</div>
              </div>
            </div>
            <div className="img-container course-info-image instructor-info-image">
              <img src={course.imgsrc} alt="" />
            </div>
          </div>
        </div>
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
