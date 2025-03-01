import PreNav from "../components/Navbar/PreNav";
import InstructorInfo from "../components/Cards/InstructorInfo";
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
const Instructor = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const { data } = await axios.get("/api/instructor", {
          withCredentials: true,
        });
        setInstructors(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInstructor();
  }, []);
  return (
    <div>
      <div className="main">
        <div className="container">
          <PreNav name={"INSTRUCTOR"} />
          <div className="instructor-container">
            {instructors.map((data) => (
              <InstructorInfo data={data} key={data.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
