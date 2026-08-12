import { useNavigate } from "react-router-dom";
import { Play } from "../../assets";

const Cards = ({ info, courseId }) => {
  const navigate = useNavigate();

  const handleCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const handlePlayer = (e) => {
    e.stopPropagation();
    navigate(`/course/play/${courseId}`);
  };

  return (
    <div className="cards" onClick={handleCourse}>
      <div className="card-info">
        <div className="card-info-course">
          <div className="card-info-course-title">{info}</div>
        </div>
      </div>
      <button className="card-play" onClick={handlePlayer} title="Play">
        <Play />
      </button>
    </div>
  );
};

export default Cards;
