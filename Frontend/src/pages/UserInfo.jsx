import React, { useState, useEffect } from "react";
import styles from "../styles/Lecturer_In4.module.css";
import { FaEdit, FaCheck, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../contexts/AuthContext";

const UserInfo = () => {
  const { userInfo } = useAuth();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    if (userInfo) {
      setUserData({
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        username: userInfo.username || "",
        password: "********", 
        role: userInfo.role || "guest",
        phoneNumber: userInfo.phone_num || "",
        email: userInfo.email || "",
      });
    }
  }, [userInfo]);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentEditing, setCurrentEditing] = useState("");
  const [currentNewValue, setCurrentNewValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleEditPassword = () => {
    setIsEditingPassword(true);
    setNewPassword("");
    setShowNewPassword(false);
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setNewEmail("");
  };

  const handleCancelEdit = (field) => {
    if (field === "password") setIsEditingPassword(false);
    if (field === "email") setIsEditingEmail(false);
  };

  const handleSaveEdit = (field) => {
    if (field === "password" && newPassword) {
      setCurrentEditing("password");
      setCurrentNewValue(newPassword);
      setShowConfirmModal(true);
    }
    if (field === "email" && newEmail) {
      setCurrentEditing("email");
      setCurrentNewValue(newEmail);
      setShowConfirmModal(true);
    }
  };

  const confirmEdit = () => {
    if (currentEditing === "password") {
      setUserData({ ...userData, password: currentNewValue });
      setIsEditingPassword(false);
    }
    if (currentEditing === "email") {
      setUserData({ ...userData, email: currentNewValue });
      setIsEditingEmail(false);
    }
    setShowConfirmModal(false);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const initials = `${userData.firstName.charAt(0) || ""}${userData.lastName.charAt(0) || ""}`;
  const titleRole =
    userData.role.charAt(0).toUpperCase() + userData.role.slice(1);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageBackground}></div>
      <div className={styles.contentContainer}>
        <div className={styles.profileCard}>
          <h1 className={styles.title}>{titleRole} Information</h1>

          <div className={styles.profileSection}>
            <div className={styles.profilePicture}>
              {/* Initials avatar */}
              <div className={styles.initialsAvatar}>{initials}</div>
            </div>

            <div className={styles.infoContainer}>
              {/* First name */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>First Name:</div>
                <div className={styles.infoValue}>{userData.firstName}</div>
              </div>

              {/* Last name */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Last Name:</div>
                <div className={styles.infoValue}>{userData.lastName}</div>
              </div>

              {/* Username */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Username:</div>
                <div className={styles.infoValue}>{userData.username}</div>
              </div>

              {/* Password (masked) */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Password:</div>
                <div className={styles.infoValue}>
                  {isEditingPassword ? (
                    <div className={styles.editField}>
                      <div className={styles.passwordInputContainer}>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={styles.editInput}
                          placeholder="Enter new password"
                        />
                        <div
                          className={styles.passwordToggle}
                          onClick={toggleShowNewPassword}
                        >
                          {showNewPassword ? (
                            <FaEyeSlash className={styles.eyeIcon} />
                          ) : (
                            <FaEye className={styles.eyeIcon} />
                          )}
                        </div>
                      </div>
                      <div className={styles.editActions}>
                        <FaCheck
                          className={styles.saveIcon}
                          onClick={() => handleSaveEdit("password")}
                        />
                        <FaTimes
                          className={styles.cancelIcon}
                          onClick={() => handleCancelEdit("password")}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.passwordDisplay}>
                        <span>
                          {showPassword ? userData.password : "••••••••"}
                        </span>
                        <div
                          className={styles.passwordToggle}
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <FaEyeSlash className={styles.eyeIcon} />
                          ) : (
                            <FaEye className={styles.eyeIcon} />
                          )}
                        </div>
                      </div>
                      <FaEdit
                        className={styles.editIcon}
                        onClick={handleEditPassword}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Role:</div>
                <div className={styles.infoValue}>{titleRole}</div>
              </div>

              {/* Phone */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Phone Number:</div>
                <div className={styles.infoValue}>{userData.phoneNumber}</div>
              </div>

              {/* Email */}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Email:</div>
                <div className={styles.infoValue}>
                  {isEditingEmail ? (
                    <div className={styles.editField}>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className={styles.editInput}
                        placeholder="Enter new email"
                      />
                      <div className={styles.editActions}>
                        <FaCheck
                          className={styles.saveIcon}
                          onClick={() => handleSaveEdit("email")}
                        />
                        <FaTimes
                          className={styles.cancelIcon}
                          onClick={() => handleCancelEdit("email")}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{userData.email}</span>
                      <FaEdit
                        className={styles.editIcon}
                        onClick={handleEditEmail}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update your {currentEditing}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserInfo;
