import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../components/Toast/Toast";
import PreNav from "../components/Navbar/PreNav";
import Admin from "../components/Settings/Admin";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosInstance";
const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname.split("/").pop();

  const tabs = [
    { id: "profile", label: "Perfil" },
    { id: "display", label: "Aparência" },
    { id: "courses", label: "Cursos visíveis" },
    ...(user?.role === "admin" ? [{ id: "admin", label: "Administração" }] : []),
  ];

  const validTab = tabs.find((tab) => tab.id === path);
  const [activeTab, setActiveTab] = useState(validTab?.id || tabs[0].id);

  useEffect(() => {
    if (path === "admin" && user?.role !== "admin") {
      navigate(`/settings/${tabs[0].id}`, { replace: true });
      return;
    }

    if (!validTab) {
      navigate(`/settings/${tabs[0].id}`, { replace: true });
    } else {
      setActiveTab(validTab.id);
    }
  }, [location.pathname, navigate, validTab, path, user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/settings/${tabId}`, { replace: true });
  };

  return (
    <>
      <PreNav name="CONFIGURAÇÕES" />
      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              className={`sidebar-tab ${
                activeTab === tab.id ? "active-indicator" : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </motion.div>
          ))}
        </div>
        <div className="settings-sidebar-info">
          <div style={{ height: "100%" }} key={activeTab}>
            {activeTab === "profile" && <ProfileSettings user={user} />}
            {activeTab === "display" && <DisplaySettings />}
            {activeTab === "courses" && <CourseVisibility />}
            {activeTab === "admin" && user?.role === "admin" && <Admin />}
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileSettings = ({ user }) => {
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Concluído com sucesso");
  const [toastType, setToastType] = useState("success");

  const handlePassChange = async () => {
    setShowToast(false);

    if (newPass.length > 0 && confirmNewPass.length > 0) {
      if (newPass !== confirmNewPass) {
        setToastType("error");
        setToastMessage("Passwords don't match");
        setShowToast(true);
        return;
      }

      if (newPass.length < 8) {
        setToastType("error");
        setToastMessage("Password must be at least 8 characters long");
        setShowToast(true);
        return;
      }

      try {
        const response = await axios.post(
          "/api/auth/password-change",
          {
            newPassword: newPass,
          },
          { withCredentials: true }
        );

        setToastType("success");
        setToastMessage("Senha alterada com sucesso");
        setShowToast(true);
        setNewPass("");
        setConfirmNewPass("");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Não foi possível alterar a senha";
        setToastType("error");
        setToastMessage(errorMessage);
        setShowToast(true);
        console.error("Password change error:", error);
      }
    } else {
      setToastType("error");
      setToastMessage("Preencha os dois campos de senha");
      setShowToast(true);
    }
  };
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
      <div className="settings-content">
        <div className="settings-title">Perfil</div>
        <div className="img-container">{user?.username}</div>
        <div className="password-form">
          <label>Nova senha</label>
          <input
            type="password"
            className="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <label>Confirmar nova senha</label>
          <input
            type="password"
            className="password"
            value={confirmNewPass}
            onChange={(e) => setConfirmNewPass(e.target.value)}
          />
          <div onClick={handlePassChange} className="change-password-button">
            Alterar senha
          </div>
        </div>
      </div>
    </>
  );
};

const DisplaySettings = () => (
  <div className="settings-content">
    <div className="settings-title">Aparência</div>
    <div className="theme-label">Tema</div>
    <p className="settings-hint">
      Use o botão de sol e lua na barra superior para alternar entre claro e
      escuro. Sem escolha manual, o VIDYA segue o tema do sistema.
    </p>
  </div>
);
// Ocultar é por conta: o catálogo no disco não muda e as outras contas
// seguem enxergando tudo.
const CourseVisibility = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    axios
      .get("/api/user/course-visibility", { withCredentials: true })
      .then((r) => ativo && setCourses(r.data))
      .catch(() => ativo && setErro("Não foi possível carregar os cursos"))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, []);

  const alternar = async (course) => {
    const novo = !course.hidden;
    // Aplica na hora e desfaz se o servidor recusar: o interruptor não pode
    // ficar esperando a rede para responder ao clique.
    setCourses((atual) =>
      atual.map((c) => (c.id === course.id ? { ...c, hidden: novo } : c)),
    );
    try {
      await axios.put(
        "/api/user/course-visibility",
        { courseId: course.id, hidden: novo },
        { withCredentials: true },
      );
    } catch {
      setCourses((atual) =>
        atual.map((c) => (c.id === course.id ? { ...c, hidden: !novo } : c)),
      );
      setErro("Não foi possível salvar a alteração");
    }
  };

  const ocultos = courses.filter((c) => c.hidden).length;

  return (
    <div className="settings-content">
      <div className="settings-title">Cursos visíveis</div>
      <p className="settings-hint">
        Desmarque os cursos que você não quer ver. A escolha vale só para esta
        conta — os arquivos continuam no disco e as outras contas seguem
        enxergando tudo.
      </p>

      {loading && <p className="settings-hint">Carregando...</p>}
      {erro && <p className="settings-error">{erro}</p>}

      {!loading && courses.length === 0 && (
        <p className="settings-hint">Nenhum curso na biblioteca ainda.</p>
      )}

      {!loading && courses.length > 0 && (
        <>
          <p className="settings-hint">
            {ocultos === 0
              ? "Todos os cursos estão visíveis."
              : `${ocultos} ${
                  ocultos === 1 ? "curso oculto" : "cursos ocultos"
                } de ${courses.length}.`}
          </p>
          <ul className="visibility-list">
            {courses.map((course) => (
              <li key={course.id} className="visibility-item">
                <label className="visibility-label">
                  <input
                    type="checkbox"
                    checked={!course.hidden}
                    onChange={() => alternar(course)}
                  />
                  <span className="visibility-name">{course.cleanedName}</span>
                </label>
                {course.hidden && (
                  <span className="visibility-badge">Oculto</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Settings;
