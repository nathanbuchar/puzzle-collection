import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PuzzleCard.module.css';

function PuzzleCard({ puzzle }) {
  return (
    <article className={styles.card} data-accession={puzzle.accessionNo}>
      <Link to={`/puzzle/${puzzle.slug}`} className={styles.link}>
        {/* Photo thumbnail */}
        <div className={styles.photo}>
          {puzzle.photos && puzzle.photos.length > 0 ? (
            <>
              <img
                src={puzzle.photos[0]}
                alt={puzzle.item}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add(styles.noPhoto);
                }}
              />
              {puzzle.photos.length > 1 && (
                <span className={styles.photoBadge}>
                  {puzzle.photos.length} photos
                </span>
              )}
            </>
          ) : (
            <div className={styles.noPhotoPlaceholder}>
              <span>No photo</span>
            </div>
          )}
        </div>

        {/* Puzzle info */}
        <div className={styles.content}>
          <h3 className={styles.title}>{puzzle.item}</h3>

          <p className={styles.meta}>
            <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
            <span className={styles.separator}>•</span>
            <span className={styles.origin}>{puzzle.origin}</span>
          </p>

          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.seriesBadge}`}>
              {puzzle.series}
            </span>
            <span
              className={`${styles.badge} ${styles.rarityBadge} ${styles[`rarity${puzzle.rarity}`]}`}
              title={puzzle.rarityDescription}
            >
              {puzzle.rarity}
            </span>
            <span className={`${styles.badge} ${styles.yearBadge}`}>
              {puzzle.year}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default PuzzleCard;
