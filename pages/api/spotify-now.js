// nextjs api function
import { log } from "../../libs";
import fetcher from "../../libs/fetcher";

const config = (accessToken) => {
	return {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	};
};

const fetchCurrentlyPlaying = async (accessToken) => {
	try {
		let sp = await fetcher("https://api.spotify.com/v1/me/player/currently-playing", config(accessToken));
		return {
			name: sp.item.name,
			artists: sp.item.artists,
			album: { name: sp.item.album.name, uri: sp.item.album.uri, images: sp.item.album.images },
			duration_ms: sp.item.duration_ms,
			uri: sp.item.uri,
			covers: sp.item.album.images,
			progress_ms: sp.progress_ms,
			is_playing: sp.is_playing,
		};
	} catch (error) {
		return !(error.status == 204);
	}
};
const fetchRecentlyPlayed = async (accessToken) => {
	try {
		let sp = await fetcher("https://api.spotify.com/v1/me/player/recently-played", config(accessToken));
		return {
			name: sp.items[0].track.name,
			artists: sp.items[0].track.artists,
			album: {
				name: sp.items[0].track.album.name,
				uri: sp.items[0].track.album.uri,
				images: sp.items[0].track.album.images,
			},
			duration_ms: sp.items[0].track.duration_ms,
			uri: sp.items[0].track.uri,
			covers: sp.items[0].track.album.images,
			progress_ms: 0,
		};
	} catch (error) {
		return !(error.status == 204);
	}
};

async function getPlayerSongWithFeatures(accessToken) {
	const songFetch = async () => {
		const currentlyPlaying = await fetchCurrentlyPlaying(accessToken);
		if (!currentlyPlaying) {
			log(`Spotify: No currently playing track, falling back to /recently-played"`);
			let lastPlayedSong = await fetchRecentlyPlayed(accessToken);
			log(`Spotify: Last played song: ${lastPlayedSong.name}`);
			return lastPlayedSong;
		}
		log(`Spotify: Currently playing track: ${currentlyPlaying.name}`);
		return currentlyPlaying;
	};

	const song = await songFetch();

	const features = await fetcher(
		`https://api.spotify.com/v1/audio-features/${song.uri.split(":")[2]}`,
		config(accessToken)
	);
	return {
		...song,
		features,
	};
}

export default async function handler(req, res) {
	const headers = req.headers;
	if (!headers.authorization) return res.status(401).end();
	const accessToken = headers.authorization.split(" ")[1];
	if (!accessToken) return res.status(401).end();
	const song = await getPlayerSongWithFeatures(accessToken)
	return res.json(song);
}
