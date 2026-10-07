import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useNowPlayingMovies, useComingSoonMovies } from "../movies/useMovies";

import Button from "../../components/ui/Button";
import searchIcon from "../../assets/icons/search.svg";
import closeIcon from "../../assets/icons/close.svg";
import popcornIcon from "../../assets/icons/popcorn.svg";
import styles from "./SearchBox.module.css";

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function SearchResult({ movie, onSelect }) {
  const meta = [
    capitalize(movie.kind),
    movie.ageRating.code,
    `${movie.runtimeMinutes} min`,
  ].join(" · ");

  const content = (
    <>
      <img src={movie.posterUrl} alt="" className={styles.poster} />
      <div className={styles.info}>
        <p className={styles.title}>{movie.title}</p>
        <p className={styles.meta}>{meta}</p>
      </div>
      {movie.isComingSoon ? (
        <span className={styles.soon}>Coming Soon</span>
      ) : (
        <span className={styles.price}>from ₾${movie.fromPrice}</span>
      )}
    </>
  );

  if (movie.isComingSoon) {
    return <div className={styles.result}>{content}</div>;
  }
  return (
    <Link
      to={`/movies/${movie.slug}`}
      className={`${styles.result} ${styles.link}`}
      onClick={onSelect}
    >
      {content}
    </Link>
  );
}

function SearchBox() {
  const navigate = useNavigate();
  const nowPlaying = useNowPlayingMovies();
  const comingSoon = useComingSoonMovies();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (!boxRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const allMovies = [...(nowPlaying.data ?? []), ...(comingSoon.data ?? [])];
  const term = query.trim().toLowerCase();
  const results = term
    ? allMovies.filter((m) => m.title.toLowerCase().includes(term))
    : [];

  function close() {
    setIsOpen(false);
    setQuery("");
    inputRef.current.blur();
  }
  function handleKeyDown(e) {
    if (e.key === "Escape") close();
  }
  function clear() {
    setQuery("");
    inputRef.current.focus();
  }
  function browseSessions() {
    close();
    navigate("/sessions");
  }
  function renderPanel() {
    if (!term) {
      return (
        <div className={styles.state}>
          <div className={styles.stateIcon}>
            <img src={popcornIcon} alt="" />
          </div>
          <div>
            <p className={styles.stateTitle}>What do you want to watch?</p>
            <p className={styles.stateText}>
              Search by title, director or cast
            </p>
          </div>
          <Button variant="ghost" onClick={browseSessions}>
            Browse all sessions
          </Button>
        </div>
      );
    }
    if (results.length === 0) {
      return (
        <div className={styles.state}>
          <div className={styles.stateIcon}>
            <img src={searchIcon} alt="" />
          </div>
          <div>
            <p className={styles.stateTitle}>No results for "{query.trim()}"</p>
            <p className={styles.stateText}>
              Check the spelling or try another film or live event
            </p>
          </div>
          <Button variant="ghost" onClick={browseSessions}>
            Browse all sessions
          </Button>
        </div>
      );
    }
    return (
      <>
        <div className={styles.header}>
          <span className={styles.heading}>Films &amp; Events</span>
          <span className={styles.count}>
            {results.length} {results.length === 1 ? "result" : "results"}
          </span>
        </div>
        <ul className={styles.list}>
          {results.map((movie) => (
            <li key={movie.id}>
              <SearchResult movie={movie} onSelect={close} />
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <div className={styles.search} ref={boxRef} onKeyDown={handleKeyDown}>
      <div className={styles.field}>
        <img src={searchIcon} alt="" className={styles.icon} />
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="Search films and live events"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          aria-label="Search films and live events"
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={clear}
            aria-label="Clear search"
          >
            <img src={closeIcon} alt="" />
          </button>
        )}
      </div>
      {isOpen && <div className={styles.panel}>{renderPanel()}</div>}
    </div>
  );
}
export default SearchBox;
