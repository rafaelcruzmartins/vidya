import {
  python,
  rails,
  javascript,
  node,
  mongodb,
  php,
  webdev,
} from "../assets";
import Stats from "../components/Stats";
import Navbar from "../components/Navbar/Navbar";
import Cards from "../components/Cards/Cards";

const Home = () => {
  return (
    <div className="main">
      <div className="container">
        <Navbar name={"VIDYA"} />
        <div className="featured">
          <p className="pinned-title">FEATURED</p>
          <div className="feat-stats">
            <div className="featured-course">
              <div className="featured-image">
                <img src={python} alt="" />
              </div>
              <div className="featured-info">
                <div className="featured-info-details">
                  <div className="info-title">Master Python in 30 Days</div>
                  <div className="instructor-name">by Andre Sivan</div>
                  <div className="play-button">Play Now</div>
                </div>
              </div>
            </div>
            <div className="stats">
              <Stats />
              <div className="watch">
                <div className="watch-hours">WATCH HOURS</div>
                <div className="hours">19H</div>
              </div>
              <div className="labels">
                <div className="label-names">
                  <div className="rectangle first"></div>Web - 40%
                </div>
                <div className="label-names">
                  <div className="rectangle second"></div>Mobile - 30%
                </div>
                <div className="label-names">
                  <div className="rectangle third"></div>Finance - 10%
                </div>
                <div className="label-names">
                  <div className="rectangle fourth"></div>Health - 12%
                </div>
                <div className="label-names">
                  <div className="rectangle fifth"></div>Others - 8%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="continue">
          <p className="pinned-title">CONTINUE LEARNING</p>
          <div className="card-divs">
            <Cards
              imgsrc={rails}
              info={"Building Scalable Web Apps with Ruby on Rails"}
            />
            <Cards imgsrc={node} info={"Node For Beginners"} />
            <Cards
              imgsrc={php}
              info={"PHP Fundamentals: Web Development with PHP"}
            />
          </div>
        </div>
        <div className="latest-courses">
          <p className="pinned-title">LATEST COURSES</p>
          <div className="card-divs">
            <Cards
              imgsrc={javascript}
              info={"JavaScript: From Basics to Advanced"}
            />
            <Cards imgsrc={mongodb} info={"Mastering MongoDB for Developers"} />
            <Cards imgsrc={webdev} info={"Mastering MongoDB for Developers"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
