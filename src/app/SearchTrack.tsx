'use client';

import { useZustandStore } from '@/util/store';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdExplicit } from 'react-icons/md';
import type { TrackObject } from 'spotify-api-types';
import type { ApiTracksResponse } from './api/tracks/route';

export function SearchTrack() {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<Array<TrackObject>>([]);
	const selectedTracks = useZustandStore(state => state.selectedTracks);
	const addTrack = useZustandStore(state => state.addTrack);
	const removeTrack = useZustandStore(state => state.removeTrack);

	const selectedArtists = useZustandStore(state => state.selectedArtists);
	const selectedGenres = useZustandStore(state => state.selectedGenres);

	const totalSelectionCount = selectedArtists.length + selectedGenres.length + selectedTracks.length;

	useEffect(() => {
		if (query === '') {
			setSuggestions([]);
			return;
		}

		const fetchSuggestions = async () => {
			const res = await fetch(`/api/tracks?query=${query}`);
			const data: ApiTracksResponse = await res.json();
			setSuggestions(data.tracks.sort((a, b) => b.popularity - a.popularity));
		};

		const debounceFetch = setTimeout(() => {
			fetchSuggestions();
		}, 500);

		return () => clearTimeout(debounceFetch);
	}, [query]);

	const updateSelection = (track: TrackObject) => {
		if (totalSelectionCount >= 5) {
			// Show that cannot add more than 5
			return;
		}
		if (selectedTracks.find(t => t.id === track.id)) {
			// show that cannot add same track again
			return;
		}
		addTrack(track);
	};

	return (
		<div className={`flex w-96 flex-col gap-y-5 rounded-lg bg-black px-4 pb-4 pt-4 text-white shadow-lg`}>
			<div className='flex min-h-8 flex-row items-center gap-x-3'>
				<label htmlFor='search_track' className='rounded-lg px-2 text-lg outline outline-1'>
					Tracks
				</label>
				<ul className='flex flex-row gap-x-2'>
					{selectedTracks.map(track => {
						const image = track.album.images.at(0)!;
						return (
							<li key={track.id} className='cursor-pointer'>
								<Image
									src={image.url}
									width={image.width!}
									height={image.height!}
									alt={track.name}
									title={track.name}
									className='h-8 w-8 rounded-full outline-dashed outline-1 outline-white'
									onClick={() => removeTrack(track.id)}
								/>
							</li>
						);
					})}
					{Array.from({ length: 5 - selectedTracks.length }).map((_, index) => {
						return (
							<li key={index}>
								<div
									className={`h-8 w-8 rounded-full outline-dashed outline-1 ${totalSelectionCount >= 5 ? 'outline-red-400' : 'outline-white'}`}
								></div>
							</li>
						);
					})}
				</ul>
			</div>
			<input
				type='text'
				id='search_track'
				value={query}
				onChange={e => setQuery(e.target.value)}
				className='w-full rounded-lg bg-black px-2 py-2 placeholder-gray-300/90 outline outline-1 outline-white'
				placeholder='Search A Track'
			/>
			<ul className='flex flex-col gap-y-1'>
				{suggestions.map(track => {
					const image = track.album.images.at(0)!;
					return (
						<li
							key={track.id}
							className='flex cursor-pointer select-none flex-row items-center gap-x-2 rounded-full px-1 py-1 hover:bg-white/20 hover:outline-dashed hover:outline-1'
							onClick={() => updateSelection(track)}
						>
							<Image
								src={image.url}
								width={image.width!}
								height={image.height!}
								alt={track.name}
								className='h-12 w-12 rounded-full'
							/>
							<div className='flex flex-col'>
								<h1 className='flex flex-row items-center gap-x-1 text-white'>
									{track.explicit && <MdExplicit className='h-6 w-5' />}
									{track.name}
								</h1>
								<h1 className='text-xs text-gray-400'>{track.artists.map(artist => artist.name).join(', ')}</h1>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
