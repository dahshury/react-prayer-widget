import { useCallback } from "react";
import { UPLOAD_STEP_SIZE } from "./file-upload.constants";

const MAX_PROGRESS_PERCENT = 100;

type UseUploadSimulationProps = {
	uploadDelay?: number;
	onUploadSuccess?: (file: File) => void;
	setProgress: (progress: number) => void;
	setStatus: (
		status:
			| "idle"
			| "uploading"
			| ((prev: "idle" | "uploading") => "idle" | "uploading")
	) => void;
	setFile: (file: File | null) => void;
	uploadIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
};

export function useUploadSimulation({
	uploadDelay = 2000,
	onUploadSuccess,
	setProgress,
	setStatus,
	setFile,
	uploadIntervalRef,
}: UseUploadSimulationProps) {
	const simulateUpload = useCallback(
		(uploadingFile: File) => {
			let currentProgress = 0;

			if (uploadIntervalRef.current) {
				clearInterval(uploadIntervalRef.current);
			}

			uploadIntervalRef.current = setInterval(
				() => {
					currentProgress += UPLOAD_STEP_SIZE;
					if (currentProgress >= MAX_PROGRESS_PERCENT) {
						if (uploadIntervalRef.current) {
							clearInterval(uploadIntervalRef.current);
						}
						setProgress(0);
						setStatus("idle");
						setFile(null);
						onUploadSuccess?.(uploadingFile);
					} else {
						setStatus((prevStatus) => {
							if (prevStatus === "uploading") {
								setProgress(currentProgress);
								return "uploading";
							}
							if (uploadIntervalRef.current) {
								clearInterval(uploadIntervalRef.current);
							}
							return prevStatus;
						});
					}
				},
				uploadDelay / (MAX_PROGRESS_PERCENT / UPLOAD_STEP_SIZE)
			);
		},
		[
			onUploadSuccess,
			uploadDelay,
			setProgress,
			setStatus,
			setFile,
			uploadIntervalRef,
		]
	);

	return { simulateUpload };
}
