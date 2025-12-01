import { motion } from "motion/react";
import { formatBytes } from "@/shared/lib/utils";
import { UploadingAnimation } from "./uploading-animation";

type UploadingContentProps = {
	file: File | null;
	progress: number;
	onCancel: () => void;
};

export function UploadingContent({
	file,
	progress,
	onCancel,
}: UploadingContentProps) {
	return (
		<motion.div
			animate={{ opacity: 1, scale: 1 }}
			className="absolute inset-0 flex flex-col items-center justify-center p-6"
			exit={{ opacity: 0, scale: 0.95 }}
			initial={{ opacity: 0, scale: 0.95 }}
			key="uploading"
		>
			<div className="mb-4">
				<UploadingAnimation progress={progress} />
			</div>

			<div className="mb-4 space-y-1.5 text-center">
				<h3 className="truncate font-semibold text-gray-900 text-sm dark:text-white">
					{file?.name}
				</h3>
				<div className="flex items-center justify-center gap-2 text-xs">
					<span className="text-gray-500 dark:text-gray-400">
						{formatBytes(file?.size || 0)}
					</span>
					<span className="font-medium text-blue-500">
						{Math.round(progress)}%
					</span>
				</div>
			</div>

			<button
				className="flex w-4/5 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 font-semibold text-gray-900 text-sm transition-all duration-200 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
				onClick={onCancel}
				type="button"
			>
				Cancel
			</button>
		</motion.div>
	);
}
