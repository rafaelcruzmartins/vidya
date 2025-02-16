import PreNav from "../components/Navbar/PreNav";
import CategoriesInfo from "../components/Cards/CategoriesInfo";

const categoriesList = [
  {
    id: 1,
    name: "Web",
  },
  {
    id: 2,
    name: "Mobile",
  },
  {
    id: 3,
    name: "Finance",
  },
  {
    id: 4,
    name: "Health",
  },
  {
    id: 5,
    name: "Business",
  },
];

const Categories = () => {
  return (
    <div className="main">
      <div className="container">
        <PreNav name={"Categories"} />

        <div className="categories-container">
          {categoriesList.map((e) => (
            <CategoriesInfo name={e.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
