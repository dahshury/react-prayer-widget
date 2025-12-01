import { useId } from "react";

type UploadingAnimationProps = {
	progress: number;
};

// SVG circle constants
const SVG_SIZE = 240;
const SVG_CENTER = 120;
const CIRCLE_RADIUS = 120;
// Circumference of circle with radius 120: 2 * π * r ≈ 754
const CIRCLE_CIRCUMFERENCE = 754;
const MAX_PROGRESS_PERCENT = 100;

export function UploadingAnimation({ progress }: UploadingAnimationProps) {
	const uidRaw = useId();
	const uid = `progress-mask-${uidRaw.replace(/[:]/g, "-")}`;
	return (
		<div className="relative h-16 w-16">
			<svg
				aria-label={`Upload progress: ${Math.round(progress)}%`}
				className="h-full w-full"
				fill="none"
				viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Upload Progress Indicator</title>

				<defs>
					<mask id={uid}>
						<rect fill="black" height={SVG_SIZE} width={SVG_SIZE} />
						<circle
							cx={SVG_CENTER}
							cy={SVG_CENTER}
							fill="white"
							r={CIRCLE_RADIUS}
							strokeDasharray={`${(progress / MAX_PROGRESS_PERCENT) * CIRCLE_CIRCUMFERENCE}, ${CIRCLE_CIRCUMFERENCE}`}
							transform={`rotate(-90 ${SVG_CENTER} ${SVG_CENTER})`}
						/>
					</mask>
				</defs>

				<style>
					{`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: ${SVG_CENTER}px ${SVG_CENTER}px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(7) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(8) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(9) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(10) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(11) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(12) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(13) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(14) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                    .g-spin circle:nth-child(5n) { animation-delay: 0.5s; }
                    .g-spin circle:nth-child(7n) { animation-delay: 0.7s; }
                `}
				</style>

				<g
					className="g-spin"
					mask={`url(#${uid})`}
					strokeDasharray="18% 40%"
					strokeWidth="10"
				>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="150"
						stroke="#FF2E7E"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="140"
						stroke="#FFD600"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="130"
						stroke="#00E5FF"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="120"
						stroke="#FF3D71"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="110"
						stroke="#4ADE80"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="100"
						stroke="#2196F3"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="90"
						stroke="#FFA726"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="80"
						stroke="#FF1493"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="70"
						stroke="#FFEB3B"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="60"
						stroke="#00BCD4"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="50"
						stroke="#FF4081"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="40"
						stroke="#76FF03"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="30"
						stroke="#448AFF"
					/>
					<circle
						cx={SVG_CENTER}
						cy={SVG_CENTER}
						opacity="0.95"
						r="20"
						stroke="#FF3D00"
					/>
				</g>
			</svg>
		</div>
	);
}
