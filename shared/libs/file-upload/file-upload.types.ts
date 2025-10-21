export type FileStatus = "idle" | "dragging" | "uploading" | "error";

export type FileError = {
	message: string;
	code: string;
};

export type FileUploadProps = {
	onUploadSuccess?: (file: File) => void;
	onUploadError?: (error: FileError) => void;
	acceptedFileTypes?: string[];
	maxFileSize?: number;
	currentFile?: File | null;
	onFileRemove?: () => void;
	uploadDelay?: number;
	validateFile?: (file: File) => FileError | null;
	className?: string;
	/** Compact variant renders as a small button and expands only on drag/upload */
	variant?: "default" | "compact";
	/** When true, component is visually disabled and ignores interactions */
	disabled?: boolean;
};
