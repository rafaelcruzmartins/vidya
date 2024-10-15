import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Admin = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ]);
  const [newUserName, setNewUserName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    setShowConfirmation(false);
  }, [activeTab]);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setInputValue(user.name);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowConfirmation(false);
  };

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setNewUserName("");
  };

  const makeAdmin = (user) => {
    console.log(`${user.name} is now an admin.`);
    closeModal();
  };

  const removeUser = (user) => {
    console.log(`${user.name} has been removed.`);
    setUsers(users.filter((u) => u.id !== user.id));
    closeModal();
  };

  const addUser = () => {
    if (newUserName.trim()) {
      const newUser = {
        id: users.length + 1,
        name: newUserName.trim(),
      };
      setUsers([...users, newUser]);
      closeAddUserModal();
    }
  };

  const handleAction = (actionType) => {
    setAction(actionType);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (action === "make admin") {
      makeAdmin(selectedUser);
    } else if (action === "remove") {
      removeUser(selectedUser);
    }
    setShowConfirmation(false);
  };

  const cancelAction = () => {
    setShowConfirmation(false);
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "admin", label: "Admin" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="modal-profile">
            <div className="modal-heading">{selectedUser.name}</div>
            <label htmlFor="">Username</label>
            <input
              type="text"
              className="input"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
            <label htmlFor="">Password</label>
            <input className="input" type="password" />
            <motion.div
              className="modal-buttons"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ color: "#00a6a6" }}
            >
              Save
            </motion.div>
          </div>
        );
      case "admin":
        return (
          <>
            <div className="user-edit-title">{selectedUser.name}</div>
            <div className="modal-action-button">
              <motion.div
                className="modal-buttons"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: "#00a6a6" }}
                onClick={() => handleAction("make admin")}
              >
                Make Admin
              </motion.div>
              <motion.div
                className="modal-buttons"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: "#e20044" }}
                onClick={() => handleAction("remove")}
              >
                Remove User
              </motion.div>
            </div>
            {showConfirmation && (
              <div className="confirmation-popup">
                <p className="confirmation-message">
                  Are you sure you want to {action} {selectedUser?.name}?
                </p>
                <div className="confirmation-buttons">
                  <motion.div
                    className="modal-buttons"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      color: action === "make admin" ? "#00a6a6" : "#e20044",
                    }}
                    onClick={confirmAction}
                  >
                    Yes
                  </motion.div>
                  <motion.div
                    className="modal-buttons"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ color: "#0a2463" }}
                    onClick={cancelAction}
                  >
                    No
                  </motion.div>
                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-content">
      <div className="settings-title">Admin Settings</div>
      <div className="folders-title">Folders</div>
      <div className="folder-div">
        <div className="folder-name-div">C:/Lectures/</div>
        <i className="bx bxs-folder-minus"></i>
      </div>
      <div className="folders-action-group">
        <div>
          Add Folder<i className="bx bxs-folder-plus"></i>
        </div>
        <div>
          Scan Folders<i className="bx bx-refresh"></i>
        </div>
      </div>
      <div className="users-title">
        Users
        <i
          title="Add User"
          className="bx bx-plus"
          onClick={openAddUserModal}
        ></i>
      </div>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">{user.name}</div>
            <i
              title="Edit User"
              className="bx bx-dots-vertical-rounded"
              onClick={() => openModal(user)}
            ></i>
          </div>
        ))}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="tabs-container">
                <div className="tabs">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`tab ${
                        activeTab === tab.id ? "active-tab" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>
                <div className="tab-content">{renderTabContent()}</div>
              </div>
              <motion.div
                className="modal-buttons"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: "#45312d", marginTop: "1rem" }}
                onClick={closeModal}
              >
                Close
              </motion.div>
            </div>
          </div>
        )}
        {isAddUserModalOpen && (
          <div className="modal-overlay">
            <div className="modal small-modal">
              <div className="add-user-modal">
                <div className="modal-heading">Add New User</div>
                <input
                  className="input"
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  autoFocus
                />
                <div className="modal-buttons-group-user">
                  <motion.div
                    className="modal-buttons"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ color: "#00a6a6" }}
                    onClick={addUser}
                  >
                    Add User
                  </motion.div>
                  <motion.div
                    className="modal-buttons"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ color: "#45312d" }}
                    onClick={closeAddUserModal}
                  >
                    Cancel
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
