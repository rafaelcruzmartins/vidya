import python from "../assets/python.png";
import rails from "../assets/rails.png";
import javascript from "../assets/javascript.png";
import node from "../assets/node.png";
import mongodb from "../assets/mongodb.png";
import php from "../assets/php.png";
import webdev from "../assets/web-dev.jpg";
import Stats from "./Stats";
const Home = () => {
  return (
    <div className="main">
      <div className="container">
        <div className="pre-nav">
          <div className="left-group">
            <div className="menu-bar">
              <i className="bx bx-menu"></i>
            </div>
            <div className="server-name">VIDYA</div>
          </div>
          <div className="search-bar">
            <div className="search">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"
                  fill="#0A2463"
                />
              </svg>
            </div>
          </div>
          <div className="profile">
            <i className="bx bx-user"></i>
          </div>
        </div>
        <div className="nav-bar">
          <div className="nav-item active">Your Courses</div>

          <div className="nav-item">Web</div>
          <div className="nav-item">Mobile</div>
          <div className="nav-item">Finance</div>
          <div className="nav-item">Health</div>
          <div className="nav-item">Business</div>
        </div>
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
          <div className="continue-divs">
            <div className="cards">
              <div className="card-image">
                <img src={rails} alt="" />
              </div>
              <div className="card-info">
                Building Scalable Web Apps with Ruby on Rails
              </div>
            </div>
            <div className="cards">
              <div className="card-image">
                <img src={node} alt="" />
              </div>
              <div className="card-info">Node For Beginners</div>
            </div>
            <div className="cards">
              <div className="card-image">
                <img src={php} alt="" />
              </div>
              <div className="card-info">
                PHP Fundamentals: Web Development with PHP
              </div>
            </div>
          </div>
        </div>
        <div className="latest-courses">
          <p className="pinned-title">LATEST COURSES</p>
          <div className="continue-divs">
            <div className="cards">
              <div className="card-image">
                <img src={javascript} alt="" />
              </div>
              <div className="card-info">
                JavaScript: From Basics to Advanced
              </div>
            </div>
            <div className="cards">
              <div className="card-image">
                <img src={mongodb} alt="" />
              </div>
              <div className="card-info">Mastering MongoDB for Developers</div>
            </div>
            <div className="cards">
              <div className="card-image">
                <img src={webdev} alt="" />
              </div>
              <div className="card-info">Full Stack Web Development</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
