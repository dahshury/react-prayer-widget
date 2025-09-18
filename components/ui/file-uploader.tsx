"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

type Toast = { message: string; type: "success" | "error" } | null;

export interface CompactFileUploaderProps {
	onSelect?: (file: File) => void;
	onRemove?: () => void;
	accept?: string[];
	disabled?: boolean;
	className?: string;
	maxFileSize?: number;
}

function formatBytes(bytes: number) {
	if (!+bytes) return "0 Bytes";
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
		<div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1 border border-border max-w-full">
			<span
				className="text-xs font-medium truncate max-w-[180px]"
				title={`${file.name} • ${formatBytes(file.size)}`}
			>
				{file.name}
			</span>
			<button
				type="button"
				onClick={onRemove}
				className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-red-100 text-red-600 border border-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-200"
				aria-label="Remove file"
			>
				<svg
					className="w-3.5 h-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
					focusable="false"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
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
	maxFileSize = 5 * 1024 * 1024,
}: CompactFileUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [toast, setToast] = useState<Toast>(null);

	const openPicker = useCallback(() => {
		if (disabled) return;
		fileInputRef.current?.click();
	}, [disabled]);

	const handleFiles = useCallback(
		(list: FileList | null) => {
			if (!list || list.length === 0) return;
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
		[maxFileSize, onSelect],
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFiles(e.target.files);
			if (e.target) e.target.value = "";
		},
		[handleFiles],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			if (disabled) return;
			handleFiles(e.dataTransfer.files);
		},
		[disabled, handleFiles],
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled) return;
			setIsDragging(true);
		},
		[disabled],
	);

	const handleDragLeave = useCallback(() => setIsDragging(false), []);

	const clearFile = useCallback(() => {
		setFile(null);
		onRemove?.();
	}, [onRemove]);

	return (
		<div
			className={cn("flex flex-col gap-2 w-full max-w-full min-w-0", className)}
		>
			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				onChange={handleChange}
				accept={accept?.join(",")}
				aria-label="File input"
				disabled={disabled}
			/>

			<section
				className={cn(
					"w-full max-w-full min-w-0 rounded-md border border-dashed transition-colors",
					"bg-muted/30 hover:border-primary/50",
					isDragging ? "border-primary bg-primary/5" : "border-border",
				)}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				aria-label="File upload region"
				aria-disabled={disabled}
				style={{ minHeight: isDragging ? 96 : 40 }}
			>
				<div className="flex items-center justify-between gap-2 px-2 py-1.5 w-full max-w-full min-w-0">
					<div className="flex items-center gap-1 min-w-0 max-w-full">
						<span className="text-xs text-muted-foreground truncate">
							{isDragging
								? t("uploader.dropHere") || "Drop file here"
								: t("uploader.dragOr") || "Drag a file here or"}
						</span>
						<button
							type="button"
							className="text-xs text-primary underline underline-offset-2 hover:opacity-90 disabled:opacity-50"
							onClick={openPicker}
							disabled={disabled}
						>
							{t("uploader.browse") || "browse"}
						</button>
					</div>
				</div>
			</section>

			{file ? <FileChip file={file} onRemove={clearFile} /> : null}

			{toast ? (
				<div
					className={cn(
						"px-3 py-2 rounded text-xs shadow-sm border",
						toast.type === "success"
							? "bg-green-50 text-green-700 border-green-200"
							: "bg-red-50 text-red-700 border-red-200",
					)}
				>
					<div className="flex items-center gap-2">
						<span>{toast.type === "success" ? "✅" : "❌"}</span>
						<span className="truncate">{toast.message}</span>
						<button
							type="button"
							className="ml-auto text-current/70 hover:text-current"
							onClick={() => setToast(null)}
							aria-label="Close"
						>
							×
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
