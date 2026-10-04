import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { useAuth } from "../features/auth/authContext";
import ProfileForm from "../features/profile/ProfileForm";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { user, isBooting, openLogin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "tickets" ? "tickets" : "info";

  //if user is logged out login modal will pop up
  useEffect(() => {
    if (!isBooting && !user) openLogin();
  }, [isBooting, user]);
  if (isBooting) return null;

  if (!user) {
    return (
      <div className={`container ${styles.guest}`}>
        <EmptyState message="Log in to see your profile and tickets." />
        <Button onClick={openLogin}>Log in</Button>
      </div>
    );
  }
  function selectTab(next) {
    setSearchParams(next === "tickets" ? { tab: "tickets" } : {});
  }
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>My Profile</h1>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "info"}
            className={`${styles.tab} ${tab === "info" ? styles.active : ""}`}
            onClick={() => selectTab("info")}
          >
            Personal Information
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "tickets"}
            className={`${styles.tab} ${tab === "tickets" ? styles.active : ""}`}
            onClick={() => selectTab("tickets")}
          >
            My Tickets
          </button>
        </div>
        {tab === "info" ? (
          <ProfileForm key={user.id} />
        ) : (
          <p>TICKETS TAB SOON</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
