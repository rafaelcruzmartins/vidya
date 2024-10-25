import PreNav from "../components/Navbar/PreNav";
import CategoriesInfo from "../components/Cards/CategoriesInfo";
const colors = [
  "#3F6C51",
  "#FB3640",
  "#0A2463",
  "#DDD92A",
  "#7A306C",
  "#00A6A6",
];
const categoriesList = [
  {
    id: 1,
    name: "Web",
    bxname: "bx bxs-file-js",
    delay: "0",
    color: "#FB3640",
  },
  {
    id: 2,
    name: "Mobile",
    bxname: "bx bx-mobile-alt",
    delay: ".25s",
    color: "#0A2463",
  },
  {
    id: 3,
    name: "Finance",
    bxname: "bx bxs-bank",
    delay: ".5s",
    color: "#DDD92A",
  },
  {
    id: 4,
    name: "Health",
    bxname: "bx bx-plus-medical",
    delay: ".75s",
    color: "#7A306C",
  },
  {
    id: 5,
    name: "Business",
    bxname: "bx bxs-business",
    delay: "1s",
    color: "#00A6A6",
  },
];
const animation = "fade .5s linear forwards";
const Categories = () => {
  return (
    <div className="main">
      <div className="container">
        <PreNav name={"Categories"} />

        <div className="categories-container">
          {categoriesList.map((e) => (
            <CategoriesInfo
              name={e.name}
              bxname={e.bxname}
              color={e.color}
              animation={animation}
              delay={e.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
