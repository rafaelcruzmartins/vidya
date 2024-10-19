import PreNav from "../components/Navbar/PreNav";
import InstructorInfo from "../components/Cards/InstructorInfo";
const instructorsData = [
  { name: "Alex Bataliga", id: 1, Courses: 5 },
  { name: "Sam Pitroda", id: 2, Courses: 7 },
  { name: "Ajay Kumar", id: 3, Courses: 6 },
  { name: "Sumit Singh", id: 4, Courses: 2 },
  { name: "Danish Kaneria", id: 5, Courses: 1 },
];
const Instructor = () => {
  return (
    <div>
      <div className="main">
        <div className="container">
          <PreNav name={"INSTRUCTOR"} />
          <div className="instructor-container">
            {instructorsData.map((data) => (
              <InstructorInfo data={data} key={data.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
