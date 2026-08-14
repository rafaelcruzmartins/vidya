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
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.js";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.js";
import Toast from "../components/Toast/Toast.js";
import {
  CheckCircleSolid,
  ChevronRight,
  Circle,
  FileArchiveSolid,
  FileBlankSolid,
  Html,
  FilePdfSolid,
  SkeletonLoader,
  VideoSolid,
  World,
  DotsVerticalRounded,
} from "../assets";
import { useParams, useLocation } from "react-router-dom";
import FileRenderer from "../components/FileRenderer/FileRenderer.js";
import Loader from "../components/Loader/Loader.js";
import { agruparSecoes } from "../utils/agruparSecoes";

// Formatos que o navegador exibe sozinho. Para eles abrir vale mais que
// baixar; o resto (zip e afins) continua como download.
const VIEWABLE = new Set(["pdf", "html", "txt", "md"]);

const ICON_MAP = {
  video: <VideoSolid />,
  pdf: <FilePdfSolid />,
  zip: <FileArchiveSolid />,
  html: <Html />,
  url: <World />,
};
const secondsToMinutesRounded = (seconds) => {
  const minutes = (seconds / 60).toFixed(1);
  return `${minutes}min`;
};
const LectureTypeIcon = memo(({ type }) => {
  return ICON_MAP[type.toLowerCase()] || <FileBlankSolid />;
});
const SectionHeader = memo(
  ({
    sectionOrder,
    title,
    hasLectures,
    isExpanded,
    onToggle,
    isSectionCompleted,
    duration,
    total,
  }) => (
    <div
      onClick={onToggle}
      className={`section-header ${isSectionCompleted ? "green" : ""}`}
    >
      <div className="section-title-wrap">
        <span className="playlist-section-title">
          {sectionOrder}: {title}
        </span>
        <div className="section-details">
          <span className="section-duration">
            {secondsToMinutesRounded(duration)}
          </span>
          <span className="section-lectures-total">
            {total} {total === 1 ? "aula" : "aulas"}
          </span>
        </div>
      </div>
      {hasLectures && (
        <span className={`chevron-icon ${isExpanded ? "expanded" : ""}`}>
          <div className="svg-div">
            <ChevronRight />
          </div>
        </span>
      )}
    </div>
  ),
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
    courseId,
    type,
    duration,
    content,
    setToastMessage,
    setToastType,
    setShowToast,
    courseName,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleMenu = (e) => {
      e.stopPropagation();
      if (isTagModalOpen) {
        setIsTagModalOpen(false);
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(!isMenuOpen);
      }
    };

    const handleAddTag = (e) => {
      e.stopPropagation();
      setIsTagModalOpen(true);
      setIsMenuOpen(false);
    };

    const handleAddBookmark = async (e) => {
      e.stopPropagation();
      try {
        await axios.post(
          "/api/course/tagsandbookmark",
          {
            lectureId,
            name: title,
            type: "bookmark",
            courseId,
            courseName,
          },
          { withCredentials: true },
        );
        setToastMessage("Aula adicionada aos marcadores");
        setToastType("success");
        setShowToast(true);
      } catch (error) {
        console.error(error);
        if (error.status === 409) {
          setToastMessage("Esta aula já está nos marcadores");
          setToastType("warning");
          setShowToast(true);
        }
      }
      setIsMenuOpen(false);
    };

    const handleTagSelection = async (tagType, e) => {
      e.stopPropagation();
      try {
        await axios.post(
          "/api/course/tagsandbookmark",
          {
            lectureId,
            name: title,
            type: tagType,
            courseId,
            courseName,
          },
          { withCredentials: true },
        );
        setToastMessage("Aula etiquetada");
        setToastType("success");
        setShowToast(true);
      } catch (error) {
        console.error(error);
        if (error.status === 409) {
          setToastMessage("Esta aula já está etiquetada");
          setToastType("warning");
          setShowToast(true);
        }
      }
      setIsTagModalOpen(false);
    };

    return (
      <>
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
          <span className="type-icon">
            <div className="svg-div">
              <LectureTypeIcon type={type} />
            </div>
          </span>
          <div className="lecture-title">
            {sectionOrder}.{lectureOrder}: {title}
            <div className="lecture-content-time">
              <div className="lecture-time">
                {type === "video" && secondsToMinutesRounded(duration)}
              </div>
            </div>
          </div>
          <div className="lecture-menu">
            <div onClick={toggleMenu}>
              <DotsVerticalRounded />
            </div>

            {isMenuOpen && (
              <div className="lecture-menu-modal">
                <div className="menu-option" onClick={handleAddTag}>
                  Etiquetar aula
                </div>
                <div className="menu-option" onClick={handleAddBookmark}>
                  Adicionar aos marcadores
                </div>
              </div>
            )}

            {isTagModalOpen && (
              <div className="tag-selection-modal">
                <div
                  className="tag-option"
                  data-tag="difficult"
                  onClick={(e) => handleTagSelection("difficult", e)}
                >
                  Difícil
                </div>
                <div
                  className="tag-option"
                  data-tag="need-review"
                  onClick={(e) => handleTagSelection("need-review", e)}
                >
                  Revisar
                </div>
                <div
                  className="tag-option"
                  data-tag="important"
                  onClick={(e) => handleTagSelection("important", e)}
                >
                  Importante
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  },
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
  const [subtitles, setSubtitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNextVideo, setIsNextVideo] = useState(null);
  const [isPrevVideo, setIsPrevVideo] = useState(null);
  const [defLang, setDefLang] = useState(null);
  const [totalLectures, setTotalLectures] = useState(null);
  const lectureRef = useRef({});
  const scrollTimeoutRef = useRef(null);
  const { id } = useParams();
  const {
    setToastMessage,
    setToastType,
    setShowToast,
    toastMessage,
    toastType,
    showToast,
  } = useAuth();
  const location = useLocation();
  const referalData = location.state;
  const handleNowPlaying = (lectureId) => {
    setNowPlaying(lectureId);

    if (lectureDictionary[lectureId].type === "video") {
      setInitialVideoProgress(0);
      setPlayRequest(false);
      setTimeout(() => setPlayRequest(true), 0);
    } else {
      setPlayRequest(false);
      setCompletedLectures((prev) => {
        const newSet = new Set(prev);
        if (!newSet.has(lectureId)) {
          handleToggleLectureBackendComplete(lectureId);
          newSet.add(lectureId);
        }
        return newSet;
      });
    }
  };
  useEffect(() => {
    const updateCourseProgress = async () => {
      try {
        if (completedLectures.size >= 1 && totalLectures) {
          await axios.post(
            "/api/course/progress/courseprogress",

            {
              progress: (completedLectures.size / totalLectures).toFixed(2),
              CourseId: id,
              hasCompleted: completedLectures.size === totalLectures,
            },
            { withCredentials: true },
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    updateCourseProgress();
  }, [completedLectures]);
  // Os módulos abrem por padrão: esconder tudo de uma vez faria o curso
  // parecer vazio ao abrir. Fechar é escolha de quem quer só a visão geral.
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const toggleGroup = useCallback((nome) => {
    setCollapsedGroups((prev) => {
      const novo = new Set(prev);
      if (novo.has(nome)) novo.delete(nome);
      else novo.add(nome);
      return novo;
    });
  }, []);

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
        (section) => section.id === sectionId,
      );
      if (!section) return false;
      return section.lectures.every((lecture) =>
        completedLectures.has(lecture.id),
      );
    },
    [courseData, completedLectures],
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
        { withCredentials: true },
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
        { withCredentials: true },
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
          (progress) => progress.hasCompleted,
        );

        if (isCompleted) {
          completedLectureIds.add(currentLectureId);
        }

        lectureDict[currentLectureId] = {
          url:
            lecture.type === "video"
              ? `/api/course/stream/${lecture.id}`
              : `/api/course/download/${lecture.id}`,
          next: nextLectureId,
          prev: isFirstLectureInCourse ? null : prevLectureId,
          progress: lecture.lectureprogresses || [],
          type: lecture.type,
          order: lecture.order,
          name: lecture.cleanedName,
          subtitles: lecture.subtitles || [],
          content: Array.isArray(lecture.content) ? lecture.content : [],
          sectionName: section.cleanedName,
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
          { withCredentials: true },
        );
        setCourseData(newData.data[0]);
        setError(null);
        const dict = await createLectureDictionary(newData.data[0]);
        setLectureDictionary(dict);
        setDefLang(newData.data[1].deflang);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching course data:", err);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const initialload = () => {
      if (
        lectureDictionary &&
        (referalData || courseData.courseprogresses[0]?.LectureId)
      ) {
        const initiallecture = referalData
          ? referalData
          : courseData.courseprogresses[0].LectureId;
        setNowPlaying(initiallecture);
        setInitialVideoProgress(
          lectureDictionary[initiallecture]?.progress?.[0]?.progress,
        );
      }

      if (lectureDictionary) {
        setTotalLectures(Object.keys(lectureDictionary).length);
        setIsLoading(false);
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
      section.lectures.some((lecture) => lecture.id === nowPlaying),
    );

    if (currentSection) {
      setExpandedSections((prev) => new Set([...prev, currentSection.id]));
    }

    setCurrentVideo(lectureDictionary[nowPlaying].url);
    setIsPrevVideo(!!lectureDictionary[nowPlaying].prev);
    setIsNextVideo(!!lectureDictionary[nowPlaying].next);
    if (lectureDictionary[nowPlaying].subtitles) {
      setSubtitles(lectureDictionary[nowPlaying].subtitles);
    }
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
        <Loader />
      </div>
    );
  }

  const currentMaterials = Array.isArray(
    lectureDictionary?.[nowPlaying]?.content,
  )
    ? lectureDictionary[nowPlaying].content.filter((item) => item?.type)
    : [];

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      <PreNav
        name={courseData?.cleanedName}
        progress={(completedLectures.size / totalLectures).toFixed(2) + "%"}
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        className="player-container"
      >
        <div className="player-main">
          {lectureDictionary[nowPlaying]?.type &&
          lectureDictionary[nowPlaying]?.type === "video" ? (
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
              subtitles={subtitles}
              deflang={defLang}
            />
          ) : (
            <FileRenderer
              fileType={lectureDictionary?.[nowPlaying]?.type}
              fileSrc={currentVideo}
              fileName={lectureDictionary[nowPlaying]?.cleanedName}
            />
          )}

          <div className="lecture-heading">
            <span className="lecture-heading-section">
              {lectureDictionary[nowPlaying]?.sectionName}
            </span>
            <h1 className="lecture-heading-title">
              {lectureDictionary[nowPlaying]?.name}
            </h1>
          </div>

          {currentMaterials.length > 0 && (
            <section className="lecture-materials">
              <h2 className="lecture-materials-title">Materiais desta aula</h2>
              <div className="materials-list">
                {currentMaterials.map((item, index) => {
                  const viewable = VIEWABLE.has(item.type?.toLowerCase());
                  const href =
                    "/api/course/content/" +
                    item.pathId +
                    (viewable ? "" : "?download=1");
                  return (
                    <a
                      key={item.pathId ?? index}
                      className="material-card"
                      href={href}
                      {...(viewable
                        ? { target: "_blank", rel: "noreferrer" }
                        : { download: true })}
                    >
                      <span className="material-card-icon">
                        <LectureTypeIcon type={item.type} />
                      </span>
                      <span className="material-card-text">
                        <span className="material-card-name">
                          {item.originalName}
                        </span>
                        <span className="material-card-action">
                          {viewable ? "Abrir em nova aba" : "Baixar"}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="playlist-container">
          <div className="playlist-header">Conteúdo do curso</div>
          {agruparSecoes(courseData?.sections).map((grupo, gi) => (
            <div key={grupo.nome ?? `g${gi}`} className="section-group">
              {grupo.nome && (
                <button
                  className={`section-group-title ${
                    collapsedGroups.has(grupo.nome) ? "" : "expanded"
                  }`}
                  onClick={() => toggleGroup(grupo.nome)}
                  aria-expanded={!collapsedGroups.has(grupo.nome)}
                >
                  <span className="section-group-chevron">
                    <ChevronRight />
                  </span>
                  <span className="section-group-name">{grupo.nome}</span>
                  <span className="section-group-count">
                    {grupo.sections.length}{" "}
                    {grupo.sections.length === 1 ? "seção" : "seções"}
                  </span>
                </button>
              )}
              {!(grupo.nome && collapsedGroups.has(grupo.nome)) &&
                grupo.sections.map((section) => (
                  <div key={section.id} className="section-item">
                    <SectionHeader
                      sectionOrder={section.order}
                      title={section.cleanedName}
                      hasLectures={section.lectures.length > 0}
                      isSectionCompleted={completedSections.has(section.id)}
                      isExpanded={expandedSections.has(section.id)}
                      duration={section.duration}
                      onToggle={() => toggleSection(section.id)}
                      total={section.lectures.length}
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
                            {section.lectures.map((lecture, index) => (
                              <LectureItem
                                key={lecture.id}
                                lectureId={lecture.id}
                                lectureOrder={index + 1}
                                sectionOrder={section.order}
                                title={lecture.cleanedName}
                                isCompleted={completedLectures.has(lecture.id)}
                                nowPlaying={nowPlaying}
                                handleNowPlaying={handleNowPlaying}
                                onToggle={toggleLecture}
                                lectureRef={lectureRef}
                                type={lecture.type}
                                duration={lecture.duration}
                                content={lecture.content}
                                courseId={id}
                                setToastMessage={setToastMessage}
                                setToastType={setToastType}
                                setShowToast={setShowToast}
                                courseName={courseData.cleanedName}
                              />
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default memo(Player);
