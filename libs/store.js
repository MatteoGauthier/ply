import { useLayoutEffect } from "react";
import create from "zustand";
import createContext from "zustand/context";
import { devtools } from "zustand/middleware";

const log = (config) => (set, get, api) =>
	config(
		(args) => {
			console.log("🐻 applying", args);
			set(args);
			console.log("🐻 new state", get());
		},
		get,
		api
	);

let store;

const initialState = {
	isPlaying: false,
	spotifyRunning: false,
	song: {
		name: "",
		artists: null,
		album: null,
		progress_ms: 0,
		duration_ms: 0,
		uri: "",
		covers: null,
	},
	progress: 0,
};

const zustandContext = createContext();
export const Provider = zustandContext.Provider;
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
	return create(
		devtools(
			log((set, get) => ({
				...initialState,
				...preloadedState,
				setNotPlaying: () => {
					set({
						isPlaying: false,
					});
				},
				setPlaying: () => {
					set({
						isPlaying: true,
					});
				},
				setSpotifyNotRunning: () => {
					set({
						spotifyRunning: false,
					});
				},
				setSpotifyRunning: () => {
					set({
						spotifyRunning: true,
					});
				},
				setSong: ({ name, artists, album, progress_ms, duration_ms, uri, covers }) => {
					set({
						song: {
							name,
							artists,
							album,
							progress_ms,
							duration_ms,
							uri,
							covers,
						},
						progress: progress_ms,
					});
				},

				reset: () => {
					set({
						isPlaying: initialState.isPlaying,
					});
				},
			}))
		)
	);
};
export function useCreateStore(initialState) {
	// For SSR & SSG, always use a new store.
	if (typeof window === "undefined") {
		return () => initializeStore(initialState);
	}

	// For CSR, always re-use same store.
	store = store ?? initializeStore(initialState);
	// And if initialState changes, then merge states in the next render cycle.
	//
	// eslint complaining "React Hooks must be called in the exact same order in every component render"
	// is ignorable as this code runs in same order in a given environment
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useLayoutEffect(() => {
		if (initialState && store) {
			store.setState({
				...store.getState(),
				...initialState,
			});
		}
	}, [initialState]);

	return () => store;
}

