export type FileSizeUnit = "B" | "KB" | "MB" | "GB" | "TB";
const units = ["B", "KB", "MB", "GB", "TB"];

export const kilobyte = 1024;

export function getReadableFileSize(size: number) {
	let order = 0;

	while (size >= 1024 && order < units.length - 1) {
		order++;
		size /= 1024;
	}

	const unit = units[order] === "B" ? "bytes" : units[order];
	return `${size.toFixed(2)} ${unit}`;
}
