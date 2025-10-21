import { useEffect, useRef, useState } from "react";
import type { FileError, FileStatus } from "@/shared/libs/file-upload";

type UseFileUploadStateProps = {
	initialFile?: File | null;
};

export function useFileUploadState({
	initialFile = null,
}: UseFileUploadStateProps = {}) {
	const [file, setFile] = useState<File | null>(initialFile);
	const [status, setStatus] = useState<FileStatus>("idle");
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<FileError | null>(null);
	const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(
		() => () => {
			if (uploadIntervalRef.current) {
				clearInterval(uploadIntervalRef.current);
			}
		},
		[]
	);

	return {
		file,
		setFile,
		status,
		setStatus,
		progress,
		setProgress,
		error,
		setError,
		uploadIntervalRef,
	};
}
