import React, { useState, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import PreNav from "../components/Navbar/PreNav";
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
  const [activeTab, setActiveTab] = useState(validTab?.id || tabs[0].id);

  useEffect(() => {
    if (!validTab) {
      navigate(`/settings/${tabs[0].id}`, { replace: true });
    }
  }, [location.pathname, navigate, validTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/settings/${tabId}`);
  };

  return (
    <>
      <PreNav name="SETTINGS" />
      <div className="settings-container">
        <LayoutGroup>
          <div className="settings-sidebar">
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                className="sidebar-tab"
                onClick={() => handleTabChange(tab.id)}
                layout
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="active-indicator"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </LayoutGroup>

        <div className="settings-sidebar-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && <ProfileSettings />}
              {activeTab === "display" && <DisplaySettings />}
              {activeTab === "admin" && <Admin />}
            </motion.div>
          </AnimatePresence>
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
