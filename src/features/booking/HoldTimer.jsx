import { useEffect, useState } from "react";
import styles from "./HoldTimer.module.css";

function getSecondsLeft(expiresAt) {
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.round(msLeft / 1000));
}
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}: ${seconds}`;
}
function HoldTimer({ expiresAt, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsLeft(expiresAt),
  );

  useEffect(() => {
    const id = setInterval(() => {
      const left = getSecondsLeft(expiresAt);
      setSecondsLeft(left);
      if (left == 0) {
        clearInterval(id);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);

  return (
    <div className={styles.timer}>
      <span className={styles.label}>Seats held</span>
      <span className={styles.time}>{formatTime(secondsLeft)}</span>
    </div>
  );
}

export default HoldTimer;
