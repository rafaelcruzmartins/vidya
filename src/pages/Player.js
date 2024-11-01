import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useRef,
  useLayoutEffect,
} from "react";
import axios from "axios";
import PreNav from "../components/Navbar/PreNav";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";

// Memoized components to prevent unnecessary re-renders
const SectionHeader = memo(
  ({
    sectionId,
    title,
    hasLectures,
    isExpanded,
    onToggle,
    isSectionCompleted,
  }) => (
    <div
      onClick={onToggle}
      className={`section-header ${isSectionCompleted ? "green" : ""}`}
    >
      <span className="playlist-section-title">
        {sectionId}: {title}
      </span>
      {hasLectures && (
        <span className={`chevron-icon ${isExpanded ? "expanded" : ""}`}>
          <i className="bx bx-chevron-right"></i>
        </span>
      )}
    </div>
  )
);

const LectureItem = memo(
  ({
    lectureId,
    title,
    isCompleted,
    onToggle,
    handleNowPlaying,
    lectureRef,
    nowPlaying,
  }) => (
    <div
      ref={(el) => (lectureRef.current[lectureId] = el)}
      onClick={(e) => {
        e.stopPropagation();

        handleNowPlaying(lectureId);
      }}
      className={`playlist-lecture-item ${
        lectureId === nowPlaying ? "now-playing" : ""
      }`}
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

const Player = () => {
  // State management with proper initialization
  const [currentVideo, setCurrentVideo] = useState(null);
  const [nowPlaying, setNowPlaying] = useState("7.3");
  const [lectureDictionary, setLectureDictionary] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [playRequest, setPlayRequest] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [completedLectures, setCompletedLectures] = useState(
    new Set(["1.1", "7.1"])
  );
  const [completedSections, setCompletedSections] = useState(new Set([]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNextVideo, setIsNextVideo] = useState(null);
  const [isPrevVideo, setIsPrevVideo] = useState(null);
  const lectureRef = useRef({});
  const scrollTimeoutRef = useRef(null);

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
  const handleNowPlaying = (lectureId) => {
    setNowPlaying(lectureId);
    setPlayRequest(true);
  };
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
  const areAllLecturesCompleted = useCallback(
    (sectionId) => {
      if (!courseData) return false;

      const section = courseData.sections.find(
        (section) => section.sectionId === sectionId
      );

      if (!section) return false;

      return section.lectures.every((lecture) =>
        completedLectures.has(lecture.lectureId)
      );
    },
    [courseData, completedLectures]
  );

  // Update section completion states when lectures change
  useEffect(() => {
    if (!courseData) return;

    const newCompletedSections = new Set();

    courseData.sections.forEach((section) => {
      if (areAllLecturesCompleted(section.sectionId)) {
        newCompletedSections.add(section.sectionId);
      }
    });

    setCompletedSections(newCompletedSections);
  }, [completedLectures, courseData, areAllLecturesCompleted]);

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
  // Function to make lecture dictionary from fetched coursedata

  const createLectureDictionary = (data) => {
    const lectureDict = {};
    let prevLectureId = null;

    data.sections.forEach((section, sectionIndex) => {
      section.lectures.forEach((lecture, lectureIndex) => {
        const currentLectureId = lecture.lectureId;
        const isLastLectureInCourse =
          sectionIndex === data.sections.length - 1 &&
          lectureIndex === section.lectures.length - 1;
        const isFirstLectureInCourse = sectionIndex === 0 && lectureIndex === 0;

        // Determine the next lecture ID
        const nextLectureId = isLastLectureInCourse
          ? null // Only the last lecture in the last section should have null as next
          : section.lectures[lectureIndex + 1]?.lectureId ||
            data.sections[sectionIndex + 1]?.lectures[0]?.lectureId;

        // Add current lecture to the dictionary with URLs and navigation pointers
        lectureDict[currentLectureId] = {
          url: lecture.videoUrl,
          next: nextLectureId,
          prev: isFirstLectureInCourse ? null : prevLectureId,
        };

        // Update prevLectureId for the next iteration
        prevLectureId = currentLectureId;
      });
    });

    return lectureDict;
  };
  // Fetch data with proper error handling and loading states
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/data");
        setCourseData(res.data);
        setError(null);
        setLectureDictionary(createLectureDictionary(res.data));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array since we only want to fetch once
  const handleVideoEnd = () => {
    const next = lectureDictionary[nowPlaying].next;
    handleNowPlaying(next);
  };

  const handleLectureCompleteOnVideoEnd = () => {
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nowPlaying)) {
        return newSet;
      } else {
        newSet.add(nowPlaying);
      }
      return newSet;
    });
  };
  const handleVideoNext = () => {
    const next = lectureDictionary[nowPlaying].next;
    handleNowPlaying(next);
  };

  const handleVideoPrev = () => {
    const prev = lectureDictionary[nowPlaying].prev;
    handleNowPlaying(prev);
  };
  useLayoutEffect(() => {
    if (!courseData || isLoading || !nowPlaying) return;

    const currentSectionId = parseInt(nowPlaying.split(".")[0]);

    // First, ensure the section is expanded
    setExpandedSections((prev) => new Set([...prev, currentSectionId]));
    setCurrentVideo(lectureDictionary[nowPlaying].url);
    // Set is Previuos video and next video button to be disabled on not
    lectureDictionary[nowPlaying].prev
      ? setIsPrevVideo(true)
      : setIsPrevVideo(false);

    lectureDictionary[nowPlaying].next
      ? setIsNextVideo(true)
      : setIsNextVideo(false);

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Wait for the animation to complete before scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (lectureRef.current[nowPlaying]) {
        lectureRef.current[nowPlaying].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300); // Adjust timing based on your animation duration

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [nowPlaying, courseData, isLoading]);

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
            onVideoEnd={handleVideoEnd}
            onNextVideo={handleVideoNext}
            onPreviousVideo={handleVideoPrev}
            isNextVideo={isNextVideo}
            isPrevVideo={isPrevVideo}
            handleLectureCompleteOnVideoEnd={handleLectureCompleteOnVideoEnd}
          />

          <div className="playlist-container">
            {courseData?.sections.map((section) => (
              <div key={section.sectionId} className="section-item">
                <SectionHeader
                  sectionId={section.sectionId}
                  title={section.title}
                  hasLectures={section.lectures.length > 0}
                  isSectionCompleted={completedSections.has(section.sectionId)}
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
                            nowPlaying={nowPlaying}
                            handleNowPlaying={handleNowPlaying}
                            videoUrl={lecture.videoUrl}
                            onToggle={toggleLecture}
                            onVideoSelect={handleVideoSelect}
                            lectureRef={lectureRef}
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
