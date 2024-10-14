import React, { useState } from "react";
import { motion } from "framer-motion";
const Admin = () => {
  // Handle User Show With Animated icons
  const [selectedUser, setSelectedUser] = useState(null);
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const handleUserClick = (user) => {
    if (selectedUser === user) {
      setSelectedUser(null); // Deselect if the user is clicked again
    } else {
      setSelectedUser(user); // Select the user
    }
  };

  const makeAdmin = (user) => {
    console.log(`${user.name} is now an admin.`);
    // Add your admin logic here
  };

  const removeUser = (user) => {
    console.log(`${user.name} has been removed.`);
    // Add your remove logic here
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.2 }}
      className="settings-content"
    >
      <div className="settings-title">Admin Settings</div>
      <div className="folders-title">Folders</div>
      <div className="folder-div">
        <div className="folder-name-div">C:/Lectures/</div>
        <i class="bx bxs-folder-minus"></i>
      </div>
      <div className="folders-action-group">
        <div>
          Add Folder<i class="bx bxs-folder-plus"></i>
        </div>
        <div>
          Scan Folders<i class="bx bx-refresh"></i>
        </div>
      </div>
      <div className="users-title">Users</div>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info" onClick={() => handleUserClick(user.id)}>
              {user.name}
            </div>
            {selectedUser === user.id && (
              <div className="user-actions">
                <i
                  title="Make Admin"
                  className="bx bx-shield-plus"
                  onClick={() => makeAdmin(user)}
                ></i>
                <i
                  title="Remove User"
                  className="bx bxs-user-minus"
                  onClick={() => removeUser(user)}
                ></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Admin;
