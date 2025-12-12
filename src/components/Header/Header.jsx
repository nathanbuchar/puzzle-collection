import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>Twisty Puzzle Collection</h1>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/collection" className={styles.navLink}>Collection</Link>
          <Link to="/variants" className={styles.navLink}>Variants</Link>
          <Link to="/glossary" className={styles.navLink}>Glossary</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
