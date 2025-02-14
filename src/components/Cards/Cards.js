import { useNavigate } from "react-router-dom";

const Cards = ({ imgsrc, info, courseId }) => {
  const navigate = useNavigate();
  const handleCourse = () => {
    navigate(`/courses/${courseId}`);
  };
  const handlePlayer = () => {
    navigate(`/course/play/${courseId}`);
  };
  return (
    <>
      <div className="cards">
        <div className="card-image" onClick={handlePlayer}>
          <img src={imgsrc} alt="" />
        </div>
        <div className="card-info" onClick={handleCourse}>
          {info}
        </div>
      </div>
    </>
  );
};

export default Cards;
