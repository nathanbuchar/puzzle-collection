import React from 'react';
import { Link } from 'react-router-dom';
import { usePuzzles } from '../hooks/usePuzzles';
import styles from './VariantsPage.module.css';

function VariantsPage() {
  const { puzzles, loading, error } = usePuzzles();

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  // Filter for Politechnika and Politoys series
  const politechnikaPuzzles = puzzles.filter(p =>
    p.series === 'Politechnika' && p.status === 'A'
  );
  const politoysPuzzles = puzzles.filter(p =>
    p.series === 'Politoys' && p.status === 'A'
  );

  // Group Politechnika by batch and language
  const politechnikaBatch1 = politechnikaPuzzles.filter(p =>
    p.subSeries === 'First Batch'
  );
  const politechnikaBatch2 = politechnikaPuzzles.filter(p =>
    p.subSeries === 'Second Batch'
  );

  // Split Politoys into Magic Cubes and Rubik's Cubes
  const politoysMagicCubes = politoysPuzzles.filter(p =>
    p.item.includes('Magic Cube')
  );
  const politoysRubiksCubes = politoysPuzzles.filter(p =>
    p.item.includes("Rubik's Cube")
  );

  // Get unique variants for display - only include if they have photos
  const getUniqueVariants = (puzzleList) => {
    const variantMap = new Map();
    puzzleList.forEach(puzzle => {
      // Only include puzzles that have photos
      if (!puzzle.photos || puzzle.photos.length === 0) return;

      const key = puzzle.item;
      if (!variantMap.has(key)) {
        variantMap.set(key, puzzle);
      }
    });
    return Array.from(variantMap.values());
  };

  const uniquePolitechnikaBatch1 = getUniqueVariants(politechnikaBatch1);
  const uniquePolitechnikaBatch2 = getUniqueVariants(politechnikaBatch2);
  const uniquePolitoysMagicCubes = getUniqueVariants(politoysMagicCubes);
  const uniquePolitoysRubiksCubes = getUniqueVariants(politoysRubiksCubes);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Hungarian Variants Guide</h1>
        <p className={styles.subtitle}>
          Classification of Politechnika and Politoys Magic Cube variants produced in Hungary, 1977-1982.
          Note: Politechnika rebranded to Politoys in 1980—they are the same company operating under different names.
        </p>
      </header>

      <div className={styles.content}>
        {/* Politechnika Section */}
        <section className={styles.manufacturerSection}>
          <div className={styles.sectionHeader}>
            <h2>Politechnika</h2>
            <div className={styles.manufacturerInfo}>
              <p>
                <strong>Manufacturer:</strong> POLITECHNIKA Ipari Szövetkezet
              </p>
              <p>
                <strong>Location:</strong> Ecser, Hungary
              </p>
              <p>
                <strong>Production Period:</strong> 1977-1980
              </p>
              <p>
                <strong>Total Variants in Collection:</strong> {politechnikaPuzzles.length}
              </p>
            </div>
          </div>

          {/* Batch 1 */}
          <div className={styles.batchSection}>
            <h3>First Batch (1977-1978)</h3>
            <p className={styles.batchDescription}>
              The first production run of licensed Magic Cubes, characterized by distinctive packaging
              and cube construction. These earliest examples represent the initial commercial release
              of Rubik's invention outside of Hungary.
            </p>

            <div className={styles.variantGrid}>
              {uniquePolitechnikaBatch1.slice(0, 12).map(puzzle => {
                return (
                  <div key={puzzle.accessionNo} className={styles.variantCard}>
                    {puzzle.photos && puzzle.photos.length > 0 ? (
                      <Link to={`/puzzle/${puzzle.slug}`} className={styles.variantLink}>
                        <div className={styles.variantImage}>
                          <img
                            src={puzzle.photos[0]}
                            alt={puzzle.item}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className={styles.variantNoPhoto}>
                        <div className={styles.noPhotoPlaceholder}>
                          <span>No photo available</span>
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className={styles.viewAll}>
              <Link to="/collection?series=Politechnika&subSeries=First Batch">
                View all {politechnikaBatch1.length} First Batch variants →
              </Link>
            </p>
          </div>

          {/* Batch 2 */}
          <div className={styles.batchSection}>
            <h3>Second Batch (1979-1980)</h3>
            <p className={styles.batchDescription}>
              The second production run featured refined packaging and construction improvements.
              This batch saw wider international distribution with multiple language variants
              and promotional editions for Hungarian state enterprises.
            </p>

            <div className={styles.variantGrid}>
              {uniquePolitechnikaBatch2.slice(0, 12).map(puzzle => {
                return (
                  <div key={puzzle.accessionNo} className={styles.variantCard}>
                    {puzzle.photos && puzzle.photos.length > 0 ? (
                      <Link to={`/puzzle/${puzzle.slug}`} className={styles.variantLink}>
                        <div className={styles.variantImage}>
                          <img
                            src={puzzle.photos[0]}
                            alt={puzzle.item}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className={styles.variantNoPhoto}>
                        <div className={styles.noPhotoPlaceholder}>
                          <span>No photo available</span>
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className={styles.viewAll}>
              <Link to="/collection?series=Politechnika&subSeries=Second Batch">
                View all {politechnikaBatch2.length} Second Batch variants →
              </Link>
            </p>
          </div>
        </section>

        {/* Politoys Section */}
        <section className={styles.manufacturerSection}>
          <div className={styles.sectionHeader}>
            <h2>Politoys</h2>
            <div className={styles.manufacturerInfo}>
              <p>
                <strong>Manufacturer:</strong> POLITOYS Ipari Szövetkezet (formerly POLITECHNIKA)
              </p>
              <p>
                <strong>Location:</strong> Ecser, Hungary
              </p>
              <p>
                <strong>Production Period:</strong> 1980-1982
              </p>
              <p>
                <strong>Total Variants in Collection:</strong> {politoysPuzzles.length}
              </p>
            </div>
            <p className={styles.rebrandNote}>
              In 1980, POLITECHNIKA Ipari Szövetkezet changed its name to POLITOYS Ipari Szövetkezet.
              This was a rebranding of the same cooperative, not a new manufacturer. Production
              continued at the same facility in Ecser with similar manufacturing processes.
            </p>
          </div>

          {/* Magic Cubes */}
          <div className={styles.batchSection}>
            <h3>Magic Cubes (1980-1981)</h3>
            <p className={styles.batchDescription}>
              Following Politechnika's production, Politoys initially continued using the "Magic Cube"
              (Bűvös Kocka) name. These early Politoys examples maintain the original branding with
              distinct packaging designs and construction variations showing evolution in
              manufacturing techniques.
            </p>

            <div className={styles.variantGrid}>
              {uniquePolitoysMagicCubes.slice(0, 12).map(puzzle => {
                return (
                  <div key={puzzle.accessionNo} className={styles.variantCard}>
                    {puzzle.photos && puzzle.photos.length > 0 ? (
                      <Link to={`/puzzle/${puzzle.slug}`} className={styles.variantLink}>
                        <div className={styles.variantImage}>
                          <img
                            src={puzzle.photos[0]}
                            alt={puzzle.item}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className={styles.variantNoPhoto}>
                        <div className={styles.noPhotoPlaceholder}>
                          <span>No photo available</span>
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className={styles.viewAll}>
              <Link to="/collection?series=Politoys&query=Magic Cube">
                View all {politoysMagicCubes.length} Magic Cube variants →
              </Link>
            </p>
          </div>

          {/* Rubik's Cubes */}
          <div className={styles.batchSection}>
            <h3>Rubik's Cubes (1981-1982)</h3>
            <p className={styles.batchDescription}>
              Following the puzzle's introduction to the US market and international trademark
              registration, Politoys rebranded their production as "Rubik's Cube" (Rubik Kocka).
              This naming change reflects the puzzle's global standardization while maintaining
              Hungarian manufacturing traditions.
            </p>

            <div className={styles.variantGrid}>
              {uniquePolitoysRubiksCubes.slice(0, 12).map(puzzle => {
                return (
                  <div key={puzzle.accessionNo} className={styles.variantCard}>
                    {puzzle.photos && puzzle.photos.length > 0 ? (
                      <Link to={`/puzzle/${puzzle.slug}`} className={styles.variantLink}>
                        <div className={styles.variantImage}>
                          <img
                            src={puzzle.photos[0]}
                            alt={puzzle.item}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className={styles.variantNoPhoto}>
                        <div className={styles.noPhotoPlaceholder}>
                          <span>No photo available</span>
                        </div>
                        <div className={styles.variantInfo}>
                          <h4>{puzzle.item}</h4>
                          <span className={styles.accessionNo}>{puzzle.accessionNo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className={styles.viewAll}>
              <Link to="/collection?series=Politoys&query=Rubik's Cube">
                View all {politoysRubiksCubes.length} Rubik's Cube variants →
              </Link>
            </p>
          </div>
        </section>

        {/* Classification Notes */}
        <section className={styles.notesSection}>
          <h3>Classification Methodology</h3>
          <p>
            Variants are distinguished by packaging language, edition markings, sticker types
            (paper vs. printed), cube color, and promotional variations. Each represents a
            distinct production run or export market configuration.
          </p>
          <p>
            For detailed specifications including condition grades, provenance, and physical
            measurements, view individual item pages. See the{' '}
            <Link to="/glossary">Glossary</Link> for grading standards and terminology.
          </p>
        </section>
      </div>
    </div>
  );
}

export default VariantsPage;
