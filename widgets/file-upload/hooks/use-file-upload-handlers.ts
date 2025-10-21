import { type DragEvent, useCallback } from "react";
import type { FileError } from "@/shared/libs/file-upload";

// Error timeout constants
const ERROR_TIMEOUT_MS = 3000; // Clear error after 3 seconds

type UseFileUploadHandlersProps = {
	disabled?: boolean;
	status: "idle" | "dragging" | "uploading" | "error";
	validateFileSize: (file: File) => FileError | null;
	validateFileType: (file: File) => FileError | null;
	validateFile?: (file: File) => FileError | null;
	simulateUpload: (file: File) => void;
	setError: (error: FileError | null) => void;
	setStatus: (
		status:
			| "idle"
			| "dragging"
			| "uploading"
			| "error"
			| ((
					prev: "idle" | "dragging" | "uploading" | "error"
			  ) => "idle" | "dragging" | "uploading" | "error")
	) => void;
	setFile: (file: File | null) => void;
	setProgress: (progress: number) => void;
	onUploadError?: (error: FileError) => void;
	onFileRemove?: () => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export function useFileUploadHandlers({
	disabled = false,
	status,
	validateFileSize,
	validateFileType,
	validateFile,
	simulateUpload,
	setError,
	setStatus,
	setFile,
	setProgress,
	onUploadError,
	onFileRemove,
	fileInputRef,
}: UseFileUploadHandlersProps) {
	const handleError = useCallback(
		(error: FileError) => {
			setError(error);
			setStatus("error");
			onUploadError?.(error);

			setTimeout(() => {
				setError(null);
				setStatus("idle");
			}, ERROR_TIMEOUT_MS);
		},
		[onUploadError, setError, setStatus]
	);

	const handleFileSelect = useCallback(
		(selectedFile: File | null) => {
			if (!selectedFile) {
				return;
			}

			setError(null);

			const sizeError = validateFileSize(selectedFile);
			if (sizeError) {
				handleError(sizeError);
				return;
			}

			const typeError = validateFileType(selectedFile);
			if (typeError) {
				handleError(typeError);
				return;
			}

			const customError = validateFile?.(selectedFile);
			if (customError) {
				handleError(customError);
				return;
			}

			setFile(selectedFile);
			setStatus("uploading");
			setProgress(0);
			simulateUpload(selectedFile);
		},
		[
			simulateUpload,
			validateFileSize,
			validateFileType,
			validateFile,
			handleError,
			setError,
			setStatus,
			setFile,
			setProgress,
		]
	);

	const handleDragOver = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled) {
				return;
			}
			setStatus((prev) => (prev !== "uploading" ? "dragging" : prev));
		},
		[disabled, setStatus]
	);

	const handleDragLeave = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setStatus((prev) => (prev === "dragging" ? "idle" : prev));
		},
		[setStatus]
	);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled || status === "uploading") {
				return;
			}
			setStatus("idle");
			const droppedFile =
				(e.dataTransfer.files?.[0] as File | undefined) || null;
			if (droppedFile) {
				handleFileSelect(droppedFile);
			}
		},
		[disabled, status, handleFileSelect, setStatus]
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFile = (e.target.files?.[0] as File | undefined) || null;
			handleFileSelect(selectedFile);
			if (e.target) {
				e.target.value = "";
			}
		},
		[handleFileSelect]
	);

	const triggerFileInput = useCallback(() => {
		if (disabled || status === "uploading") {
			return;
		}
		fileInputRef.current?.click();
	}, [disabled, status, fileInputRef]);

	const resetState = useCallback(() => {
		setFile(null);
		setStatus("idle");
		setProgress(0);
		if (onFileRemove) {
			onFileRemove();
		}
	}, [onFileRemove, setFile, setStatus, setProgress]);

	return {
		handleError,
		handleFileSelect,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleFileInputChange,
		triggerFileInput,
		resetState,
	};
}
