const Cards = ({ imgsrc, info }) => {
  return (
    <>
      <div className="cards">
        <div className="card-image">
          <img src={imgsrc} alt="" />
        </div>
        <div className="card-info">{info}</div>
      </div>
    </>
  );
};

export default Cards;
