import { getInitials } from "../../utils/user";
import styles from "./Avatar.module.css";

function Avatar({ user, size = 40, showStatus = false }) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      {user.avatar ? (
        <img src={user.avatar} alt="" className={styles.image} />
      ) : (
        <span
          className={styles.initials}
          style={{ fontSize: Math.round(size * 0.32) }}
        >
          {getInitials(user)}
        </span>
      )}

      {showStatus && (
        <span
          className={`${styles.status} ${user.profileComplete ? styles.complete : styles.incomplete}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export default Avatar;
