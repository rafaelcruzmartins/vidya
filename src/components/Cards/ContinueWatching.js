import { useNavigate } from "react-router-dom";

const ContinueWatching = ({ imgsrc, info, courseId }) => {
  const navigate = useNavigate();
  const handlePlayer = () => {
    navigate(`/course/play/${courseId}`);
  };
  return (
    <>
      <div className="cards" onClick={handlePlayer}>
        <div className="card-image">
          <img src={imgsrc} alt="" />
        </div>
        <div className="card-info">{info}</div>
      </div>
    </>
  );
};

export default ContinueWatching;
