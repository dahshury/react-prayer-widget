import { motion } from "motion/react";
import type { FileError } from "@/shared/libs/file-upload";

type ErrorMessageProps = {
	error: FileError | null;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
	if (!error) {
		return null;
	}

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="-translate-x-1/2 absolute bottom-4 left-1/2 transform rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2"
			exit={{ opacity: 0, y: -10 }}
			initial={{ opacity: 0, y: 10 }}
		>
			<p className="text-red-500 text-sm dark:text-red-400">{error.message}</p>
		</motion.div>
	);
}
