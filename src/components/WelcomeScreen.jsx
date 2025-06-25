import * as styles from './WelcomeScreen.module.css';
import React from 'react';
import ConnectBankButton from './ConnectBankButton';
// We no longer need the generic Footer component for this screen
// import Footer from './footer'; 

const WelcomeScreen = () => {
  return (
    // The main container will now control the layout
    <div className={styles.container}>
      
      {/* This new wrapper will hold the content you want to center */}
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Fluium</h1>
        <p className={styles.subtitle}>Your personal finance dashboard...</p>
        <ConnectBankButton />
        <p className={styles.securityNote}>We use secure, read-only Open Banking...</p>
      </div>

      {/* The new, specific footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Robb Fox. All rights reserved.
      </footer>
    </div>
  );
};

export default WelcomeScreen;