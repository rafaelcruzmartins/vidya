import { useNavigate } from "react-router-dom";

const Cards = ({ imgsrc, info, courseId }) => {
  const navigate = useNavigate();
  const handleCourse = () => {
    navigate(`/courses/${courseId}`);
  };
  return (
    <>
      <div className="cards" onClick={handleCourse}>
        <div className="card-image">
          <img src={imgsrc} alt="" />
        </div>
        <div className="card-info">{info}</div>
      </div>
    </>
  );
};

export default Cards;
