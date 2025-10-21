import { useCallback } from "react";
import type { FileError } from "@/shared/libs/file-upload";
import { DEFAULT_MAX_FILE_SIZE } from "@/shared/libs/file-upload";
import { formatBytes } from "@/shared/libs/utils";

type UseFileValidationProps = {
	maxFileSize?: number;
	acceptedFileTypes?: string[];
};

export function useFileValidation({
	maxFileSize = DEFAULT_MAX_FILE_SIZE,
	acceptedFileTypes = [],
}: UseFileValidationProps = {}) {
	const validateFileSize = useCallback(
		(file: File): FileError | null => {
			if (file.size > maxFileSize) {
				return {
					message: `File size exceeds ${formatBytes(maxFileSize)}`,
					code: "FILE_TOO_LARGE",
				};
			}
			return null;
		},
		[maxFileSize]
	);

	const validateFileType = useCallback(
		(file: File): FileError | null => {
			if (!acceptedFileTypes?.length) {
				return null;
			}

			const fileType = file.type.toLowerCase();
			if (
				!acceptedFileTypes.some((type) => fileType.match(type.toLowerCase()))
			) {
				return {
					message: `File type must be ${acceptedFileTypes.join(", ")}`,
					code: "INVALID_FILE_TYPE",
				};
			}
			return null;
		},
		[acceptedFileTypes]
	);

	return {
		validateFileSize,
		validateFileType,
	};
}
