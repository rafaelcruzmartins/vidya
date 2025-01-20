import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileBlank, Folder, FolderMinusSolid, Hdd } from "../assets";

const Welcome = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="intro-container"
  >
    <div className="welcome">Welcome</div>
    <div className="to">to</div>
    <div className="vidya">VIDYA</div>
    <div className="server-tagline">A Media Server for video lectures</div>
    <div className="server-description">
      The word "Vidya", meaning "knowledge" or "learning," is used in multiple
      Indian languages. It's a common term with Sanskrit origins that has been
      adopted by many Indian languages
    </div>
  </motion.div>
);

const Username = ({
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="username-container"
  >
    <div className="admin-setup">
      <div className="username-title">Create a Admin Username & Password</div>
    </div>
    <div className="username-label">Username</div>
    <div className="username-input">
      <input
        onChange={(e) => setUsernameInput(e.target.value)}
        value={usernameInput}
        type="text"
      />
    </div>
    <div className="password-label">Password</div>
    <div className="password-input">
      <input
        onChange={(e) => setPasswordInput(e.target.value)}
        value={passwordInput}
        type="password"
        name=""
        id=""
      />
    </div>
  </motion.div>
);

const FileBrowser = () => {
  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState([]);
  const [drives, setDrives] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parentDirectory, setParentDirectory] = useState(null);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.1.25:3001/api/drives");
      if (!response.ok) throw new Error("Failed to fetch drives");
      const data = await response.json();
      setDrives(data);
      // If no current path is set, use the first accessible drive
      if (!currentPath && data.length > 0) {
        const firstAccessibleDrive = data.find((drive) => drive.accessible);
        if (firstAccessibleDrive) {
          fetchDirectory(firstAccessibleDrive.path);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectory = async (path) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://192.168.1.25:3001/api/browse?path=${encodeURIComponent(path)}`
      );
      if (!response.ok) throw new Error("Failed to fetch directory contents");
      const data = await response.json();
      setItems(data.items);
      setCurrentPath(data.currentPath);
      setParentDirectory(data.parentDirectory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (parentDirectory) {
      fetchDirectory(parentDirectory);
    }
  };

  const savePath = async () => {
    try {
      const response = await fetch("http://192.168.1.25:3001/api/save-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPath }),
      });
      if (!response.ok) throw new Error("Failed to save path");
      const data = await response.json();
      alert(`Path saved successfully: ${data.savedPath}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === null) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  useEffect(() => {
    fetchDrives();
  }, []);
  return (
    <div className="drive-container">
      <div className="drive-setup">
        <div className="drive-title">Choose the Lecture directory</div>
      </div>
      <div className="drives">
        {drives.map((drive) => (
          <div
            key={drive.path}
            onClick={() => drive.accessible && fetchDirectory(drive.path)}
            className={`drive ${
              drive.accessible ? "accessible-drive" : "not-allowed-drive"
            }`}
          >
            <div className="drive-details">
              <div className="drive-icon">
                <Hdd />
              </div>
              <div className="drive-info">
                <div className="drive-label">{drive.label}</div>
                <div className="drive-path">{drive.path}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="current-path">{currentPath}</div>
      {parentDirectory && (
        <div className="parent-directory" onClick={handleBack}>
          ...
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="folder-list">
        {items.map((item) => (
          <div
            className="items"
            onClick={() =>
              item.isDirectory
                ? fetchDirectory(item.path)
                : setSelectedPath(item.path)
            }
          >
            {item.isDirectory ? <Folder /> : <FileBlank />}
            <div className="item-lable">{item.name}</div>
            {!item.isDirectory && (
              <span className="item-size">{formatFileSize(item.size)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FirstStartUp = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const tabs = [
    {
      title: "Welcome",
    },
    {
      title: "Username",
    },
    {
      title: "Drive",
    },
  ];

  const handleNext = () => {
    if (currentTab < tabs.length - 1) setCurrentTab(currentTab + 1);
  };

  const handleBack = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };

  return (
    <div>
      <div className="startup-wrap">
        <div className="first-startup-container">
          <AnimatePresence mode="wait">
            {currentTab === 0 && <Welcome />}
            {currentTab === 1 && (
              <Username
                usernameInput={usernameInput}
                setUsernameInput={setUsernameInput}
                passwordInput={passwordInput}
                setPasswordInput={setPasswordInput}
              />
            )}
            {currentTab === 2 && <FileBrowser />}
          </AnimatePresence>
          <div className="setup-buttons">
            {currentTab > 0 && <button onClick={handleBack}>Back</button>}
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstStartUp;
