import React from "react";
import { useStore } from "../libs/store";
import Image from "next/image";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import { m } from "framer-motion";
// import { ReactFitty } from "react-fitty";

function SpotifyDrawer() {
	const isPlaying = useStore((state) => state.isPlaying);
	const songName = useStore((state) => state.song.name);
	const artists = useStore((state) => state.song.artists);
	const covers = useStore((state) => state.song.covers);
	const progress = useStore((state) => state.progress);
	const duration = useStore((state) => state.song.duration_ms);

	if (covers) console.log(covers);
	return (
		<div className="relative z-10 h-full">
			<div className="wrapper">
				<div className="flex flex-col items-center justify-center h-full">
					<div className="bg-transparent shadow-halo w-full max-w-3xl">
						<div className="flex items-start space-x-4">
							<div className="w-64 h-64 relative overflow-visible rounded ring ring-white/10">
								<div className="absolute z-10 -bottom-5 -left-5 text-white/60 flex items-center justify-center">
									<m.svg
										animate={isPlaying ? "hidden" : "visible"}
										variants={{
											visible: { opacity: 1, scale: 1 },
											hidden: { opacity: 0 , scale: 0.5 },
										}}
										transition={{ type: "spring", stiffness: 250, damping:10 }}
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
					</div>
				</div>
			</div>
		</div>
	);
}

export default SpotifyDrawer;
