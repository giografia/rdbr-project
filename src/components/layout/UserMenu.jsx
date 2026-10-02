import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../../features/auth/authContext";
import Avatar from "../ui/Avatar";
import { getDisplayName } from "../../utils/user";
import arrowDown from "../../assets/icons/arrowDown.svg";
import userIcon from "../../assets/icons/user.svg";
import ticketIcon from "../../assets/icons/ticket.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import checkIcon from "../../assets/icons/check.svg";
import styles from "./UserMenu.module.css";

function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (!menuRef.current.contains(e.target)) setIsOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
  }
  function handleLogout() {
    close();
    logout();
  }

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Avatar user={user} size={40} showStatus />
        <span className={styles.name}>{getDisplayName(user)}</span>
        <img
          src={arrowDown}
          alt=""
          className={`${styles.arrowDown} ${isOpen ? styles.arrowDownOpen : ""}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.header}>
            <Avatar user={user} size={52} showStatus />
            <div className={styles.identity}>
              <p className={styles.fullName}>
                {user.fullName || user.username}
              </p>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>

          {user.profileComplete ? (
            <div className={`${styles.status} ${styles.statusComplete}`}>
              <p className={styles.statusTitle}>
                Profile Complete <img src={checkIcon} alt="" />
              </p>
            </div>
          ) : (
            <div className={`${styles.status} ${styles.statusIncomplete}`}>
              <p className={styles.statusTitle}>Profile incomplete</p>
              <p className={styles.statusText}>
                Please complete your profile to enable booking
              </p>
            </div>
          )}
          <div className={styles.links}>
            <Link
              to="/profile"
              className={styles.item}
              onClick={close}
              role="menuitem"
            >
              <img src={userIcon} alt="" />
              My Profile
            </Link>
            <Link
              to="/profile#tickets"
              className={styles.item}
              onClick={close}
              role="menuitem"
            >
              <img src={ticketIcon} alt="" />
              My Tickets
            </Link>
          </div>

          <button
            type="button"
            className={`${styles.item} ${styles.logout}`}
            onClick={handleLogout}
            role="menuitem"
          >
            <img src={logoutIcon} alt="" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
