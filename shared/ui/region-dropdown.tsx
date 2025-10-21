"use client";

import countryRegionDataJson from "country-region-data/dist/data-umd";
import { CheckIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

export type Region = {
	name: string;
	shortCode: string;
};

export type CountryRegion = {
	countryName: string;
	countryShortCode: string;
	regions: Region[];
};

type RegionDropdownProps = {
	countryCode?: string;
	value?: string;
	onChange?: (shortCode: string, name: string) => void;
	placeholder?: string;
	disabled?: boolean;
	/**
	 * When true, selects the first available region if no value is provided.
	 * Defaults to false to avoid unintended data reloads on mount.
	 */
	autoSelectFirst?: boolean;
	/**
	 * When provided and no value is set, attempts to select the region whose name
	 * includes this string (case-insensitive). Useful for sane defaults.
	 */
	preferredName?: string;
	/**
	 * Optional display text to use when no region value is selected (e.g. city from geolocation).
	 */
	displayOverride?: string;
};

export function RegionDropdown({
	countryCode,
	value,
	onChange,
	placeholder = "Select a city/region",
	disabled = false,
	autoSelectFirst = false,
	preferredName,
	displayOverride,
}: RegionDropdownProps) {
	const [open, setOpen] = useState(false);
	const [regions, setRegions] = useState<Region[]>([]);
	const [loading, setLoading] = useState(false);

	// Center-scroll the selected item when opening
	const listRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setLoading(true);
		try {
			if (!countryCode) {
				setRegions([]);
				return;
			}
			const found = (countryRegionDataJson as CountryRegion[]).find(
				(c) => c.countryShortCode === countryCode
			);
			setRegions(found?.regions || []);
		} finally {
			setLoading(false);
		}
	}, [countryCode]);

	// Prefer selecting by name when provided
	useEffect(() => {
		if (!value && preferredName && regions.length > 0) {
			const lower = preferredName.toLowerCase();
			const match = regions.find((r) => r.name.toLowerCase().includes(lower));
			if (match) {
				onChange?.(match.shortCode, match.name);
				return;
			}
		}
		if (autoSelectFirst && !value && regions.length > 0) {
			onChange?.(regions[0].shortCode, regions[0].name);
		}
	}, [autoSelectFirst, preferredName, regions, value, onChange]);

	const displayValue = useMemo(() => {
		if (!value) {
			return;
		}
		const item = regions.find((r) => r.shortCode === value);
		return item?.name || value;
	}, [value, regions]);

	const displayText = displayOverride || displayValue;

	const triggerClasses = cn(
		"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
	);

	const handleSelect = useCallback(
		(r: Region) => {
			onChange?.(r.shortCode, r.name);
			setOpen(false);
		},
		[onChange]
	);

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				className={triggerClasses}
				disabled={disabled || !countryCode}
			>
				<span className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
					{displayText || placeholder}
				</span>
			</PopoverTrigger>
			<PopoverContent
				className="min-w-[--radix-popper-anchor-width] rounded-lg border p-0 shadow-lg"
				collisionPadding={10}
				side="bottom"
			>
				<Command className="max-h-[300px] w-full">
					<CommandList className="max-h-[300px] overflow-y-auto" ref={listRef}>
						<div className="sticky top-0 z-10 bg-popover">
							<CommandInput
								disabled={loading}
								placeholder={loading ? "Loading..." : "Search city/region..."}
							/>
						</div>
						<CommandEmpty>
							{loading ? "Loading..." : "No results."}
						</CommandEmpty>
						<CommandGroup className="p-0">
							{regions.map((r) => (
								<CommandItem
									className="flex w-full items-center gap-2 px-3 py-2"
									data-id={r.shortCode.toUpperCase()}
									key={r.shortCode.toUpperCase()}
									onSelect={() => handleSelect(r)}
								>
									<span className="overflow-hidden text-ellipsis whitespace-nowrap">
										{r.name}
									</span>
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4 shrink-0",
											r.shortCode === value ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
