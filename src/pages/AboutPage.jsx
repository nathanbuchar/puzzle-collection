import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>About the Collection</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Collection Focus</h2>
          <p>
            This collection showcases rare mechanical puzzles produced in Hungary,
            the Soviet Union, and other Central and Eastern European countries during
            the late 1970s and 1980s. Each piece represents a unique chapter in the
            history of twisty puzzles, documenting regional manufacturing variations,
            production techniques, and design evolution.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Historical Context</h2>
          <p>
            Following Ernő Rubik's invention of the Magic Cube in 1974, Hungarian
            production began through licensed manufacturers like Politechnika and
            Politoys. Soviet and Eastern European variants soon followed, each
            reflecting local manufacturing capabilities and aesthetic choices.
          </p>
          <p>
            These puzzles remain significant artifacts of Cold War-era consumer
            production and intellectual property dynamics, offering insight into
            regional industrial capacity and cultural exchange during a transformative
            period.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Cataloging Methodology</h2>
          <p>
            The collection follows museum standards for documentation, employing
            systematic condition assessment, provenance tracking, and rarity
            evaluation. Each item receives a unique accession number and comprehensive
            metadata spanning 28 fields.
          </p>
          <p>
            Condition grades follow established collectibles standards (Mint through
            Poor), while rarity assessments (R1-R6) consider production quantities,
            survival rates, and market availability. See the{' '}
            <Link to="/glossary">Glossary</Link> for complete reference information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Collection Statistics</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>271</span>
              <span className={styles.statLabel}>Total Items</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>1974-1989</span>
              <span className={styles.statLabel}>Date Range</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>Multiple</span>
              <span className={styles.statLabel}>Countries</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Access & Research</h2>
          <p>
            This digital catalog provides public access to collection documentation.
            Researchers and enthusiasts may browse the complete{' '}
            <Link to="/collection">collection</Link>, filter by various criteria,
            and examine detailed metadata for each item.
          </p>
          <p>
            For inquiries regarding specific items, research access, or collection
            development, please contact the curator.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Photo Licensing</h2>
          <p>
            All collection photographs have been made available by{' '}
            <a href="https://n8.engineer" target="_blank" rel="noopener noreferrer">
              Nathaniel Meyer
            </a>{' '}
            and are licensed under a{' '}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
            </a>.
          </p>
          <p>
            If you wish to share, reupload, or distribute any of these images, please
            provide proper attribution. The following is an example of a good attribution:
          </p>
          <blockquote className={styles.attribution}>
            <em>
              Photo by{' '}
              <a href="https://n8.engineer" target="_blank" rel="noopener noreferrer">
                Nathaniel Meyer
              </a>
              {' '}/ Licensed under{' '}
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
                CC BY-NC-SA 4.0
              </a>
            </em>
          </blockquote>
          <p>
            For questions regarding licensing or proper attribution, contact{' '}
            <a href="mailto:hello@n8.engineer">hello@n8.engineer</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
