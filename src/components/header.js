import React from 'react';
import * as styles from './header.module.css';

const Header = ({ siteTitle, isLoggedIn, onLogout }) => (
  <header className={styles.headerContainer}>
    <div className={styles.siteTitle}>
      {siteTitle}
    </div>
    
    {/* This button will only render if isLoggedIn is true */}
    {isLoggedIn && (
      <button onClick={onLogout} className={styles.logoutButton}>
        Logout
      </button>
    )}
  </header>
);

export default Header;