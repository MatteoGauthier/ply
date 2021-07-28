export const config = {
	// EXPIRATION_TIME: 5000, // 3600 seconds * 1000 = 1 hour in milliseconds = 30min
	EXPIRATION_TIME: (3600 * 1000) / 2, // 3600 seconds * 1000 = 1 hour in milliseconds = 30min
	KEEP_ALIVE: 0.1, // 30min
	// KEEP_ALIVE: 60 * 30, // 30min
};
export async function refreshAccessToken(token) {
	try {
	  const url =
		'https://accounts.spotify.com/api/token?' +
		new URLSearchParams({
		  client_id: process.env.SPOTIFY_ID,
		  client_secret: process.env.SPOTIFY_SECRET,
		  grant_type: 'refresh_token',
		  refresh_token: token.refreshToken,
		});
  
	  const response = await fetch(url, {
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
	  });
  
	  const refreshedTokens = await response.json();
  
	  if (!response.ok) {
		throw refreshedTokens;
	  }
  
	  return {
		...token,
		accessToken: refreshedTokens.access_token,
		accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
		refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
	  };
	} catch (error) {
	  console.log("error",error);
  
	  return {
		...token,
		error: 'RefreshAccessTokenError',
	  };
	}
  }