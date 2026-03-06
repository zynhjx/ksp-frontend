import React from "react";
import styles from "./PageError.module.css";

function PageError({ message = "Something went wrong.", onRetry }) {
  return (
    <div className={styles.pageErrorContainer}>
      {/* Custom inline SVG error icon */}
      <svg
        className={styles.errorIcon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <circle cx="32" cy="32" r="30" fill="#FF4D4F" />
        <line x1="20" y1="20" x2="44" y2="44" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
        <line x1="44" y1="20" x2="20" y2="44" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
      </svg>

      <p className={styles.errorMessage}>{message}</p>


        <button className={styles.retryButton} onClick={onRetry}>
            Retry
        </button>

    </div>
  );
}

export default PageError;