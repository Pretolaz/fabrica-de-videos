import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
    staticFile,
} from 'remotion';
import {
	ComposableMap,
	Geographies,
	Geography,
	Line,
	Marker,
} from 'react-simple-maps';

const geoUrl = '/countries-110m.json';

const LA: [number, number] = [-118.2437, 34.0522];
const NY: [number, number] = [-74.006, 40.7128];
const PARIS: [number, number] = [2.3522, 48.8566];

export const MapTrip: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Timeline
	// 0-120: LA Zoom out
	// 120-250: LA -> NY
	// 250-450: NY -> Paris

	const zoomOutLA = spring({
		frame,
		fps,
		config: {damping: 20},
		durationInFrames: 120,
	});

	const scale = interpolate(zoomOutLA, [0, 1], [4000, 600]);

	const travelToNY = spring({
		frame: frame - 120,
		fps,
		config: {stiffness: 40},
		durationInFrames: 130,
	});

	const travelToParis = spring({
		frame: frame - 250,
		fps,
		config: {stiffness: 30},
		durationInFrames: 200,
	});

	// Interpolate center based on travel progress
	let center: [number, number] = LA;
	if (frame >= 120 && frame < 250) {
		center = [
			interpolate(travelToNY, [0, 1], [LA[0], NY[0]]),
			interpolate(travelToNY, [0, 1], [LA[1], NY[1]]),
		];
	} else if (frame >= 250) {
		center = [
			interpolate(travelToParis, [0, 1], [NY[0], PARIS[0]]),
			interpolate(travelToParis, [0, 1], [NY[1], PARIS[1]]),
		];
	}

	return (
		<AbsoluteFill style={{backgroundColor: '#050a14', overflow: 'hidden'}}>
			{/* Grid Pattern in Background for premium feel */}
			<div
				style={{
					position: 'absolute',
					width: '200%',
					height: '200%',
					top: '-50%',
					left: '-50%',
					backgroundImage: `linear-gradient(#1e293b 0.5px, transparent 0.5px), linear-gradient(90deg, #1e293b 0.5px, transparent 0.5px)`,
					backgroundSize: '40px 40px',
					opacity: 0.3,
				}}
			/>

			<ComposableMap
				projection="geoMercator"
				projectionConfig={{
					scale: scale,
					center: center,
				}}
				width={width}
				height={height}
				style={{width: '100%', height: '100%'}}
			>
				<Geographies geography={geoUrl}>
					{({geographies}) =>
						geographies.map((geo) => (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								fill="#1e293b"
								stroke="#334155"
								strokeWidth={0.5}
							/>
						))
					}
				</Geographies>

				{/* Travel Line: LA -> NY */}
				{frame > 120 && (
					<Line
						from={LA}
						to={NY}
						stroke="#38bdf8"
						strokeWidth={4}
						strokeLinecap="round"
						strokeDasharray="10 5"
						strokeDashoffset={-frame * 2}
						style={{opacity: frame >= 250 ? 0.3 : 1}}
					/>
				)}

				{/* Travel Line: NY -> Paris */}
				{frame > 250 && (
					<Line
						from={NY}
						to={PARIS}
						stroke="#fb7185"
						strokeWidth={4}
						strokeLinecap="round"
						strokeDasharray="10 5"
						strokeDashoffset={-frame * 2}
					/>
				)}

				{/* Markers */}
				<Marker coordinates={LA}>
					<circle r={8 / (scale / 600)} fill="#38bdf8" stroke="#fff" strokeWidth={2} />
					<text y="-20" textAnchor="middle" style={{fontFamily: 'system-ui', fill: '#fff', fontSize: 24 / (scale / 600)}}>LA</text>
				</Marker>

				<Marker coordinates={NY}>
					<circle r={8 / (scale / 600)} fill="#38bdf8" stroke="#fff" strokeWidth={2} />
					<text y="-20" textAnchor="middle" style={{fontFamily: 'system-ui', fill: '#fff', fontSize: 24 / (scale / 600)}}>NY</text>
				</Marker>

				<Marker coordinates={PARIS}>
					<circle r={8 / (scale / 600)} fill="#fb7185" stroke="#fff" strokeWidth={2} />
					<text y="-20" textAnchor="middle" style={{fontFamily: 'system-ui', fill: '#fff', fontSize: 24 / (scale / 600)}}>PARIS</text>
				</Marker>
			</ComposableMap>

			{/* Info HUD */}
			<div
				style={{
					position: 'absolute',
					top: 50,
					left: 50,
					color: 'white',
					fontFamily: 'Inter, sans-serif',
                    fontSize: 32,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    textShadow: '0 0 10px rgba(255,255,255,0.5)'
				}}
			>
				{frame < 120 ? 'Los Angeles' : frame < 250 ? 'San Francisco-New York Route' : 'Transatlantic Voyage'}
			</div>
		</AbsoluteFill>
	);
};
