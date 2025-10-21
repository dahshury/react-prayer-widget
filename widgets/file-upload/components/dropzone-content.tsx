import { UploadCloud } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { UploadIllustration } from "./upload-illustration";

// Animation constants
const DRAGGING_OPACITY = 0.8;
const NORMAL_OPACITY = 1;
const DRAGGING_SCALE = 0.98;
const NORMAL_SCALE = 1;

type DropzoneContentProps = {
	isCompact: boolean;
	status: "idle" | "dragging";
	acceptedFileTypes?: string[];
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	onTriggerFileInput: () => void;
	onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export function DropzoneContent({
	isCompact,
	status,
	acceptedFileTypes,
	onDragLeave,
	onDragOver,
	onDrop,
	onTriggerFileInput,
	onFileInputChange,
	fileInputRef,
}: DropzoneContentProps) {
	return (
		<motion.div
			animate={{
				opacity: status === "dragging" ? DRAGGING_OPACITY : NORMAL_OPACITY,
				y: 0,
				scale: status === "dragging" ? DRAGGING_SCALE : NORMAL_SCALE,
			}}
			className={cn(
				"absolute inset-0 flex items-center justify-center p-2",
				isCompact ? "flex-row gap-2" : "flex-col"
			)}
			exit={{ opacity: 0, y: -10 }}
			initial={{ opacity: 0, y: 10 }}
			key="dropzone"
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			transition={{ duration: 0.2 }}
		>
			{isCompact ? null : (
				<div className="mb-4">
					<UploadIllustration />
				</div>
			)}

			<button
				className={cn(
					"group flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 font-semibold text-gray-900 text-sm transition-all duration-200 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
					isCompact ? "w-auto" : "w-4/5"
				)}
				onClick={onTriggerFileInput}
				type="button"
			>
				<span>{isCompact ? "Browse" : "Upload File"}</span>
				<UploadCloud className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
			</button>
			{isCompact ? null : (
				<p className="mt-3 text-gray-500 text-xs dark:text-gray-400">
					or drag and drop your file here
				</p>
			)}

			<input
				accept={acceptedFileTypes?.join(",")}
				aria-label="File input"
				className="sr-only"
				onChange={onFileInputChange}
				ref={fileInputRef}
				type="file"
			/>
		</motion.div>
	);
}
