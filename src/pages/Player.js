import React, { useState, useCallback, useEffect, memo } from "react";
import axios from "axios";
import PreNav from "../components/Navbar/PreNav";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { video1, video2, video3 } from "../assets";
import { AnimatePresence, motion } from "framer-motion";

// Memoized components to prevent unnecessary re-renders
const SectionHeader = memo(
  ({ sectionId, title, hasLectures, isExpanded, onToggle }) => (
    <div onClick={onToggle} className="section-header">
      <span className="playlist-section-title">
        {sectionId}: {title}
      </span>
      {hasLectures && (
        <span className={`chevron-icon ${isExpanded ? "expanded" : ""}`}>
          <i class="bx bx-chevron-right"></i>
        </span>
      )}
    </div>
  )
);

const LectureItem = memo(
  ({ lectureId, title, isCompleted, videoUrl, onToggle, onVideoSelect }) => (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onVideoSelect(videoUrl);
      }}
      className="playlist-lecture-item"
    >
      <span
        className="checkbox"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(lectureId);
        }}
      >
        <i className={isCompleted ? "bx bxs-check-circle" : "bx bx-circle"}></i>
      </span>
      <span className="lecture-title">
        {lectureId}: {title}
      </span>
    </div>
  )
);

const videoSource = [video1, video2, video3];

const Player = () => {
  // State management with proper initialization
  const [currentVideo, setCurrentVideo] = useState(videoSource[0]);
  const [videoProgress, setVideoProgress] = useState({});
  const [playRequest, setPlayRequest] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([1]));
  const [completedLectures, setCompletedLectures] = useState(new Set(["1.1"]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounced progress update to reduce state updates
  const handleProgressUpdate = useCallback(
    (currentTime, progressPercentage) => {
      const timeoutId = setTimeout(() => {
        setVideoProgress((prev) => ({
          ...prev,
          [currentVideo]: { currentTime, progressPercentage },
        }));
      }, 1000); // Update progress every second instead of continuously

      return () => clearTimeout(timeoutId);
    },
    [currentVideo]
  );

  // Memoized video selection handler
  const handleVideoSelect = useCallback((videoPath) => {
    setCurrentVideo(videoPath);
    setPlayRequest(true);
  }, []);

  // Optimized section toggle using Set
  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Optimized lecture toggle using Set
  const toggleLecture = useCallback((lectureId) => {
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lectureId)) {
        newSet.delete(lectureId);
      } else {
        newSet.add(lectureId);
      }
      return newSet;
    });
  }, []);

  // Fetch data with proper error handling and loading states
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/data");
        setCourseData(res.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array since we only want to fetch once

  if (error) {
    return <div className="error-message">Error loading course: {error}</div>;
  }

  if (isLoading) {
    return <div className="loading">Loading course content...</div>;
  }

  return (
    <div className="main">
      <div className="container">
        <PreNav name="Building Scalable Web Apps With Ruby On Rails" />
        <div className="player-container">
          <VideoPlayer
            videoSource={currentVideo}
            onProgressUpdate={handleProgressUpdate}
            initialProgress={videoProgress[currentVideo]?.currentTime || 0}
            onPlayRequest={playRequest}
          />

          <div className="playlist-container">
            {courseData?.sections.map((section) => (
              <div key={section.sectionId} className="section-item">
                <SectionHeader
                  sectionId={section.sectionId}
                  title={section.title}
                  hasLectures={section.lectures.length > 0}
                  isExpanded={expandedSections.has(section.sectionId)}
                  onToggle={() => toggleSection(section.sectionId)}
                />
                <AnimatePresence>
                  {expandedSections.has(section.sectionId) &&
                    section.lectures.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lectures-container"
                      >
                        {section.lectures.map((lecture) => (
                          <LectureItem
                            key={lecture.lectureId}
                            lectureId={lecture.lectureId}
                            title={lecture.title}
                            isCompleted={completedLectures.has(
                              lecture.lectureId
                            )}
                            videoUrl={lecture.videoUrl}
                            onToggle={toggleLecture}
                            onVideoSelect={handleVideoSelect}
                          />
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Player);
