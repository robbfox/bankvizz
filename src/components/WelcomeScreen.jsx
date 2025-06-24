import * as styles from './WelcomeScreen.module.css';
import React from 'react';
import ConnectBankButton from './ConnectBankButton';

const WelcomeScreen = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to BankViz</h1>
      <p className={styles.subtitle}>Your personal finance dashboard...</p>
      <ConnectBankButton />
      <p className={styles.securityNote}>We use secure, read-only Open Banking...</p>
    </div>
  );
};

export default WelcomeScreen;
