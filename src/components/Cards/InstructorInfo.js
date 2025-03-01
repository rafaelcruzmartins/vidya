import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
const InstructorInfo = ({ data }) => {
  const navigate = useNavigate();
  const handleInstructor = () => {
    navigate(`/instructor/${data.id}`);
  };
  return (
    <Tilt className="instructor-card">
      <div className="instructor-psuedo-div" onClick={handleInstructor}>
        <div className="img-container-instructor">
          <img src={process.env.REACT_APP_API + data.photo} alt="" />
        </div>
        <div className="instructor-title">{data.name}</div>
        <div>Courses : {data.Courses}</div>
        <div>Duration : {data.duration} hr</div>
      </div>
    </Tilt>
  );
};

export default InstructorInfo;
