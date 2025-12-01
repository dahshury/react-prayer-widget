import { cn } from "@/shared/libs/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-muted/50", className)}
			data-slot="skeleton"
			{...props}
		/>
	);
}

export { Skeleton };
