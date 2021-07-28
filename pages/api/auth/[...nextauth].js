import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { config, refreshAccessToken, generateNewAccessToken } from "../../../libs";
export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		Providers.Spotify({
			clientId: process.env.SPOTIFY_ID,
			clientSecret: process.env.SPOTIFY_SECRET,
			scope: "user-read-currently-playing",
		}),
		// ...add more providers here
	],
	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `jwt` is automatically set to `true` if no database is specified.
		jwt: true,

		// Seconds - How long until an idle session expires and is no longer valid.
		// maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// updateAge: 24 * 60 * 60, // 24 hours
	},
	callbacks: {
		async jwt(token, user, account) {
			// Initial sign in
			if (account && user) {
				console.log(`# Initial sign in, expire in ${account.expires_in}`);
				// console.log({ token, user, account });
				return {
					accessToken: account.accessToken,
					// accessTokenExpires: Date.now() + 1000,
					accessTokenExpires: Date.now() + account.expires_in * 1000,
					refreshToken: account.refresh_token,
					user,
				};
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < token.accessTokenExpires) {
				console.log("# Token has not expired yet. Return previous token.");
				return token;
			}

			// Access token has expired, try to update it
			console.log("Access token has expired, try to update it");
			return refreshAccessToken(token);
		},
		// async jwt(token, user, account, profile, isNewUser) {
		// 	// Add access_token to the token right after signin
		// 	if (account?.accessToken) {
		// 		token.accessToken = account.accessToken;
		// 	}
		// 	return token;
		// },
		async session(session, token) {
			// Add property to session, like an access_token from a provider.
			if (token) {
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},

	jwt: {
		secret: process.env.JWT_SECRET,
		signingKey: process.env.JWT_SIGN,
	},
	debug: false,
	// A database is optional, but required to persist accounts in a database
	//   database: process.env.DATABASE_URL,
});
