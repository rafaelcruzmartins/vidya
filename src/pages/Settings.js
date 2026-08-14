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
export default Settings;
