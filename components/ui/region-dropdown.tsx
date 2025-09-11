"use client";

import countryRegionDataJson from "country-region-data/dist/data-umd";
import { CheckIcon, MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Region {
	name: string;
	shortCode: string;
}

export interface CountryRegion {
	countryName: string;
	countryShortCode: string;
	regions: Region[];
}

interface RegionDropdownProps {
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
}

export function RegionDropdown({
	countryCode,
	value,
	onChange,
	placeholder = "Select a city/region",
	disabled = false,
	autoSelectFirst = false,
}: RegionDropdownProps) {
	const [open, setOpen] = useState(false);
	const [regions, setRegions] = useState<Region[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		try {
			if (!countryCode) {
				setRegions([]);
				return;
			}
			const found = (countryRegionDataJson as CountryRegion[]).find(
				(c) => c.countryShortCode === countryCode,
			);
			setRegions(found?.regions || []);
		} finally {
			setLoading(false);
		}
	}, [countryCode]);

	// Optionally auto-select first available region when none selected
	useEffect(() => {
		if (autoSelectFirst && !value && regions.length > 0) {
			onChange?.(regions[0].shortCode, regions[0].name);
		}
	}, [autoSelectFirst, regions, value, onChange]);

	const displayValue = useMemo(() => {
		if (!value) return undefined;
		const item = regions.find((r) => r.shortCode === value);
		return item?.name || value;
	}, [value, regions]);

	const triggerClasses = cn(
		"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
	);

	const handleSelect = useCallback(
		(r: Region) => {
			onChange?.(r.shortCode, r.name);
			setOpen(false);
		},
		[onChange],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className={triggerClasses}
				disabled={disabled || !countryCode}
			>
				<span className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
					<MapPin size={16} />
					{displayValue || placeholder}
				</span>
			</PopoverTrigger>
			<PopoverContent
				collisionPadding={10}
				side="bottom"
				className="min-w-[--radix-popper-anchor-width] p-0 rounded-lg border shadow-lg"
			>
				<Command className="w-full max-h-[300px]">
					<CommandList className="max-h-[300px] overflow-y-auto">
						<div className="sticky top-0 z-10 bg-popover">
							<CommandInput
								placeholder={loading ? "Loading..." : "Search city/region..."}
								disabled={loading}
							/>
						</div>
						<CommandEmpty>
							{loading ? "Loading..." : "No results."}
						</CommandEmpty>
						<CommandGroup className="p-0">
							{regions.map((r) => (
								<CommandItem
									className="flex items-center w-full gap-2 px-3 py-2"
									key={r.shortCode}
									onSelect={() => handleSelect(r)}
								>
									<span className="overflow-hidden text-ellipsis whitespace-nowrap">
										{r.name}
									</span>
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4 shrink-0",
											r.shortCode === value ? "opacity-100" : "opacity-0",
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

