"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/libs/hooks/use-translation";

type Toast = { message: string; type: "success" | "error" } | null;

// Constants
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_FILE_SIZE_MB = 5;
const DEFAULT_MAX_FILE_SIZE = MAX_FILE_SIZE_MB * BYTES_PER_KB * KB_PER_MB; // 5MB
const MIN_DRAG_HEIGHT_PX = 40;
const DRAG_ACTIVE_HEIGHT_PX = 96;

export type CompactFileUploaderProps = {
	onSelect?: (file: File) => void;
	onRemove?: () => void;
	accept?: string[];
	disabled?: boolean;
	className?: string;
	maxFileSize?: number;
};

function formatBytes(bytes: number) {
	if (!+bytes) {
		return "0 Bytes";
	}
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"] as const;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function FileChip({
	file,
	onRemove,
}: {
	file: File;
	onRemove: () => void;
}) {
	return (
		<div className="flex max-w-full items-center gap-2 rounded-md border border-border bg-muted/50 px-2 py-1">
			<span
				className="max-w-[180px] truncate font-medium text-xs"
				title={`${file.name} • ${formatBytes(file.size)}`}
			>
				{file.name}
			</span>
			<button
				aria-label="Remove file"
				className="inline-flex h-5 w-5 items-center justify-center rounded border border-transparent text-red-600 hover:bg-red-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-200"
				onClick={onRemove}
				type="button"
			>
				<svg
					aria-hidden="true"
					className="h-3.5 w-3.5"
					fill="none"
					focusable="false"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<path
						d="M6 18L18 6M6 6l12 12"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</div>
	);
}

export default function CompactFileUploader({
	onSelect,
	onRemove,
	accept,
	disabled,
	className,
	maxFileSize = DEFAULT_MAX_FILE_SIZE,
}: CompactFileUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [toast, setToast] = useState<Toast>(null);

	const openPicker = useCallback(() => {
		if (disabled) {
			return;
		}
		fileInputRef.current?.click();
	}, [disabled]);

	const handleFiles = useCallback(
		(list: FileList | null) => {
			if (!list || list.length === 0) {
				return;
			}
			const f = list[0] as File;
			if (f.size > maxFileSize) {
				setToast({
					message: `File exceeds ${formatBytes(maxFileSize)}`,
					type: "error",
				});
				return;
			}
			setFile(f);
			onSelect?.(f);
		},
		[maxFileSize, onSelect]
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFiles(e.target.files);
			if (e.target) {
				e.target.value = "";
			}
		},
		[handleFiles]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			if (disabled) {
				return;
			}
			handleFiles(e.dataTransfer.files);
		},
		[disabled, handleFiles]
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled) {
				return;
			}
			setIsDragging(true);
		},
		[disabled]
	);

	const handleDragLeave = useCallback(() => setIsDragging(false), []);

	const clearFile = useCallback(() => {
		setFile(null);
		onRemove?.();
	}, [onRemove]);

	return (
		<div
			className={cn("flex w-full min-w-0 max-w-full flex-col gap-2", className)}
		>
			<input
				accept={accept?.join(",")}
				aria-label="File input"
				className="hidden"
				disabled={disabled}
				onChange={handleChange}
				ref={fileInputRef}
				type="file"
			/>

			<button
				aria-label="File upload region - drag and drop files here or click to browse"
				className={cn(
					"w-full min-w-0 max-w-full rounded-md border border-dashed transition-colors",
					"cursor-pointer bg-muted/30 hover:border-primary/50",
					isDragging ? "border-primary bg-primary/5" : "border-border",
					disabled && "cursor-not-allowed opacity-50"
				)}
				disabled={disabled}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				style={{
					minHeight: isDragging ? DRAG_ACTIVE_HEIGHT_PX : MIN_DRAG_HEIGHT_PX,
				}}
				type="button"
			>
				<div className="flex w-full min-w-0 max-w-full items-center justify-between gap-2 px-2 py-1.5">
					<div className="flex min-w-0 max-w-full items-center gap-1">
						<span className="truncate text-muted-foreground text-xs">
							{isDragging
								? t("uploader.dropHere") || "Drop file here"
								: t("uploader.dragOr") || "Drag a file here or"}
						</span>
					<button
						type="button"
						disabled={disabled}
						onClick={openPicker}
					>
						{t("uploader.browse") || "browse"}
					</button>













					</div>
				</div>
			</button>

			{file ? <FileChip file={file} onRemove={clearFile} /> : null}

			{toast ? (
				<div
					className={cn(
						"rounded border px-3 py-2 text-xs shadow-sm",
						toast.type === "success"
							? "border-green-200 bg-green-50 text-green-700"
							: "border-red-200 bg-red-50 text-red-700"
					)}
				>
					<div className="flex items-center gap-2">
						<span>{toast.type === "success" ? "✅" : "❌"}</span>
						<span className="truncate">{toast.message}</span>
						<button
							aria-label="Close"
							className="ml-auto text-current/70 hover:text-current"
							onClick={() => setToast(null)}
							type="button"
						>
							×
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
