import React, { useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import PreNav from "../components/Navbar/PreNav";
import { profile } from "../assets";
import Admin from "../components/Settings/Admin";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "display", label: "Display" },
  { id: "admin", label: "Admin" },
];

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  const validTab = tabs.find((tab) => tab.id === path);
  var statetab = null;
  if (validTab) {
    statetab = validTab.id;
  } else {
    navigate(`/settings/${tabs[0].id}`);
  }
  const [activeTab, setActiveTab] = useState(statetab);

  useEffect(() => {
    if (validTab) {
      setActiveTab(validTab.id);
    } else {
      navigate(`/settings/${tabs[0].id}`);
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/settings/${tabId}`);
  };

  return (
    <div className="main">
      <div className="container">
        <PreNav name="SETTINGS" />
        <div className="settings-container">
          <LayoutGroup>
            <div className="settings-sidebar">
              {tabs.map((tab) => (
                <motion.div
                  key={tab.id}
                  className={`sidebar-tab ${
                    activeTab === tab.id ? "active-settings" : ""
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                  layout
                >
                  {tab.label}
                </motion.div>
              ))}
            </div>
          </LayoutGroup>

          <div className="settings-sidebar-info">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "display" && <DisplaySettings />}
            {activeTab === "admin" && <Admin />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => (
  <div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.2 }}
    className="settings-content"
  >
    <div className="settings-title">Profile Settings</div>
    <div className="img-container">
      <img src={profile} alt="profile picture" />
    </div>
    <div className="password-form">
      <label htmlFor="">Old Password</label>
      <input type="password" className="password" />
      <label htmlFor="">New Password</label>
      <input type="password" className="password" />
      <label htmlFor="">Confirm New Password</label>
      <input type="password" className="password" />
      <div className="change-password-button">Change Password</div>
    </div>
  </div>
);

const DisplaySettings = () => (
  <div
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    transition={{ duration: 0.2 }}
    className="settings-content"
  >
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
