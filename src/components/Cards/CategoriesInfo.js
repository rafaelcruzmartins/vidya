import { useNavigate } from "react-router-dom";

const CategoriesInfo = ({ name, categoryId }) => {
  const navigate = useNavigate();
  const handleCategory = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };
  return (
    <div onClick={() => handleCategory(categoryId)} className="categories">
      {name}
    </div>
  );
};

export default CategoriesInfo;
