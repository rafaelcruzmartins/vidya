import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import PreNav from "../components/Navbar/PreNav";
import Admin from "../components/Settings/Admin";
import { useAuth } from "../context/AuthContext";
const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname.split("/").pop();

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "display", label: "Display" },
    ...(user?.role === "admin" ? [{ id: "admin", label: "Admin" }] : []),
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
      <PreNav name="SETTINGS" />
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
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "display" && <DisplaySettings />}
            {activeTab === "admin" && user?.role === "admin" && <Admin />}
          </div>
        </div>
      </div>
    </>
  );
};
const ProfileSettings = () => (
  <div className="settings-content">
    <div className="settings-title">Profile Settings</div>
    <div className="img-container">
      <img alt="profile" />
    </div>
    <div className="password-form">
      <label>Old Password</label>
      <input type="password" className="password" />
      <label>New Password</label>
      <input type="password" className="password" />
      <label>Confirm New Password</label>
      <input type="password" className="password" />
      <div className="change-password-button">Change Password</div>
    </div>
  </div>
);

const DisplaySettings = () => (
  <div className="settings-content">
    <div className="settings-title">Display Settings</div>
    <div className="theme-label">Theme</div>
    <select name="languages" id="lang">
      <option value="glassmorphism">Glassmorphism</option>
      <option value="clean">Clean</option>
      <option value="dark">Dark</option>
    </select>
  </div>
);
export default Settings;
