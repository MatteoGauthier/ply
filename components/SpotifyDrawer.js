import React, { useState } from "react";
import { useStore } from "../libs/store";
import Image from "next/image";

import dynamic from "next/dynamic";

import clsx from "clsx";
import { Transition } from "@headlessui/react";
import { m } from "framer-motion";
import { spotifyPlayerNext, spotifyPlayerPause, spotifyPlayerPlay, spotifyPlayerPrevious } from "../libs/spotify";
import { useSession } from "next-auth/client";
// import { animated } from "motion/dist/size-react";

// const animated = dynamic(() => import("motion/dist/size-react").then((mod) => mod.animated), { ssr: false });
// import { ReactFitty } from "react-fitty";

function SpotifyDrawer() {
	const [session, loading] = useSession();
	const isPlaying = useStore((state) => state.isPlaying);
	const songName = useStore((state) => state.song.name);
	const artists = useStore((state) => state.song.artists);
	const covers = useStore((state) => state.song.covers);
	const progress = useStore((state) => state.progress);
	const duration = useStore((state) => state.song.duration_ms);

	const [isClicked, setIsClicked] = useState(false);

	if (covers) console.log(covers);
	return (
		<div className="relative z-10 h-full">
			<div className="wrapper">
				<div className="flex flex-col items-center justify-center h-full">
					{session && (
						<div className="bg-transparent shadow-halo w-full max-w-3xl">
							<div className="flex items-start space-x-4">
								<div className="w-64 h-64 relative overflow-visible rounded ring ring-white/10">
									<div className="absolute z-10 -bottom-5 -left-5 text-white/60 flex items-center justify-center">
										<m.svg
											animate={isPlaying ? "hidden" : "visible"}
											variants={{
												visible: { opacity: 1, scale: 1 },
												hidden: { opacity: 0, scale: 0.5 },
											}}
											transition={{ type: "spring", stiffness: 250, damping: 10 }}
											width="1em"
											height="1em"
											className="h-10 w-10 bg-sky-900/95 rounded-full p-2"
											viewBox="0 0 24 24"
										>
											<path
												d="M10 18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v12zm7 0a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v12z"
												fill="currentColor"
												fillRule="evenodd"
											></path>
										</m.svg>
									</div>

									{covers && (
										<Image className="rounded" height={256} width={256} src={covers[0]?.url} alt="album cover" />
									)}
									{!covers && <div className="w-full h-full bg-gray-200"></div>}
								</div>
								<div className="flex flex-1 flex-col items-start pt-2">
									{songName?.length > 30 && (
										<span className="overflow-hidden text-2xl font-bold text-white overflow-ellipsis font-poppins">
											{songName}
										</span>
									)}
									{songName?.length > 20 && songName?.length < 30 && (
										<span className="overflow-hidden text-3xl font-bold text-white overflow-ellipsis font-poppins">
											{songName}
										</span>
									)}
									{songName?.length <= 20 && (
										<span className="overflow-hidden text-5xl leading-normal font-bold text-white overflow-ellipsis font-poppins">
											{songName}
										</span>
									)}

									<span className="text-xl text-white/80">{artists?.map((artist) => artist.name).join(", ")}</span>
								</div>
							</div>
							<div className="w-full rounded bg-blue-gray-700 mt-7">
								<div
									style={{ width: (progress / duration) * 100 < 99 ? `${(progress / duration) * 100}%` : "0%" }}
									className={clsx(
										(progress / duration) * 100 > 99 ? "duration-[1000ms]" : "duration-[5000ms]",
										"h-1 transition-all linear rounded bg-gradient-to-r from-white/50 to-white "
									)}
								></div>
							</div>

							<div className="flex items-center mt-8 justify-center">
								<div className="space-x-5 flex items-center">
									<div
										onClick={() => spotifyPlayerPrevious()}
										className={clsx(
											"bg-gray-100/20  text-white/70",
											"flex relative rounded-full hover:bg-gray-100/30 active:bg-gray-100/95   transition-colors duration-150 ease-in-out active:text-black/90 h-16 w-16 items-center justify-center"
										)}
									>
										<m.svg width="1em" height="1em" className="h-6 w-6 z-10" viewBox="0 0 24 24">
											<g fill="none">
												<path d="M2.75 20a1 1 0 1 0 2 0V4a1 1 0 1 0-2 0v16z" fill="currentColor"></path>
												<path
													d="M20.75 19.053c0 1.424-1.612 2.252-2.77 1.422L7.51 12.968a1.75 1.75 0 0 1 .075-2.895l10.47-6.716c1.165-.748 2.695.089 2.695 1.473v14.223z"
													fill="currentColor"
												></path>
											</g>
										</m.svg>
									</div>
									<div
										onClick={() => (isPlaying ? spotifyPlayerPause() : spotifyPlayerPlay())}
										className={clsx(
											!isPlaying
												? "bg-gray-100/20 hover:bg-gray-100/30 text-white/70"
												: "bg-gray-100/95 text-black/90ƒ",
											"flex relative rounded-full hover:scale-105 transition-all transform-gpu scale-100 duration-150 ease-in-out  h-16 w-16 items-center justify-center"
										)}
									>
										<m.svg width="1em" height="1em" className="h-8 w-8 z-10" viewBox="0 0 24 24">
											<g fill="none">
												<path
													d="M3.651 6.617l7.502 4.753c.214.136.33.353.346.577V7.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-4.69a.742.742 0 0 1-.347.577l-7.5 4.747A.75.75 0 0 1 2.5 16.75v-9.5a.75.75 0 0 1 1.151-.633zM21.248 6.5a.75.75 0 0 1 .75.75v9.499a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-9.5a.75.75 0 0 1 .75-.75h3z"
													fill="currentColor"
												></path>
											</g>
										</m.svg>
										<span
											className={clsx(
												isPlaying ? "animate-ping" : "hidden",
												"absolute inline-flex h-3/4 w-3/4 z-[-1] rounded-full bg-blue-400 opacity-100"
											)}
										></span>
									</div>

									<div
										onClick={() => spotifyPlayerNext()}
										className={clsx(
											"bg-gray-100/20 text-white/70",
											"flex relative rounded-full hover:bg-gray-100/30 active:bg-gray-100/95   transition-colors duration-150 ease-in-out active:text-black/90 h-16 w-16 items-center justify-center"
										)}
									>
										<m.svg width="1em" height="1em" className="h-6 w-6 z-10" viewBox="0 0 24 24">
											<g fill="none">
												<path d="M21 4a1 1 0 1 0-2 0v16a1 1 0 1 0 2 0V4z" fill="currentColor"></path>
												<path
													d="M3 4.947c0-1.424 1.612-2.252 2.77-1.422l10.47 7.507a1.75 1.75 0 0 1-.075 2.895l-10.47 6.716C4.53 21.39 3 20.554 3 19.17V4.947z"
													fill="currentColor"
												></path>
											</g>
										</m.svg>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default SpotifyDrawer;
