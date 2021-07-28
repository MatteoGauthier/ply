import { useLayoutEffect } from "react";
import create from "zustand";
import createContext from "zustand/context";

let store;

const initialState = {
	isPlaying: false,
	song: {
		name: "",
		artist: "",
		album: "",
		progress_ms: 0,
		duration_ms: 0,
		link: "",
		covers: null
	},
	progress: 0
};

const zustandContext = createContext();
export const Provider = zustandContext.Provider;
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
	return create((set, get) => ({
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
		setSong: ({ name, artist, album, progress_ms, duration_ms, link, covers }) => {
			set({
				song: {
					name,
					artist,
					album,
					progress_ms,
					duration_ms,
					link,
					covers
				},
				progress: progress_ms
			});
		},


		reset: () => {
			set({
				isPlaying: initialState.isPlaying,
			});
		},
	}));
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
