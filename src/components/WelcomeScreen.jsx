import React from 'react';
import ConnectBankButton from './ConnectBankButton';

const welcomeStyles = {
  container: {
    textAlign: 'center',
    padding: '5rem 2rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '2.5rem',
  },
  securityNote: {
    marginTop: '2.5rem',
    fontSize: '0.9rem',
    color: '#777',
  }
};

const WelcomeScreen = () => {
  return (
    <div style={welcomeStyles.container}>
      <h1 style={welcomeStyles.title}>Welcome to BankVizz</h1>
      <p style={welcomeStyles.subtitle}>
        Your personal finance dashboard. Securely connect your bank account to get started.
      </p>
      
      {/* The main call to action is our existing button */}
      <ConnectBankButton />

      <p style={welcomeStyles.securityNote}>
        We use secure, read-only Open Banking technology. We never see or store your bank login credentials.
      </p>
    </div>
  );
};

export default WelcomeScreen;