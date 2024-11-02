import Tilt from "react-parallax-tilt";
const CategoriesInfo = ({ name, bxname, color, animation, delay }) => {
  return (
    <div
      className="categories-parent"
      style={{
        animation: animation,
        animationDelay: delay,
      }}
    >
      <Tilt className="categories">
        <div className="categories-icon-circle">
          <div className="svg-div" style={{ cursor: "pointer", fill: color }}>
            {bxname}
          </div>
        </div>
        {name}
      </Tilt>
    </div>
  );
};

export default CategoriesInfo;
