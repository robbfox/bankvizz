// in src/pages/auth-callback.js

useEffect(() => {
  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      // This is the new, more robust error handling logic
      if (!response.ok) {
        let errorMessage = `API Error: Status ${response.status}`;
        try {
          // Try to parse the error as JSON
          const errData = await response.json();
          // If successful, use the detailed message
          errorMessage = errData.details?.error || errData.error || 'Token exchange failed.';
        } catch (e) {
          // If JSON parsing fails, it means the response was not JSON.
          // We can try to read it as text.
          const textError = await response.text();
          console.error("Non-JSON API response:", textError);
          errorMessage = `The server returned a non-JSON error. Check function logs.`;
        }
        throw new Error(errorMessage);
      }

      const { accessToken } = await response.json();
      sessionStorage.setItem('bankvizz_token', accessToken);
      navigate('/');

    } catch (err) {
      setStatus('Authentication Failed');
      setError(err.message);
    }
  };

  const code = new URLSearchParams(location.search).get('code');
  if (code) {
    exchangeCodeForToken(code);
  } else {
    setStatus('Authentication Error');
    setError('Authorization code not found in URL.');
  }
}, [location.search]);