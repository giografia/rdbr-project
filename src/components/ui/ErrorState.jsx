import Button from "./Button";
import styles from "./ErrorState.module.css";

function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <p>{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={() => onRetry()}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
