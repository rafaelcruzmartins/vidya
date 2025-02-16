import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useRef,
  useLayoutEffect,
} from "react";
import axios from "../api/axiosInstance.js";
import PreNav from "../components/Navbar/PreNav";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircleSolid,
  ChevronRight,
  Circle,
  SkeletonLoader,
} from "../assets";
import { useParams } from "react-router-dom";
const SectionHeader = memo(
  ({
    sectionOrder,
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
        {sectionOrder}: {title}
      </span>
      {hasLectures && (
        <span className={`chevron-icon ${isExpanded ? "expanded" : ""}`}>
          <div className="svg-div">
            <ChevronRight />
          </div>
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
    lectureOrder,
    nowPlaying,
    sectionOrder,
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
        <div className="svg-div">
          {isCompleted ? <CheckCircleSolid /> : <Circle />}
        </div>
      </span>
      <span className="lecture-title">
        {sectionOrder}.{lectureOrder}: {title}
      </span>
    </div>
  )
);

const Player = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [lectureDictionary, setLectureDictionary] = useState(null);
  const [initialVideoProgress, setInitialVideoProgress] = useState(0);
  const [playRequest, setPlayRequest] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [completedLectures, setCompletedLectures] = useState(new Set([]));
  const [completedSections, setCompletedSections] = useState(new Set([]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNextVideo, setIsNextVideo] = useState(null);
  const [isPrevVideo, setIsPrevVideo] = useState(null);
  const lectureRef = useRef({});
  const scrollTimeoutRef = useRef(null);
  const { id } = useParams();

  const handleNowPlaying = (lectureId) => {
    setNowPlaying(lectureId);

    setPlayRequest(true);
  };

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
        (section) => section.id === sectionId
      );
      if (!section) return false;
      return section.lectures.every((lecture) =>
        completedLectures.has(lecture.id)
      );
    },
    [courseData, completedLectures]
  );

  useEffect(() => {
    if (!courseData) return;
    const newCompletedSections = new Set();
    courseData.sections.forEach((section) => {
      if (areAllLecturesCompleted(section.id)) {
        newCompletedSections.add(section.id);
      }
    });
    setCompletedSections(newCompletedSections);
  }, [completedLectures, courseData, areAllLecturesCompleted]);
  const handleToggleLectureBackendComplete = async (lectureId) => {
    try {
      await axios.post(
        "/api/course/progress/lecturetogglecomplete",

        {
          LectureId: lectureId,
          CourseId: id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleToggleLectureBackendNotComplete = async (lectureId) => {
    try {
      await axios.post(
        "/api/course/progress/lecturetogglenotcomplete",

        {
          LectureId: lectureId,
          CourseId: id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLecture = useCallback((lectureId) => {
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lectureId)) {
        handleToggleLectureBackendNotComplete(lectureId);
        newSet.delete(lectureId);
      } else {
        handleToggleLectureBackendComplete(lectureId);
        newSet.add(lectureId);
      }
      return newSet;
    });
  }, []);

  const createLectureDictionary = (data) => {
    const lectureDict = {};
    let prevLectureId = null;
    const completedLectureIds = new Set();

    data.sections.forEach((section, sectionIndex) => {
      section.lectures.forEach((lecture, lectureIndex) => {
        const currentLectureId = lecture.id;
        const isLastLectureInCourse =
          sectionIndex === data.sections.length - 1 &&
          lectureIndex === section.lectures.length - 1;
        const isFirstLectureInCourse = sectionIndex === 0 && lectureIndex === 0;

        const nextLectureId = isLastLectureInCourse
          ? null
          : section.lectures[lectureIndex + 1]?.id ||
            data.sections[sectionIndex + 1]?.lectures[0]?.id;

        const isCompleted = lecture.lectureprogresses?.some(
          (progress) => progress.hasCompleted
        );

        if (isCompleted) {
          completedLectureIds.add(currentLectureId);
        }

        lectureDict[currentLectureId] = {
          url: `${process.env.REACT_APP_API}/api/course/stream/${lecture.id}`,
          next: nextLectureId,
          prev: isFirstLectureInCourse ? null : prevLectureId,
          content: lecture.content || [],
          progress: lecture.lectureprogresses || [],
          type: lecture.type,
          order: lecture.order,
          name: lecture.cleanedName,
          isCompleted,
        };

        prevLectureId = currentLectureId;
      });
    });

    setCompletedLectures(completedLectureIds);

    return lectureDict;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const newData = await axios.post(
          "/api/course/player",
          { CourseId: id },
          { withCredentials: true }
        );
        setCourseData(newData.data);
        setError(null);
        setLectureDictionary(createLectureDictionary(newData.data));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching course data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const initialload = () => {
      if (lectureDictionary && courseData.userlastwatcheds[0]) {
        const initiallecture = courseData.userlastwatcheds[0].LectureId;
        setNowPlaying(initiallecture);
        setInitialVideoProgress(
          lectureDictionary[initiallecture].progress[0].progress
        );
      }
    };
    initialload();
  }, [lectureDictionary]);
  const handleVideoEnd = () => {
    const next = lectureDictionary[nowPlaying].next;
    handleNowPlaying(next);
  };

  const handleLectureCompleteOnVideoEnd = () => {
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      if (!newSet.has(nowPlaying)) {
        handleToggleLectureBackendComplete(nowPlaying);
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

    const currentSection = courseData.sections.find((section) =>
      section.lectures.some((lecture) => lecture.id === nowPlaying)
    );

    if (currentSection) {
      setExpandedSections((prev) => new Set([...prev, currentSection.id]));
    }

    setCurrentVideo(lectureDictionary[nowPlaying].url);
    setIsPrevVideo(!!lectureDictionary[nowPlaying].prev);
    setIsNextVideo(!!lectureDictionary[nowPlaying].next);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (lectureRef.current[nowPlaying]) {
        lectureRef.current[nowPlaying].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [nowPlaying, courseData, isLoading, lectureDictionary]);

  if (error) {
    return <div className="error-message">Error loading course: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className="loading">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="main">
      <div className="container">
        <PreNav name={courseData?.cleanedName} />
        <div className="player-container">
          <VideoPlayer
            videoSource={currentVideo}
            initialVideoProgress={initialVideoProgress}
            onPlayRequest={playRequest}
            onVideoEnd={handleVideoEnd}
            onNextVideo={handleVideoNext}
            onPreviousVideo={handleVideoPrev}
            isNextVideo={isNextVideo}
            isPrevVideo={isPrevVideo}
            handleLectureCompleteOnVideoEnd={handleLectureCompleteOnVideoEnd}
            LectureId={nowPlaying}
            CourseId={id}
          />

          <div className="playlist-container">
            {courseData?.sections.map((section) => (
              <div key={section.id} className="section-item">
                <SectionHeader
                  sectionOrder={section.order}
                  title={section.cleanedName}
                  hasLectures={section.lectures.length > 0}
                  isSectionCompleted={completedSections.has(section.id)}
                  isExpanded={expandedSections.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                />
                <AnimatePresence>
                  {expandedSections.has(section.id) &&
                    section.lectures.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lectures-container"
                      >
                        {section.lectures.map((lecture) => (
                          <LectureItem
                            key={lecture.id}
                            lectureId={lecture.id}
                            lectureOrder={lecture.order}
                            sectionOrder={section.order}
                            title={lecture.cleanedName}
                            isCompleted={completedLectures.has(lecture.id)}
                            nowPlaying={nowPlaying}
                            handleNowPlaying={handleNowPlaying}
                            videoUrl={lecture.videoUrl}
                            onToggle={toggleLecture}
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
