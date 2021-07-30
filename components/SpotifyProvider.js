import useSWR from "swr";
import fetcher from "../libs/fetcher";
import { signIn, signOut, useSession } from "next-auth/client";
import { useStore } from "../libs/store";
import { useEffect } from "react";
export default function SpotifyProvider({ children }) {
	const [session, loading] = useSession();
	const isPlaying = useStore((state) => state.isPlaying);
	const spotifyRunning = useStore((state) => state.spotifyRunning);
	const setSpotifyRunning = useStore((state) => state.setSpotifyRunning);
	const setSpotifyNotRunning = useStore((state) => state.setSpotifyNotRunning);
	const setPlaying = useStore((state) => state.setPlaying);
	const setSong = useStore((state) => state.setSong);
	const setNotPlaying = useStore((state) => state.setNotPlaying);

	const { data, error, mutate } = useSWR(
		session ? "/api/spotify-now" : null,
		(url) =>
			fetcher(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${session.accessToken}`,
				},
			}),
		{
			refreshInterval: 5000,
		}
	);

	useEffect(() => {
		console.log("hey");
		if (data) {
			if (data.is_playing) {
				setPlaying();
				setSpotifyRunning();
			} else if (data.is_playing == undefined) {
				setNotPlaying();
				setSpotifyNotRunning();
			} else {
				setNotPlaying();
				setSpotifyRunning();
			}

			console.log("data", data);
			setSong(data);
		} else {
			setNotPlaying();
		}
	}, [data]);

	if (error) {
		console.error(error);
		return <div>failed to load referrer to console</div>;
	}
	if (!data) {
		console.log("loading");
		return children;
	}
	console.log(data);
	return children;
}
