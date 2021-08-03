import { getSession, signIn, signOut, useSession } from "next-auth/client";
import toast from "react-hot-toast";
import { mutate } from "swr";

const notify = (arg) => {
	toast(`None of your devices are connected to Spotify app, "${arg}" failed`, {
		position: "bottom-right",
		icon: <>	&#9888; &#65039;</>,
		style: {
			borderRadius: "10px",
			background: "#333",
			color: "#fff",
		},
        // duration:Infinity
	});
};
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const config = (accessToken, method) => {
	return {
		method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	};
};
export async function spotifyPlayerPlay() {
	let { accessToken } = await getSession();
	let result = await fetch(`${SPOTIFY_API_URL}/me/player/play`, config(accessToken, "PUT"));
	if (result.status !== 200 || result.status !== 204) return notify(`play`);
	return mutate("/api/spotify-now");
}
export async function spotifyPlayerPause() {
	let { accessToken } = await getSession();
	let result = await fetch(`${SPOTIFY_API_URL}/me/player/pause`, config(accessToken, "PUT"));
	if (result.status !== 200 || result.status !== 204) return notify(`pause`);

	return mutate("/api/spotify-now");
}
export async function spotifyPlayerNext() {
	let { accessToken } = await getSession();
	let result = await fetch(`${SPOTIFY_API_URL}/me/player/next`, config(accessToken, "POST"));
	if (result.status !== 200 || result.status !== 204) return notify(`next`);

	return mutate("/api/spotify-now");
}
export async function spotifyPlayerPrevious() {
	let { accessToken } = await getSession();
	let result = await fetch(`${SPOTIFY_API_URL}/me/player/previous`, config(accessToken, "POST"));
	if (result.status !== 200 || result.status !== 204) return notify(`previous`);

	return mutate("/api/spotify-now");
}
