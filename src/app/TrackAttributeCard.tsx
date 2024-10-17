'use client';

import { type TrackAttributeName, useZustandStore } from '@/util/store';
import { ChangeEvent } from 'react';

export function TrackAttributeCard({
	trackAttributeName,
	className,
}: {
	trackAttributeName: TrackAttributeName;
	className?: string;
}) {
	const trackAttributeValue = useZustandStore(state => state.selectedTrackAttributes.get(trackAttributeName));
	const setSelectedTrackAttributes = useZustandStore(state => state.setSelectedTrackAttributes);
	const updateSelectedTrackAttributes = useZustandStore(state => state.updateSelectedTrackAttributes);

	let rangeMin, rangeTarget, rangeMax, rangeStep;

	switch (trackAttributeName) {
		case 'duration_ms':
			rangeMin = 0;
			rangeMax = 3600;
			rangeStep = 1;
			rangeTarget = Math.round((rangeMin + rangeMax) / 2);
			break;

		case 'key':
			rangeMin = 0;
			rangeMax = 11;
			rangeStep = 1;
			rangeTarget = Math.round((rangeMin + rangeMax) / 2);
			break;

		case 'popularity':
			rangeMin = 0;
			rangeMax = 100;
			rangeStep = 1;
			rangeTarget = Math.round((rangeMin + rangeMax) / 2);
			break;

		case 'time_signature':
			rangeMin = 0;
			rangeMax = 11;
			rangeStep = 1;
			rangeTarget = Math.round((rangeMin + rangeMax) / 2);
			break;

		default:
			rangeMin = 0;
			rangeMax = 1;
			rangeStep = 0.01;
			rangeTarget = (rangeMin + rangeMax) / 2;
			break;
	}

	if (typeof trackAttributeValue === 'undefined') {
		setSelectedTrackAttributes(trackAttributeName, {
			min: rangeMin,
			target: rangeTarget,
			max: rangeMax,
			isActive: false,
		});
		return <></>;
	}

	const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = parseFloat(e.target.value);
		switch (e.target.id) {
			case `min-${trackAttributeName}`:
				if (newValue <= trackAttributeValue.target) {
					updateSelectedTrackAttributes(trackAttributeName, { ...trackAttributeValue, min: newValue });
				}
				break;
			case `target-${trackAttributeName}`:
				if (newValue >= trackAttributeValue.min && newValue <= trackAttributeValue.max) {
					updateSelectedTrackAttributes(trackAttributeName, { ...trackAttributeValue, target: newValue });
				}
				break;
			case `max-${trackAttributeName}`:
				if (newValue >= trackAttributeValue.target) {
					updateSelectedTrackAttributes(trackAttributeName, { ...trackAttributeValue, max: newValue });
				}
			default:
				break;
		}
	};

	return (
		<div
			className={`flex h-fit w-72 flex-col gap-y-5 rounded-lg bg-black px-4 pb-4 pt-4 text-white shadow-lg ${className}`}
		>
			<div className='flex flex-row items-center justify-between gap-x-2'>
				<h1 className='rounded-lg px-2 text-sm capitalize outline outline-1'>
					{trackAttributeName === 'duration_ms' ? 'Duration Seconds' : trackAttributeName}
				</h1>
				<input
					type='button'
					name={`toggle-${trackAttributeName}-attribute`}
					id={`toggle-${trackAttributeName}-attribute`}
					value={trackAttributeValue.isActive ? 'On' : 'Off'}
					onClick={() =>
						updateSelectedTrackAttributes(trackAttributeName, {
							...trackAttributeValue,
							isActive: !trackAttributeValue.isActive,
						})
					}
					className='hover:cursor-pointer'
				/>
			</div>
			{trackAttributeValue.isActive ? (
				<div className='flex flex-col gap-y-4'>
					<div className='flex flex-row items-center justify-between gap-x-2'>
						<label htmlFor='' className='w-[7ch] rounded-md text-center text-sm capitalize outline outline-1'>
							Min
						</label>
						<input
							type='range'
							id={`min-${trackAttributeName}`}
							min={rangeMin}
							max={rangeMax}
							step={rangeStep}
							value={trackAttributeValue.min}
							onChange={e => handleSliderChange(e)}
							disabled={!trackAttributeValue.isActive}
							className='h-1 cursor-pointer appearance-none rounded-lg bg-[#1DB954] [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
						/>
						<h1 className='min-w-[5ch] max-w-[5ch] rounded-md text-center outline outline-1'>
							{trackAttributeValue.min}
						</h1>
					</div>
					<div className='flex flex-row items-center justify-between gap-x-2'>
						<label htmlFor='' className='w-[7ch] rounded-md text-center text-sm capitalize outline outline-1'>
							Target
						</label>
						<input
							type='range'
							id={`target-${trackAttributeName}`}
							min={rangeMin}
							max={rangeMax}
							step={rangeStep}
							value={trackAttributeValue.target}
							onChange={e => handleSliderChange(e)}
							disabled={!trackAttributeValue.isActive}
							className='h-1 cursor-pointer appearance-none rounded-lg bg-[#1DB954] [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
						/>
						<h1 className='min-w-[5ch] max-w-[5ch] rounded-md text-center outline outline-1'>
							{trackAttributeValue.target}
						</h1>
					</div>
					<div className='flex flex-row items-center justify-between gap-x-2'>
						<label htmlFor='' className='w-[7ch] rounded-md text-center text-sm capitalize outline outline-1'>
							Max
						</label>
						<input
							type='range'
							id={`max-${trackAttributeName}`}
							min={rangeMin}
							max={rangeMax}
							step={rangeStep}
							value={trackAttributeValue.max}
							onChange={e => handleSliderChange(e)}
							disabled={!trackAttributeValue.isActive}
							className='h-1 cursor-pointer appearance-none rounded-lg bg-[#1DB954] [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
						/>
						<h1 className='min-w-[5ch] max-w-[5ch] rounded-md text-center outline outline-1'>
							{trackAttributeValue.max}
						</h1>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}