# /api/truelayer_callback.py

import os
import requests
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Get the one-time 'code' from the URL TrueLayer sent the user back with
        query_components = parse_qs(urlparse(self.path).query)
        code = query_components.get('code', [None])[0]

        if not code:
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Error: No authorization code received.")
            return

        # 2. Prepare to exchange the 'code' for an 'access_token'
        token_url = 'https://auth.truelayer.com/connect/token'
        
        # Get your secrets from Vercel Environment Variables
        client_id = os.getenv("TRUELAYER_CLIENT_ID")
        client_secret = os.getenv("TRUELAYER_CLIENT_SECRET")
        redirect_uri = 'http://localhost:8000/api/truelayer_callback' # Must match what's in the console!

        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        
        payload = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'code': code
        }

        # 3. Make the secure, back-end API call to TrueLayer
        try:
            response = requests.post(token_url, headers=headers, data=payload)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
            
            token_data = response.json()
            access_token = token_data.get('access_token')

            # SUCCESS! You now have the token.
            # For now, we'll just display a success message.
            # In a real app, you would securely store this token and redirect the user.
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            success_html = f"""
                <html><body>
                    <h1>Success!</h1>
                    <p>We have successfully connected to your bank.</p>
                    <p>Your access token (secret): {access_token[:8]}...</p>
                    <a href="/">Go back to dashboard</a>
                </body></html>
            """
            self.wfile.write(success_html.encode('utf-8'))

        except requests.exceptions.RequestException as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            error_message = f"Failed to exchange token: {e}\n\nResponse: {e.response.text if e.response else 'No response'}"
            self.wfile.write(error_message.encode('utf-8'))
        return