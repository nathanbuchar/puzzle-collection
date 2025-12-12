import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Twisty Puzzle Collection
        </p>
        <div className={styles.license}>
          <p>
            Collection photos by{' '}
            <a href="https://n8.engineer" target="_blank" rel="noopener noreferrer">
              Nathaniel Meyer
            </a>
            {' '}/ Licensed under{' '}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
              CC BY-NC-SA 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
