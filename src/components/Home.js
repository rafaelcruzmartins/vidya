import Background from "./Background";
const Home = () => {
  return (
    <div>
      <Background />
      <div className="home">
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
          <div className="nav-item">Your Courses</div>
          <div className="nav-item">Web</div>
          <div className="nav-item">Mobile</div>
          <div className="nav-item">Finance</div>
          <div className="nav-item">Health</div>
          <div className="nav-item">Business</div>
        </div>
        <div className="featured">Featured</div>
        <div className="progress">Progress</div>
        <div className="continue">Continue learning</div>
        <div className="latest-courses">Latest Courses</div>
      </div>
    </div>
  );
};

export default Home;
