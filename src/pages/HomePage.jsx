import React from 'react';
import { Link } from 'react-router-dom';
import { usePuzzles } from '../hooks/usePuzzles';
import PuzzleCard from '../components/PuzzleCard/PuzzleCard';
import styles from './HomePage.module.css';

function HomePage() {
  const { puzzles, loading, error } = usePuzzles();

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading collection: {error.message}</p>
      </div>
    );
  }

  // Get featured puzzles (highest rarity)
  const featuredPuzzles = [...puzzles]
    .sort((a, b) => {
      const rarityA = parseInt(a.rarity.replace('R', ''));
      const rarityB = parseInt(b.rarity.replace('R', ''));
      return rarityB - rarityA; // Higher rarity first
    })
    .slice(0, 6);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Rare Twisty Puzzles from Hungary & Central/Eastern Europe</h1>
        <p className={styles.subtitle}>
          A curated collection of vintage mechanical puzzles from the 1970s and 1980s
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{puzzles.length}</span>
            <span className={styles.statLabel}>Items</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {new Set(puzzles.map(p => p.origin)).size}
            </span>
            <span className={styles.statLabel}>Countries</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {new Set(puzzles.map(p => p.series)).size}
            </span>
            <span className={styles.statLabel}>Series</span>
          </div>
        </div>
      </section>

      {/* Featured Puzzles */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>Featured Puzzles</h2>
          <Link to="/collection" className={styles.viewAll}>
            View All →
          </Link>
        </div>
        <div className={styles.grid}>
          {featuredPuzzles.map((puzzle) => (
            <PuzzleCard key={puzzle.accessionNo} puzzle={puzzle} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <h2>About the Collection</h2>
        <p>
          This collection showcases rare mechanical puzzles produced in Hungary,
          the Soviet Union, and other Central and Eastern European countries during
          the late 1970s and 1980s. Each piece is meticulously catalogued with
          detailed provenance information, condition assessments, and historical context.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
