import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from 'remotion';

/**
 * Recreates the "Make videos programmatically" folded-card illustration
 * from remotion.dev — a 3D-tilted stack of cards, each labelled with a
 * component tag, sliding/rotating into place one after another, topped
 * off with a "you can create" pill badge.
 *
 * Drop this file into your Remotion project's src/ folder and register
 * it as a <Composition /> in Root.tsx, e.g.:
 *
 *   <Composition
 *     id="StackedCards"
 *     component={StackedCardsAnimation}
 *     durationInFrames={150}
 *     fps={30}
 *     width={1000}
 *     height={700}
 *   />
 */

type CardDef = {
	label: string;
	rotation: number; // degrees, resting rotation
	x: number; // resting x offset from center
	y: number; // resting y offset (stacking upward = more negative)
	bg: string;
	color: string;
	delay: number; // frame at which this card starts animating in
};

const CARDS: CardDef[] = [
	{ label: '<Video />', rotation: -14, x: -10, y: 90, bg: '#dbe9ff', color: '#1f3a8a', delay: 0 },
	{ label: '<BRoll />', rotation: -8, x: 10, y: 40, bg: '#c3d9ff', color: '#1f3a8a', delay: 8 },
	{ label: '<Captions />', rotation: -3, x: -6, y: -6, bg: '#a9c8ff', color: '#12285f', delay: 16 },
	{ label: '<Timeline />', rotation: 2, x: 8, y: -50, bg: '#7fa9ff', color: '#0b1f4d', delay: 24 },
];

const container: React.CSSProperties = {
	backgroundColor: 'white',
};

export const StackedCardsAnimation: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Whole scene gently floats
	const float = Math.sin(frame / 18) * 6;

	return (
		<AbsoluteFill style={container}>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					perspective: 1200,
				}}
			>
				<div
					style={{
						position: 'relative',
						width: 340,
						height: 420,
						transform: `translateY(${float}px) rotateZ(6deg)`,
					}}
				>
					{CARDS.map((card, i) => {
						const enter = spring({
							frame: frame - card.delay,
							fps,
							config: { damping: 14, mass: 0.6, stiffness: 110 },
						});

						// Slide up from below + fade in
						const translateY = interpolate(enter, [0, 1], [220, card.y], {
							extrapolateRight: 'clamp',
						});
						const opacity = interpolate(enter, [0, 1], [0, 1], {
							extrapolateRight: 'clamp',
						});
						const rotate = interpolate(
							enter,
							[0, 1],
							[card.rotation + 25, card.rotation],
							{ extrapolateRight: 'clamp' }
						);
						const scale = interpolate(enter, [0, 1], [0.85, 1], {
							extrapolateRight: 'clamp',
						});

						return (
							<div
								key={card.label}
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									width: 300,
									height: 90,
									marginLeft: -150,
									marginTop: -45,
									transform: `translate(${card.x}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
									opacity,
									background: card.bg,
									borderRadius: 18,
									border: '3px solid #0f172a',
									boxShadow: '0 10px 22px rgba(15, 23, 42, 0.18)',
									display: 'flex',
									alignItems: 'center',
									paddingLeft: 24,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, monospace',
									fontSize: 22,
									fontWeight: 700,
									color: card.color,
									zIndex: i,
								}}
							>
								{card.label}
							</div>
						);
					})}

					{/* "you can create" badge, pops in last */}
					{(() => {
						const badgeDelay = CARDS[CARDS.length - 1].delay + 14;
						const enter = spring({
							frame: frame - badgeDelay,
							fps,
							config: { damping: 10, mass: 0.5, stiffness: 160 },
						});
						const scale = interpolate(enter, [0, 1], [0, 1], {
							extrapolateRight: 'clamp',
							easing: Easing.out(Easing.back(1.6)),
						});
						const opacity = interpolate(enter, [0, 1], [0, 1], {
							extrapolateRight: 'clamp',
						});

						return (
							<div
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									transform: `translate(-40px, -170px) rotate(-6deg) scale(${scale})`,
									opacity,
									background: '#0f172a',
									color: 'white',
									padding: '10px 20px',
									borderRadius: 999,
									fontFamily: 'ui-sans-serif, system-ui, sans-serif',
									fontWeight: 700,
									fontSize: 20,
									whiteSpace: 'nowrap',
									boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
								}}
							>
								you can <span style={{ color: '#7fa9ff' }}>create</span>
							</div>
						);
					})()}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
