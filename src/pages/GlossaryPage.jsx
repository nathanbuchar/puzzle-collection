import React from 'react';
import styles from './GlossaryPage.module.css';

function GlossaryPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Glossary & Reference</h1>
        <p className={styles.subtitle}>
          Understanding the cataloging system for rare twisty puzzles
        </p>
      </header>

      {/* Condition Grades */}
      <section className={styles.section}>
        <h2>Condition Grades</h2>
        <p className={styles.sectionIntro}>
          Condition assessments follow museum standards for collectible items,
          evaluating physical state and preservation quality.
        </p>

        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>M</span>
            </div>
            <div className={styles.cell}>
              <strong>Mint</strong>
            </div>
            <div className={styles.cell}>
              Never-used and in perfect condition
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>NM</span>
            </div>
            <div className={styles.cell}>
              <strong>Near Mint</strong>
            </div>
            <div className={styles.cell}>
              Possibly used but must appear to be new
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>EX</span>
            </div>
            <div className={styles.cell}>
              <strong>Excellent</strong>
            </div>
            <div className={styles.cell}>
              Used, but barely with very minor signs of wear
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>VG</span>
            </div>
            <div className={styles.cell}>
              <strong>Very Good</strong>
            </div>
            <div className={styles.cell}>
              Looks very good but has minor blemishes or light color fading
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>G</span>
            </div>
            <div className={styles.cell}>
              <strong>Good</strong>
            </div>
            <div className={styles.cell}>
              Looks used with defects
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>F</span>
            </div>
            <div className={styles.cell}>
              <strong>Fair</strong>
            </div>
            <div className={styles.cell}>
              Looks significantly used with serious defects
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>P</span>
            </div>
            <div className={styles.cell}>
              <strong>Poor</strong>
            </div>
            <div className={styles.cell}>
              Barely collectible, severe damage or heavy use
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>U</span>
            </div>
            <div className={styles.cell}>
              <strong>Unknown</strong>
            </div>
            <div className={styles.cell}>
              Component condition is unknown (e.g., sealed in box)
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>X</span>
            </div>
            <div className={styles.cell}>
              <strong>Missing</strong>
            </div>
            <div className={styles.cell}>
              Component is assumed or known to have existed but is missing
            </div>
          </div>
        </div>
      </section>

      {/* Rarity Levels */}
      <section className={styles.section}>
        <h2>Rarity Scale</h2>
        <p className={styles.sectionIntro}>
          Rarity assessments consider production quantities, survival rates,
          and market availability for Eastern European puzzle variants.
        </p>

        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>R1</span>
            </div>
            <div className={styles.cell}>
              <strong>Common</strong>
            </div>
            <div className={styles.cell}>
              Easy to find
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>R2</span>
            </div>
            <div className={styles.cell}>
              <strong>Less common</strong>
            </div>
            <div className={styles.cell}>
              Somewhat difficult to find
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>R3</span>
            </div>
            <div className={styles.cell}>
              <strong>Scarce</strong>
            </div>
            <div className={styles.cell}>
              Difficult to find
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>R4</span>
            </div>
            <div className={styles.cell}>
              <strong>Rare</strong>
            </div>
            <div className={styles.cell}>
              Very difficult to find
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>R5</span>
            </div>
            <div className={styles.cell}>
              <strong>Very rare</strong>
            </div>
            <div className={styles.cell}>
              Almost impossible to find
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>R6</span>
            </div>
            <div className={styles.cell}>
              <strong>Unique</strong>
            </div>
            <div className={styles.cell}>
              Unique, or nearly so
            </div>
          </div>
        </div>
      </section>

      {/* Status Codes */}
      <section className={styles.section}>
        <h2>Collection Status</h2>
        <p className={styles.sectionIntro}>
          Status codes indicate the current position of items within
          the collection management system.
        </p>

        <div className={styles.table}>
          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>A</span>
            </div>
            <div className={styles.cell}>
              <strong>Accessioned</strong>
            </div>
            <div className={styles.cell}>
              Active in collection
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>L</span>
            </div>
            <div className={styles.cell}>
              <strong>On Loan</strong>
            </div>
            <div className={styles.cell}>
              Currently on loan to another institution
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>M</span>
            </div>
            <div className={styles.cell}>
              <strong>Missing</strong>
            </div>
            <div className={styles.cell}>
              Item is missing from the collection
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>X</span>
            </div>
            <div className={styles.cell}>
              <strong>Deaccessioned</strong>
            </div>
            <div className={styles.cell}>
              Formally removed from collection
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>XE</span>
            </div>
            <div className={styles.cell}>
              <strong>Exchanged</strong>
            </div>
            <div className={styles.cell}>
              Exchanged with another institution or collector
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>XD</span>
            </div>
            <div className={styles.cell}>
              <strong>Donated</strong>
            </div>
            <div className={styles.cell}>
              Donated to another institution
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.code}>XS</span>
            </div>
            <div className={styles.cell}>
              <strong>Sold</strong>
            </div>
            <div className={styles.cell}>
              Sold and removed from collection
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GlossaryPage;
