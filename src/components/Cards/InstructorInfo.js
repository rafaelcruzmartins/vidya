import { profile } from "../../assets";
import Tilt from "react-parallax-tilt";
const InstructorInfo = () => {
  return (
    <Tilt className="instructor-card">
      <div className="img-container">
        <img src={profile} alt="" />
      </div>
      <div className="instructor-title">Alex Batalia</div>
      <div>Courses : 5</div>
      <div>Duration : 40 hr</div>
    </Tilt>
  );
};

export default InstructorInfo;
