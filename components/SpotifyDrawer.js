import React from "react";
import { useStore } from "../libs/store";
import Image from "next/image";
import clsx from "clsx";
// import { ReactFitty } from "react-fitty";

function SpotifyDrawer() {
	const isPlaying = useStore((state) => state.isPlaying);
	const songName = useStore((state) => state.song.name);
	const artist = useStore((state) => state.song.artist);
	const covers = useStore((state) => state.song.covers);
	const progress = useStore((state) => state.progress);
	const duration = useStore((state) => state.song.duration_ms);

	if (covers) console.log(covers);
	return (
		<div className="relative z-10 h-full">
			<div className="wrapper">
				<div className="flex flex-col items-center justify-center h-full">
					<div className="bg-transparent shadow-halo">
						<div className="flex items-start space-x-4">
							<div className="w-64 h-64 overflow-hidden rounded ring ring-white/10">
								{covers && (
									<Image className="rounded" height={256} width={256} src={covers[0]?.url} alt="album cover" />
								)}
								{!covers && <div className="w-full h-full bg-gray-200"></div>}
							</div>
							<div className="flex flex-col items-start pt-2">
								<span className="overflow-hidden text-3xl font-bold text-white overflow-ellipsis font-poppins">
									{songName}
								</span>
								<span className="text-xl text-white/80">{artist}</span>
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
