import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePuzzles } from '../hooks/usePuzzles';
import PuzzleCard from '../components/PuzzleCard/PuzzleCard';
import styles from './PuzzleDetailPage.module.css';

function PuzzleDetailPage() {
  const { slug } = useParams();
  const { puzzles, loading, error } = usePuzzles();
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  // Extract accession number from slug (format: YYYY.NNN or YYYY-NNN)
  // Match patterns like "2021.016" or "2021-016" at the start of the slug
  const accessionMatch = slug.match(/^(\d{4}[.-]\d{3})/);
  const accessionNo = accessionMatch ? accessionMatch[1].replace('-', '.') : slug;

  // Find puzzle by accession number (not full slug)
  const puzzle = puzzles.find(p => p.accessionNo === accessionNo);
  if (!puzzle) return <div className={styles.notFound}>Puzzle not found</div>;

  // Find related puzzles (same series)
  const relatedPuzzles = puzzles
    .filter(p => p.series === puzzle.series && p.slug !== puzzle.slug)
    .slice(0, 3);

  const photos = puzzle.photos && puzzle.photos.length > 0 ? puzzle.photos : [];
  const hasPhotos = photos.length > 0;

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collection">Collection</Link>
        <span>/</span>
        <span>{puzzle.accessionNo}</span>
      </nav>

      <div className={styles.grid}>
        {/* Photo Gallery */}
        <section className={styles.photos}>
          {hasPhotos ? (
            <>
              <div className={styles.photoMain}>
                <img
                  src={photos[currentPhotoIndex]}
                  alt={`${puzzle.item} - Photo ${currentPhotoIndex + 1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className={styles.noPhoto} style={{ display: 'none' }}>
                  <span>Photo failed to load</span>
                </div>

                {/* Navigation arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      className={`${styles.photoNav} ${styles.photoNavPrev}`}
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      className={`${styles.photoNav} ${styles.photoNavNext}`}
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === photos.length - 1}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                    <div className={styles.photoCounter}>
                      {currentPhotoIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className={styles.photoThumbnails}>
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${index === currentPhotoIndex ? styles.thumbnailActive : ''}`}
                      onClick={() => setCurrentPhotoIndex(index)}
                      aria-label={`View photo ${index + 1}`}
                    >
                      <img src={photo} alt={`Thumbnail ${index + 1}`} referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.photoMain}>
              <div className={styles.noPhoto}>
                <span>No photos available</span>
              </div>
            </div>
          )}
          {hasPhotos && (
            <div className={styles.photoAttribution}>
              <p>
                Photo by{' '}
                <a href="https://n8.engineer" target="_blank" rel="noopener noreferrer">
                  Nathaniel Meyer
                </a>
                {' '}/ Licensed under{' '}
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
                  CC BY-NC-SA 4.0
                </a>
              </p>
            </div>
          )}
        </section>

        {/* Metadata */}
        <section className={styles.info}>
          <h1>{puzzle.item}</h1>

          {/* Overview */}
          <div className={styles.section}>
            <h2>Overview</h2>
            <dl>
              <dt>Accession Number</dt>
              <dd>{puzzle.accessionNo}</dd>

              <dt>Status</dt>
              <dd>
                <span
                  className={`${styles.badge} ${styles[`status${puzzle.status}`]}`}
                  title={puzzle.statusDescription}
                >
                  {puzzle.statusLabel}
                </span>
              </dd>

              <dt>Rarity</dt>
              <dd>
                <span
                  className={`${styles.badge} ${styles[`rarity${puzzle.rarity}`]}`}
                  title={puzzle.rarityDescription}
                >
                  {puzzle.rarity} - {puzzle.rarityLabel}
                </span>
              </dd>
            </dl>
          </div>

          {/* Production */}
          <div className={styles.section}>
            <h2>Production</h2>
            <dl>
              <dt>Manufacturer</dt>
              <dd>{puzzle.manufacturer}</dd>

              <dt>Origin</dt>
              <dd>{puzzle.origin}</dd>

              <dt>Year</dt>
              <dd>{puzzle.year}</dd>
            </dl>
          </div>

          {/* Physical Details */}
          <div className={styles.section}>
            <h2>Physical Details</h2>
            <dl>
              <dt>Size</dt>
              <dd>{puzzle.size || '-'}</dd>

              <dt>Weight</dt>
              <dd>{puzzle.weight || '-'}</dd>

              <dt>Color</dt>
              <dd>{puzzle.itemColor || '-'}</dd>

              <dt>Sticker Type</dt>
              <dd>{puzzle.stickerType || '-'}</dd>

              <dt>Color Scheme</dt>
              <dd>{puzzle.colorScheme || '-'}</dd>
            </dl>
          </div>

          {/* Condition */}
          <div className={styles.section}>
            <h2>Condition</h2>
            <dl>
              <dt>Item Grade</dt>
              <dd>
                <span
                  className={`${styles.grade} ${styles[`grade${puzzle.itemGrade}`]}`}
                  title={puzzle.itemGradeDescription}
                >
                  {puzzle.itemGrade || 'N/A'}
                  {puzzle.itemGrade && puzzle.itemGradeLabel && ` - ${puzzle.itemGradeLabel}`}
                </span>
              </dd>

              {puzzle.boxGrade && (
                <>
                  <dt>Box Grade</dt>
                  <dd>
                    <span
                      className={`${styles.grade} ${styles[`grade${puzzle.boxGrade}`]}`}
                      title={puzzle.boxGradeDescription}
                    >
                      {puzzle.boxGrade}
                      {puzzle.boxGradeLabel && ` - ${puzzle.boxGradeLabel}`}
                    </span>
                  </dd>
                </>
              )}

              {puzzle.papersGrade && (
                <>
                  <dt>Papers Grade</dt>
                  <dd>
                    <span
                      className={`${styles.grade} ${styles[`grade${puzzle.papersGrade}`]}`}
                      title={puzzle.papersGradeDescription}
                    >
                      {puzzle.papersGrade} - {puzzle.papersGradeLabel}
                    </span>
                  </dd>
                </>
              )}
            </dl>
          </div>

          {/* Classification */}
          <div className={styles.section}>
            <h2>Classification</h2>
            <dl>
              <dt>Collection</dt>
              <dd>{puzzle.collection}</dd>

              <dt>Series</dt>
              <dd>{puzzle.series}</dd>

              {puzzle.subSeries && (
                <>
                  <dt>Sub-Series</dt>
                  <dd>{puzzle.subSeries}</dd>
                </>
              )}
            </dl>
          </div>

          {/* Provenance */}
          {(puzzle.acquisition.date || puzzle.acquisition.means || puzzle.acquisition.medium ||
            puzzle.acquisition.origin || puzzle.acquisition.cost) && (
            <div className={styles.section}>
              <h2>Provenance</h2>
              <dl>
                {puzzle.acquisition.date && (
                  <>
                    <dt>Acquired</dt>
                    <dd>{puzzle.acquisition.date}</dd>
                  </>
                )}

                {puzzle.acquisition.means && (
                  <>
                    <dt>Method</dt>
                    <dd>{puzzle.acquisition.means}</dd>
                  </>
                )}

                {puzzle.acquisition.medium && (
                  <>
                    <dt>Source</dt>
                    <dd>{puzzle.acquisition.medium}</dd>
                  </>
                )}

                {puzzle.acquisition.origin && (
                  <>
                    <dt>Origin</dt>
                    <dd>{puzzle.acquisition.origin}</dd>
                  </>
                )}

                {puzzle.acquisition.cost && (
                  <>
                    <dt>Cost</dt>
                    <dd>{puzzle.acquisition.cost}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Notes */}
          {puzzle.notes && (
            <div className={`${styles.section} ${styles.notes}`}>
              <h2>Notes</h2>
              <p>{puzzle.notes}</p>
            </div>
          )}
        </section>
      </div>

      {/* Related Puzzles */}
      {relatedPuzzles.length > 0 && (
        <section className={styles.related}>
          <h2>Related Puzzles from {puzzle.series}</h2>
          <div className={styles.relatedGrid}>
            {relatedPuzzles.map(related => (
              <PuzzleCard key={related.accessionNo} puzzle={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default PuzzleDetailPage;
