import useSWR from "swr";
import fetcher from "../libs/fetcher";
import { signIn, signOut, useSession } from "next-auth/client";
import { useStore } from "../libs/store";
import { useEffect } from "react";
export default function SpotifyProvider({ children }) {
	const [session, loading] = useSession();
	const isPlaying = useStore((state) => state.isPlaying);
	const setPlaying = useStore((state) => state.setPlaying);
	const setSong = useStore((state) => state.setSong);
	const setNotPlaying = useStore((state) => state.setNotPlaying);

	const { data, error } = useSWR(
		session ? "https://api.spotify.com/v1/me/player/currently-playing" : null,
		(url) =>
			fetcher(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${session.accessToken}`,
				},
			}),
		{ refreshInterval: 5000 }
	);

	useEffect(() => {
		if (data) {
			data.is_playing ? setPlaying() : setNotPlaying();
			data.item
				? setSong({
						name: data.item.name,
						artist: data.item.artists[0].name,
						album: data.item.album.name,
						progress_ms: data.progress_ms,
						duration_ms: data.item.duration_ms,
						link: data.item.external_urls.spotify,
						covers: data.item.album.images,
				  })
				: null;
		} else {
			setNotPlaying();
		}
	}, [data]);

	if (error) {
		console.log(error);
		return <div>failed to load referrer to console</div>;
	}
	if (!data) {
		console.log("loading");
		return children;
	}
	console.log(data);
	return children;
}
