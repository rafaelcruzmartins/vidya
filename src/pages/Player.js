import React, { useState, useCallback } from "react";
import PreNav from "../components/Navbar/PreNav";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { video1, video2, video3 } from "../assets";
const videoSource = [video1, video2, video3];
const Player = () => {
  const [currentVideo, setCurrentVideo] = useState(videoSource[0]);
  const [videoProgress, setVideoProgress] = useState({});
  const [playRequest, setPlayRequest] = useState(false);

  const handleProgressUpdate = useCallback(
    (currentTime, progressPercentage) => {
      setVideoProgress((prev) => ({
        ...prev,
        [currentVideo]: { currentTime, progressPercentage },
      }));
    },
    [currentVideo]
  );

  const handleVideoSelect = (videoPath) => {
    setCurrentVideo(videoPath);
    setPlayRequest(true);
  };
  return (
    <div className="main">
      <div className="container">
        <PreNav name={"Building Scalable Web Apps With Ruby On Rails"} />
        <div className="player-container">
          <div className="video-player-container">
            <VideoPlayer
              videoSource={currentVideo}
              onProgressUpdate={handleProgressUpdate}
              initialProgress={videoProgress[currentVideo]?.currentTime || 0}
              onPlayRequest={playRequest}
            />
          </div>
          <div className="playlist-container">
            {videoSource.map((video, index) => (
              <div
                className="videos"
                onClick={() => handleVideoSelect(video)}
                key={index}
              >
                Video {index}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
