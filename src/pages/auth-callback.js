// src/pages/auth-callback.js
import React from 'react';

const SimpleCallback = () => {
  return (
    <div style={{ padding: '4rem', fontFamily: 'sans-serif' }}>
      <h1>Auth Callback Page Loaded Successfully!</h1>
      <p>If you can see this page by manually navigating to it, then Vercel is serving it correctly.</p>
      <p>The issue is likely with the TrueLayer redirect URI configuration.</p>
    </div>
  );
};

export default SimpleCallback;