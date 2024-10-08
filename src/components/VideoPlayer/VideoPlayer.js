import React, { useState, useRef, useEffect } from "react";
import { video1, video2, video3 } from "../../assets";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoSources = [video1, video2, video3];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCaptionOn, setIsCaptionOn] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
    handleStop();
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videoSources.length - 1 : prevIndex - 1
    );
    handleStop();
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const showControls = () => {
    setIsControlsVisible(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
  };

  const hideControls = () => {
    const timeout = setTimeout(() => {
      if (!isSettingsOpen) {
        setIsControlsVisible(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  const handleMouseEnter = () => {
    showControls();
  };

  const handleMouseLeave = () => {
    hideControls();
  };

  const handleMouseMove = () => {
    showControls();
    hideControls();
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleCaption = () => {
    setIsCaptionOn(!isCaptionOn);
    // Implement caption logic here
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    if (!isSettingsOpen) {
      showControls();
    }
  };

  const handlePlaybackSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    // Implement quality change logic here
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.mozRequestFullScreen) {
        // Firefox
        playerRef.current.mozRequestFullScreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
        // IE/Edge
        playerRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  return (
    <div
      ref={playerRef}
      className="custom-video-player"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={videoSources[currentVideoIndex]}
        className="video-element"
        onClick={togglePlay}
      />
      <div
        className={`controls-container ${
          isControlsVisible ? "visible" : "hidden"
        }`}
      >
        <div className="button-group">
          <button onClick={handlePrevious} className="control-button previous">
            <i className="bx bx-skip-previous"></i>
          </button>
          <button onClick={togglePlay} className="control-button play-pause">
            {isPlaying ? (
              <i className="bx bx-pause"></i>
            ) : (
              <i className="bx bx-play"></i>
            )}
          </button>
          <button onClick={handleStop} className="control-button stop">
            <i className="bx bx-stop"></i>
          </button>
          <button onClick={handleNext} className="control-button next">
            <i className="bx bx-skip-next"></i>
          </button>
          <button onClick={toggleMute} className="control-button mute">
            <i
              className={`bx ${isMuted ? "bx-volume-mute" : "bx-volume-full"}`}
            ></i>
          </button>
          <button onClick={toggleCaption} className="control-button caption">
            <i
              className={`bx ${isCaptionOn ? "bx-captions" : "bx-caption"}`}
            ></i>
          </button>
          <button onClick={toggleSettings} className="control-button settings">
            <i className="bx bx-cog"></i>
          </button>
          <button
            onClick={toggleFullScreen}
            className="control-button fullscreen"
          >
            <i
              className={`bx ${
                isFullScreen ? "bx-exit-fullscreen" : "bx-fullscreen"
              }`}
            ></i>
          </button>
        </div>
        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar"
        />
      </div>
      {isSettingsOpen && (
        <div className="settings-menu">
          <div className="settings-option">
            <span>Playback Speed</span>
            <select
              value={playbackSpeed}
              onChange={(e) =>
                handlePlaybackSpeedChange(Number(e.target.value))
              }
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
          <div className="settings-option">
            <span>Quality</span>
            <select
              value={quality}
              onChange={(e) => handleQualityChange(e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
