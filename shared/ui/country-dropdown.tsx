"use client";

// data
import { countries } from "country-data-list";
// assets
import { CheckIcon, ChevronDown, Globe } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { getCountryUtcOffsetLabel } from "@/shared/libs/timezone/timezones";
// utils
import { cn } from "@/shared/libs/utils/cn";
// shadcn
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

// Country interface
export type Country = {
	alpha2: string;
	alpha3: string;
	countryCallingCodes: string[];
	currencies: string[];
	emoji?: string;
	ioc: string;
	languages: string[];
	name: string;
	status: string;
};

// Dropdown props
type CountryDropdownProps = {
	options?: Country[];
	onChange?: (country: Country) => void;
	defaultValue?: string;
	selectedAlpha2?: string;
	disabled?: boolean;
	placeholder?: string;
	slim?: boolean;
};

const CountryDropdownComponent = (
	{
		options = countries.all.filter(
			(country: Country) =>
				country.emoji && country.status !== "deleted" && country.ioc !== "PRK"
		),
		onChange,
		defaultValue,
		selectedAlpha2,
		disabled = false,
		placeholder = "Select a country",
		slim = false,
		...props
	}: CountryDropdownProps,
	ref: React.ForwardedRef<HTMLButtonElement>
) => {
	const [open, setOpen] = useState(false);

	const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
		undefined
	);

	useEffect(() => {
		if (selectedAlpha2) {
			const initial = options.find(
				(c) => c.alpha2.toUpperCase() === selectedAlpha2.toUpperCase()
			);
			if (initial) {
				setSelectedCountry(initial);
				return;
			}
		}
		if (defaultValue) {
			const initialCountry = options.find(
				(country) => country.alpha3 === defaultValue
			);
			if (initialCountry) {
				setSelectedCountry(initialCountry);
			} else {
				setSelectedCountry(undefined);
			}
		} else {
			setSelectedCountry(undefined);
		}
	}, [defaultValue, selectedAlpha2, options]);

	// Center-scroll to the selected item when opening
	const listRef = useRef<HTMLDivElement | null>(null);

	const handleSelect = useCallback(
		(country: Country) => {
			setSelectedCountry(country);
			onChange?.(country);
			setOpen(false);
		},
		[onChange]
	);

	const triggerClasses = cn(
		"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
		slim === true && "w-20"
	);

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				className={triggerClasses}
				disabled={disabled}
				ref={ref}
				{...props}
			>
				{selectedCountry ? (
					<div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
						<div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
							<CircleFlag
								countryCode={selectedCountry.alpha2.toLowerCase()}
								height={20}
							/>
						</div>
						{slim === false && (
							<span className="overflow-hidden text-ellipsis whitespace-nowrap">
								{selectedCountry.name}
							</span>
						)}
					</div>
				) : (
					<span>{slim === false ? placeholder : <Globe size={20} />}</span>
				)}
				<ChevronDown size={16} />
			</PopoverTrigger>
			<PopoverContent
				className="min-w-[--radix-popper-anchor-width] rounded-lg border p-0 shadow-lg"
				collisionPadding={10}
				side="bottom"
			>
				<Command className="max-h-[280px] w-full">
					<CommandList className="max-h-[280px] overflow-y-auto" ref={listRef}>
						<div className="sticky top-0 z-10 bg-popover">
							<CommandInput placeholder="Search country..." />
						</div>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup className="p-0">
							{options
								.filter((x) => x.name)
								.map((option) => (
									<CommandItem
										className="flex w-full items-center gap-2 px-3 py-2"
										data-id={(option.alpha2 || "").toUpperCase()}
										key={(option.alpha2 || option.name).toUpperCase()}
										onSelect={() => handleSelect(option)}
									>
										<div className="flex w-0 flex-grow items-center justify-between space-x-2 overflow-hidden">
											<div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
												<CircleFlag
													countryCode={option.alpha2.toLowerCase()}
													height={20}
												/>
											</div>
											<span className="overflow-hidden text-ellipsis whitespace-nowrap">
												{option.name}
											</span>
											<span className="shrink-0 text-muted-foreground text-xs">
												{getCountryUtcOffsetLabel(option.alpha2)}
											</span>
										</div>
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4 shrink-0",
												option.name === selectedCountry?.name
													? "opacity-100"
													: "opacity-0"
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
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
