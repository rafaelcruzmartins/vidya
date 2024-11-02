import PreNav from "../components/Navbar/PreNav";
import CategoriesInfo from "../components/Cards/CategoriesInfo";
import {
  BankSolid,
  BusinessSolid,
  FileJsSolid,
  MobileAlt,
  PlusMedical,
} from "../assets";
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
    bxname: <FileJsSolid />,
    delay: "0",
    color: "#FB3640",
  },
  {
    id: 2,
    name: "Mobile",
    bxname: <MobileAlt />,
    delay: ".25s",
    color: "#0A2463",
  },
  {
    id: 3,
    name: "Finance",
    bxname: <BankSolid />,
    delay: ".5s",
    color: "#DDD92A",
  },
  {
    id: 4,
    name: "Health",
    bxname: <PlusMedical />,
    delay: ".75s",
    color: "#7A306C",
  },
  {
    id: 5,
    name: "Business",
    bxname: <BusinessSolid />,
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
