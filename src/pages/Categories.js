import PreNav from "../components/Navbar/PreNav";
import CategoriesInfo from "../components/Cards/CategoriesInfo";
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get("/api/category/-1", {
          withCredentials: true,
        });
        setCategoriesList(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);
  return (
    <>
      <PreNav name={"Categories"} />

      <div className="categories-container">
        {categoriesList.map((e) => (
          <CategoriesInfo name={e.category} categoryId={e.id} />
        ))}
      </div>
    </>
  );
};

export default Categories;
