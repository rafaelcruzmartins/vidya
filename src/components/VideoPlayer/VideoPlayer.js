import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useCallback, memo, useEffect } from "react";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const Controls = memo(
  ({
    isPlaying,
    isMuted,
    isCaptionOn,
    isFullScreen,
    currentTime,
    duration,
    buffered,
    volume,
    playbackSpeed,
    isAutoplayOn,
    onPlayPause,
    onStop,
    onMute,
    onVolumeChange,
    onCaption,
    onFullScreen,
    onSkipForward,
    onSkipBackward,
    onNextVideo,
    onPreviousVideo,
    onAutoplayToggle,
    onPlaybackSpeedChange,
    isPrevVideo,
    isNextVideo,
    onSeek,
  }) => {
    const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
    const progress = (currentTime / duration) * 100 || 0;

    const handleProgressClick = (e) => {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      onSeek(newTime);
    };

    return (
      <div className="video-controls">
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar">
            <div className="buffer-bar" style={{ width: `${buffered}%` }}></div>
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="controls-main">
          <div className="controls-left">
            <div
              onClick={onPreviousVideo}
              style={{ opacity: isPrevVideo ? "" : "0.7" }}
              className="control-button"
            >
              <i className="bx bx-skip-previous"></i>
            </div>
            <div onClick={onSkipBackward} className="control-button">
              <i className="bx bx-rewind"></i>
            </div>
            <div onClick={onPlayPause} className="control-button">
              <i className={`bx ${isPlaying ? "bx-pause" : "bx-play"}`}></i>
            </div>
            <div onClick={onSkipForward} className="control-button">
              <i className="bx bx-fast-forward"></i>
            </div>
            <div
              onClick={isNextVideo ? onNextVideo : undefined}
              style={{ opacity: isNextVideo ? "" : "0.7" }}
              className="control-button"
            >
              <i className="bx bx-skip-next"></i>
            </div>
            <div
              className="volume-container"
              onMouseEnter={() => setIsVolumeSliderVisible(true)}
              onMouseLeave={() => setIsVolumeSliderVisible(false)}
            >
              <div onClick={onMute} className="control-button">
                <i
                  className={`bx ${
                    isMuted
                      ? "bxs-volume-mute"
                      : volume === 0
                      ? "bxs-volume-mute"
                      : volume < 0.5
                      ? "bxs-volume-low"
                      : "bxs-volume-full"
                  }`}
                ></i>
              </div>
              <AnimatePresence>
                {isVolumeSliderVisible && (
                  <div className="volume-slider">
                    <motion.input
                      initial={{ width: 0 }}
                      animate={{ width: "5rem" }}
                      exit={{ width: 0 }}
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) =>
                        onVolumeChange(parseFloat(e.target.value))
                      }
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="controls-right">
            <div onClick={onAutoplayToggle} className="control-button">
              <i
                style={{ color: isAutoplayOn ? "#e20044" : "whitesmoke" }}
                className="bx bx-repeat"
              ></i>
            </div>
            <div onClick={onCaption} className="control-button">
              <i
                className={`bx ${isCaptionOn ? "bx-captions" : "bxs-captions"}`}
              ></i>
            </div>
            <div
              onClick={() =>
                onPlaybackSpeedChange(
                  playbackSpeed >= 2 ? 0.5 : playbackSpeed + 0.5
                )
              }
              className="control-button playback-speed"
            >
              {playbackSpeed} X
            </div>
            <div onClick={onFullScreen} className="control-button">
              <i
                className={`bx ${
                  isFullScreen ? "bx-exit-fullscreen" : "bx-fullscreen"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const VideoPlayer = ({
  videoSource,
  onVideoEnd,
  onNextVideo,
  onPreviousVideo,
  onProgressUpdate,
  onPlayRequest,
  isNextVideo,
  isPrevVideo,
  handleLectureCompleteOnVideoEnd,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [state, setState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    isMuted: false,
    isCaptionOn: false,
    isFullScreen: false,
    playbackSpeed: 1,
    isAutoplayOn: true,
    showControls: true,
  });

  useEffect(() => {
    if (videoRef.current) {
      if (onPlayRequest) {
        videoRef.current.play();
        setState((prev) => ({
          ...prev,
          isPlaying: true,
        }));
      }
    }
  }, [videoSource]);
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setState((prev) => ({
      ...prev,
      currentTime: video.currentTime,
    }));
    onProgressUpdate?.(
      video.currentTime,
      (video.currentTime / video.duration) * 100
    );
  }, [onProgressUpdate]);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.buffered.length) return;
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;
    setState((prev) => ({
      ...prev,
      buffered: (bufferedEnd / duration) * 100,
    }));
  }, []);

  const handleSeek = useCallback((newTime) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = newTime;
  }, []);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (state.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, [state.isPlaying]);

  const handleMouseMove = useCallback(() => {
    setState((prev) => ({ ...prev, showControls: true }));

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, showControls: false }));
    }, 3000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setState((prev) => ({ ...prev, showControls: false }));
  }, []);

  const handleStop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const handleSkipForward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  }, []);

  const handleSkipBackward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setState((prev) => ({
      ...prev,
      volume: newVolume,
      isMuted: newVolume === 0,
    }));
  }, []);

  const handleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const newMutedState = !state.isMuted;
    video.muted = newMutedState;
    setState((prev) => ({
      ...prev,
      isMuted: newMutedState,
    }));
  }, [state.isMuted]);

  const handleFullScreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setState((prev) => ({ ...prev, isFullScreen: true }));
    } else {
      document.exitFullscreen();
      setState((prev) => ({ ...prev, isFullScreen: false }));
    }
  }, []);

  const handlePlaybackSpeedChange = useCallback((speed) => {
    const video = videoRef.current;
    if (!video) return;

    setState((prev) => ({
      ...prev,
      playbackSpeed: speed,
    }));

    if (state.isPlaying) {
      video.playbackRate = state.playbackSpeed;
    }
  }, []);

  const handleAutoplayToggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAutoplayOn: !prev.isAutoplayOn,
    }));
  }, []);

  const handleCaption = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCaptionOn: !prev.isCaptionOn,
    }));
  }, []);

  const handleVideoEnd = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    handleLectureCompleteOnVideoEnd();
    if (state.isAutoplayOn && onVideoEnd) {
      onVideoEnd?.();
    }
  }, [state.isAutoplayOn, onVideoEnd]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("loadedmetadata", () => {
      setState((prev) => ({
        ...prev,
        duration: video.duration,
      }));
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [handleTimeUpdate, handleProgress, handleVideoEnd]);

  React.useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="video-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoSource}
        className="video-element"
        onClick={handlePlayPause}
      />
      <AnimatePresence>
        {state.showControls && (
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            transition={{ type: "tween", ease: "easeInOut" }}
            className="controls-wrapper"
          >
            <Controls
              isPlaying={state.isPlaying}
              isMuted={state.isMuted}
              isCaptionOn={state.isCaptionOn}
              isFullScreen={state.isFullScreen}
              currentTime={state.currentTime}
              duration={state.duration}
              buffered={state.buffered}
              volume={state.volume}
              playbackSpeed={state.playbackSpeed}
              isAutoplayOn={state.isAutoplayOn}
              isNextVideo={isNextVideo}
              isPrevVideo={isPrevVideo}
              onPlayPause={handlePlayPause}
              onStop={handleStop}
              onMute={handleMute}
              onVolumeChange={handleVolumeChange}
              onCaption={handleCaption}
              onFullScreen={handleFullScreen}
              onSkipForward={handleSkipForward}
              onSkipBackward={handleSkipBackward}
              onNextVideo={onNextVideo}
              onPreviousVideo={onPreviousVideo}
              onAutoplayToggle={handleAutoplayToggle}
              onPlaybackSpeedChange={handlePlaybackSpeedChange}
              onSeek={handleSeek}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(VideoPlayer);
