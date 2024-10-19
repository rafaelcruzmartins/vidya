import PreNav from "../components/Navbar/PreNav";
import { useParams } from "react-router-dom";
import { profile } from "../assets";
import Cards from "../components/Cards/Cards";
import {
  python,
  rails,
  javascript,
  node,
  mongodb,
  php,
  webdev,
} from "../assets";
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
const instructorsData = [
  { name: "Alex Bataliga", id: 1, Courses: 5 },
  { name: "Sam Pitroda", id: 2, Courses: 7 },
  { name: "Ajay Kumar", id: 3, Courses: 6 },
  { name: "Sumit Singh", id: 4, Courses: 2 },
  { name: "Danish Kaneria", id: 5, Courses: 1 },
];

const IndividualInstrucor = () => {
  const { id } = useParams();

  const user = instructorsData.find((user) => user.id === parseInt(id));
  return (
    <div className="main">
      <div className="container">
        <PreNav name={user?.name || "Instructor Not Found"} />
        <div className="course-instructor-info">
          <div className="course-instructor-info-container">
            <div className="top">
              <div className="top-container">
                <div className="course-instructor-title">
                  {user?.name || "Instructor Not Found"}
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="bottom-container">
                <div>Courses : {user?.Courses || "Instructor Not Found"}</div>
                <div className="description">
                  <span class="drop-cap">Description : </span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                  ullam voluptatibus molestias sapiente ea, quidem id dolor
                  animi eum non esse vel asperiores incidunt optio consequatur
                  sunt quis culpa cum?
                </div>
                <div>Total Hours : 20Hr</div>
              </div>
            </div>
            <div className="img-container instructor-info-image">
              <img src={profile} alt="" />
            </div>
          </div>
        </div>

        <div className="courses">Courses</div>

        <div className="card-divs-wrap">
          {cardData.map((data) => (
            <Cards imgsrc={data.imgsrc} info={data.info} courseId={data.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualInstrucor;
