import { useNavigate } from "react-router-dom";
import { Play } from "../../assets";

const formatDuration = (seconds) => {
  if (!seconds) return null;
  const horas = Math.floor(seconds / 3600);
  const minutos = Math.round((seconds % 3600) / 60);
  if (horas > 0) return `${horas}h ${minutos}min`;
  return `${minutos}min`;
};

const Cards = ({
  index = 0,
  info,
  courseId,
  sectionCount = 0,
  lectureCount = 0,
  duration = 0,
  progress = 0,
}) => {
  const navigate = useNavigate();

  const handleCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const handlePlayer = (e) => {
    e.stopPropagation();
    navigate(`/course/play/${courseId}`);
  };

  // Sem capa, é isto que dá corpo ao cartão.
  const partes = [];
  if (sectionCount > 0) {
    partes.push(`${sectionCount} ${sectionCount === 1 ? "seção" : "seções"}`);
  }
  if (lectureCount > 0) {
    partes.push(`${lectureCount} ${lectureCount === 1 ? "aula" : "aulas"}`);
  }
  const tempo = formatDuration(duration);
  if (tempo) partes.push(tempo);

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="cards"
      onClick={handleCourse}
      style={{ "--i": index }}
    >
      <div className="card-head">
        <div className="card-info-course-title">{info}</div>
        <button className="card-play" onClick={handlePlayer} title="Assistir">
          <Play />
        </button>
      </div>

      {partes.length > 0 && (
        <div className="card-meta">{partes.join(" · ")}</div>
      )}

      <div className="card-progress">
        <div className="card-progress-track">
          <div className="card-progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <span className="card-progress-label">
          {pct > 0 ? `${pct}% concluído` : "Não iniciado"}
        </span>
      </div>
    </div>
  );
};

export default Cards;
