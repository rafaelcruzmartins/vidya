import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
const InstructorInfo = ({ data }) => {
  const navigate = useNavigate();
  const handleInstructor = () => {
    navigate(`/instructor/${data.id}`);
  };
  const formatTime = (duration) => {
    if (duration < 60) {
      return `${duration} seconds`;
    } else if (duration < 3600) {
      const minutes = (duration / 60).toFixed(1);
      return `${minutes} Minutes`;
    } else if (duration < 86400) {
      const hours = (duration / 3600).toFixed(1);
      return `${hours} Hours`;
    } else {
      const days = (duration / 86400).toFixed(1);
      return `${days} Days`;
    }
  };
  return (
    <Tilt className="instructor-card">
      <div className="instructor-psuedo-div" onClick={handleInstructor}>
        <div className="img-container-instructor">
          <img src={process.env.REACT_APP_API + data.photo} alt="" />
        </div>
        <div className="instructor-title">{data.name}</div>
        <div>Courses : {data.Courses}</div>
        <div>Duration : {formatTime(data.totalCourseDuration)}</div>
      </div>
    </Tilt>
  );
};

export default InstructorInfo;
