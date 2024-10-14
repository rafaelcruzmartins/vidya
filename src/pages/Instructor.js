import PreNav from "../components/Navbar/PreNav";
import InstructorInfo from "../components/Cards/InstructorInfo";
const Instructor = () => {
  return (
    <div>
      <div className="main">
        <div className="container">
          <PreNav name={"INSTRUCTOR"} />
          <div className="instructor-container">
            <InstructorInfo />
            <InstructorInfo />
            <InstructorInfo />
            <InstructorInfo />
            <InstructorInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
