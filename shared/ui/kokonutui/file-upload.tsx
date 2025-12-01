"use client";

import { AnimatePresence } from "motion/react";
import { useRef } from "react";
import {
	DEFAULT_MAX_FILE_SIZE,
	type FileStatus,
	type FileUploadProps,
	useFileUploadHandlers,
	useFileUploadState,
	useFileValidation,
	useUploadSimulation,
} from "@/shared/lib/file-upload";
import { cn } from "@/shared/lib/utils";
import {
	DropzoneContent,
	ErrorMessage,
	UploadingContent,
} from "@/shared/ui/file-upload";

// Helper function: Get height class based on variant and status
function getHeightClass(isCompact: boolean, status: FileStatus): string {
	if (!isCompact) {
		return "h-[240px]";
	}

	if (status === "uploading") {
		return "h-[200px]";
	}

	if (status === "dragging") {
		return "h-[140px]";
	}

	return "h-[44px]";
}

export default function FileUpload({
	onUploadSuccess = () => {
		// No-op: optional callback
	},
	onUploadError = () => {
		// No-op: optional callback
	},
	acceptedFileTypes = [],
	maxFileSize = DEFAULT_MAX_FILE_SIZE,
	currentFile: initialFile = null,
	onFileRemove = () => {
		// No-op: optional callback
	},
	uploadDelay = 2000,
	validateFile = () => null,
	className,
	variant = "default",
	disabled = false,
}: FileUploadProps) {
	const uploadState = useFileUploadState({ initialFile });
	const { validateFileSize, validateFileType } = useFileValidation({
		maxFileSize,
		acceptedFileTypes,
	});

	const {
		file,
		setFile,
		status,
		setStatus,
		progress,
		setProgress,
		error,
		setError,
		uploadIntervalRef,
	} = uploadState;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { simulateUpload } = useUploadSimulation({
		uploadDelay,
		onUploadSuccess,
		setProgress,
		setStatus: (
			s:
				| "idle"
				| "uploading"
				| ((prev: "idle" | "uploading") => "idle" | "uploading")
		) => {
			if (typeof s === "function") {
				setStatus((prev) => s(prev as "idle" | "uploading") as FileStatus);
			} else {
				setStatus(s as FileStatus);
			}
		},
		setFile,
		uploadIntervalRef,
	});

	const {
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleFileInputChange,
		triggerFileInput,
		resetState,
	} = useFileUploadHandlers({
		disabled,
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
	});

	const isCompact = variant === "compact";
	const heightClass = getHeightClass(isCompact, status);
	const wrapperWidthClass = isCompact ? "w-fit" : "w-full";

	return (
		<aside
			aria-disabled={disabled}
			aria-label="File upload"
			className={cn("relative", wrapperWidthClass, className || "")}
			data-disabled={disabled ? "true" : null}
		>
			<div className="group relative w-full rounded-xl bg-white p-0.5 ring-1 ring-gray-200 dark:bg-black dark:ring-white/10">
				<div className="-top-px absolute inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

				<div className="relative w-full rounded-[10px] bg-gray-50/50 p-1.5 dark:bg-white/[0.02]">
					<div
						className={cn(
							"relative mx-auto w-full overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-white/[0.08] dark:bg-black/50",
							error ? "border-red-500/50" : "",
							disabled ? "pointer-events-none opacity-50" : ""
						)}
					>
						<div
							className={cn(
								"absolute inset-0 transition-opacity duration-300",
								status === "dragging" ? "opacity-100" : "opacity-0"
							)}
						>
							<div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-blue-500/10 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-blue-500/10 to-transparent" />
							<div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-blue-500/10 to-transparent" />
							<div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-blue-500/10 to-transparent" />
							<div className="absolute inset-[20%] animate-pulse rounded-lg bg-blue-500/5 transition-all duration-300" />
						</div>

						{isCompact ? null : (
							<div className="-right-4 -top-4 absolute h-8 w-8 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
						)}

						<div className={cn("relative", heightClass)}>
							<AnimatePresence mode="wait">
								{(status === "idle" || status === "dragging") && (
									<DropzoneContent
										acceptedFileTypes={acceptedFileTypes}
										fileInputRef={fileInputRef}
										isCompact={isCompact}
										onDragLeave={handleDragLeave}
										onDragOver={handleDragOver}
										onDrop={handleDrop}
										onFileInputChange={handleFileInputChange}
										onTriggerFileInput={triggerFileInput}
										status={status as "idle" | "dragging"}
									/>
								)}
								{status === "uploading" && (
									<UploadingContent
										file={file}
										onCancel={resetState}
										progress={progress}
									/>
								)}
							</AnimatePresence>
						</div>

						<AnimatePresence>
							<ErrorMessage error={error} />
						</AnimatePresence>
					</div>
				</div>
			</div>
		</aside>
	);
}

FileUpload.displayName = "FileUpload";
