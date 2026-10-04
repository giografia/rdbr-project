import arrowDownIcon from "../../assets/icons/arrowDown.svg";
import styles from "./Pagination.module.css";

function getPageItems(current, last) {
  const pages = [...new Set([1, current - 1, current, current + 1, last])]
    .filter((page) => page >= 1 && page <= last)
    .sort((a, b) => a - b);

  const items = [];
  pages.forEach((page, i) => {
    if (i > 0 && page - pages[i - 1] > 1) items.push(`gap-${page}`);
    items.push(page);
  });
  return items;
}

function Pagination({ current, last, onChange }) {
  if (last <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <div className={styles.pages}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          aria-label="Previous page"
        >
          <img src={arrowDownIcon} alt="" className={styles.prev} />
        </button>

        {getPageItems(current, last).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              className={`${styles.page} ${item === current ? styles.active : ""}`}
              onClick={() => onChange(item)}
              aria-current={item === current ? "page" : undefined}
            >
              {item}
            </button>
          ) : (
            <span key={item} className={styles.gap}>
              ...
            </span>
          ),
        )}
        <button
          type="button"
          className={styles.arrow}
          onClick={() => onChange(current + 1)}
          disabled={current === last}
          aria-label="Next page"
        >
          <img src={arrowDownIcon} alt="" className={styles.next} />
        </button>
      </div>
      <p className={styles.summary}>
        Page {current} of {last}
      </p>
    </nav>
  );
}

export default Pagination;
