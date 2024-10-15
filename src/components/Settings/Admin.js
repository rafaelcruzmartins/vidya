import React, { useState } from "react";
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

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
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
        return <div>Profile content goes here</div>;
      case "admin":
        return (
          <>
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
                  <button onClick={confirmAction}>Yes</button>
                  <button onClick={cancelAction}>No</button>
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
                style={{ color: "#45312d" }}
                onClick={closeModal}
              >
                Close
              </motion.div>
            </div>
          </div>
        )}
        {isAddUserModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add New User</h2>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name"
              />
              <div>
                <button onClick={addUser}>Add User</button>
                <button onClick={closeAddUserModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
