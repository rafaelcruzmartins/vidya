import Navbar from "../components/Navbar/Navbar";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
const Player = () => {
  return (
    <div className="main">
      <div className="container">
        <Navbar name={"Building Scalable Web Apps With Ruby On Rails"} />
        <div className="player-container">
          <div className="video-player-container">
            <VideoPlayer />
          </div>
          <div className="playlist-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Player;
