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

const animation = "fade .5s linear forwards";
const Categories = () => {
  return (
    <div className="main">
      <div className="container">
        <PreNav name={"Categories"} />

        <div className="categories-container">
          <CategoriesInfo
            name={"Web"}
            bxname={"bx bxs-file-js"}
            color={"#FB3640"}
            animation={animation}
            delay={"0"}
          />
          <CategoriesInfo
            name={"Mobile"}
            bxname={"bx bx-mobile-alt"}
            color={"#0A2463"}
            animation={animation}
            delay={".25s"}
          />
          <CategoriesInfo
            name={"Finance"}
            bxname={"bx bxs-bank"}
            color={"#DDD92A"}
            animation={animation}
            delay={".5s"}
          />
          <CategoriesInfo
            name={"Health"}
            bxname={"bx bx-plus-medical"}
            color={"#7A306C"}
            animation={animation}
            delay={".75s"}
          />
          <CategoriesInfo
            name={"Business"}
            bxname={"bx bxs-business"}
            color={"#00A6A6"}
            animation={animation}
            delay={"1s"}
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
