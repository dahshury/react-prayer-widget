"use client";

// data
import { countries } from "country-data-list";
// assets
import { CheckIcon, ChevronDown, Globe } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { CircleFlag } from "react-circle-flags";
// shadcn
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
import { getCountryUtcOffsetLabel } from "@/lib/timezones";
// utils
import { cn } from "@/lib/utils";

// Country interface
export interface Country {
	alpha2: string;
	alpha3: string;
	countryCallingCodes: string[];
	currencies: string[];
	emoji?: string;
	ioc: string;
	languages: string[];
	name: string;
	status: string;
}

// Dropdown props
interface CountryDropdownProps {
	options?: Country[];
	onChange?: (country: Country) => void;
	defaultValue?: string;
	selectedAlpha2?: string;
	disabled?: boolean;
	placeholder?: string;
	slim?: boolean;
}

const CountryDropdownComponent = (
	{
		options = countries.all.filter(
			(country: Country) =>
				country.emoji && country.status !== "deleted" && country.ioc !== "PRK",
		),
		onChange,
		defaultValue,
		selectedAlpha2,
		disabled = false,
		placeholder = "Select a country",
		slim = false,
		...props
	}: CountryDropdownProps,
	ref: React.ForwardedRef<HTMLButtonElement>,
) => {
	const [open, setOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
		undefined,
	);

	useEffect(() => {
		if (selectedAlpha2) {
			const initial = options.find(
				(c) => c.alpha2.toUpperCase() === selectedAlpha2.toUpperCase(),
			);
			if (initial) {
				setSelectedCountry(initial);
				return;
			}
		}
		if (defaultValue) {
			const initialCountry = options.find(
				(country) => country.alpha3 === defaultValue,
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

	// Auto-scroll to selected item when opening
	useEffect(() => {
		if (open && selectedCountry) {
			const id =
				selectedCountry.alpha3 ||
				selectedCountry.alpha2 ||
				selectedCountry.name;
			const el = document.querySelector(`[data-id="${id}"]`);
			if (el && "scrollIntoView" in el) {
				(el as HTMLElement).scrollIntoView({ block: "center" });
			}
		}
	}, [open, selectedCountry]);

	const handleSelect = useCallback(
		(country: Country) => {
			setSelectedCountry(country);
			onChange?.(country);
			setOpen(false);
		},
		[onChange],
	);

	const triggerClasses = cn(
		"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
		slim === true && "w-20",
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				ref={ref}
				className={triggerClasses}
				disabled={disabled}
				{...props}
			>
				{selectedCountry ? (
					<div className="flex items-center flex-grow w-0 gap-2 overflow-hidden">
						<div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
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
				collisionPadding={10}
				side="bottom"
				className="min-w-[--radix-popper-anchor-width] p-0 rounded-lg border shadow-lg"
			>
				<Command className="w-full max-h-[280px]">
					<CommandList className="max-h-[280px] overflow-y-auto">
						<div className="sticky top-0 z-10 bg-popover">
							<CommandInput placeholder="Search country..." />
						</div>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup className="p-0">
							{options
								.filter((x) => x.name)
								.map((option) => (
									<CommandItem
										className="flex items-center w-full gap-2 px-3 py-2"
										key={option.alpha3 || option.alpha2 || option.name}
										data-id={option.alpha3 || option.alpha2 || option.name}
										onSelect={() => handleSelect(option)}
									>
										<div className="flex flex-grow w-0 items-center justify-between space-x-2 overflow-hidden">
											<div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
												<CircleFlag
													countryCode={option.alpha2.toLowerCase()}
													height={20}
												/>
											</div>
											<span className="overflow-hidden text-ellipsis whitespace-nowrap">
												{option.name}
											</span>
											<span className="shrink-0 text-xs text-muted-foreground">
												{getCountryUtcOffsetLabel(option.alpha2)}
											</span>
										</div>
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4 shrink-0",
												option.name === selectedCountry?.name
													? "opacity-100"
													: "opacity-0",
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
