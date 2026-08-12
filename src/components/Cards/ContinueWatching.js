import { useNavigate } from "react-router-dom";
import { Play } from "../../assets";

const ContinueWatching = ({ lectureName, courseName, courseId }) => {
  const navigate = useNavigate();
  const handlePlayer = (e) => {
    e.stopPropagation();
    navigate(`/course/play/${courseId}`);
  };
  const handleCourse = () => {
    navigate(`/courses/${courseId}`);
  };
  return (
    <div className="cards" onClick={handleCourse}>
      <div className="card-info">
        <div className="card-info-course">
          <div className="card-info-course-title">{courseName}</div>
        </div>
        <div className="card-info-lecture">
          <div className="card-info-lecture-title" onClick={handlePlayer}>
            {lectureName}
          </div>
        </div>
      </div>
      <button className="card-play" onClick={handlePlayer} title="Play">
        <Play />
      </button>
    </div>
  );
};

export default ContinueWatching;
