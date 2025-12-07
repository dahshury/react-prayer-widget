"use client";

import { CheckIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

export type ComboboxOption = {
	value: string;
	label: string;
	imageUrl?: string;
	fontFamily?: string;
};

type ComboboxProps = {
	options: ComboboxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
};

export function Combobox({
	options,
	value,
	onValueChange,
	placeholder = "Select option...",
	searchPlaceholder = "Search...",
	emptyText = "No option found.",
	disabled = false,
	className,
}: ComboboxProps) {
	const [open, setOpen] = useState(false);

	const selectedOption = options.find((opt) => opt.value === value);

	const selectedOptionStyle = (() => {
		if (
			selectedOption?.fontFamily !== undefined &&
			selectedOption.fontFamily !== "default"
		) {
			return {
				fontFamily: `"${selectedOption.fontFamily}", var(--font-sans)`,
			};
		}
		return {};
	})();

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						"w-[280px] justify-between",
						!value && "text-muted-foreground",
						className
					)}
					disabled={disabled}
					role="combobox"
					variant="outline"
				>
					<span className="flex items-center gap-2 truncate">
						{selectedOption?.imageUrl ? (
							<Image
								alt={selectedOption.label}
								className="h-6 w-9 shrink-0 rounded border border-border object-cover"
								height={24}
								src={selectedOption.imageUrl}
								width={36}
							/>
						) : null}
						<span className="truncate" style={selectedOptionStyle}>
							{selectedOption ? selectedOption.label : placeholder || ""}
						</span>
					</span>
					<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[280px] p-0">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const optionStyle = (() => {
									if (
										option.fontFamily !== undefined &&
										option.fontFamily !== "default"
									) {
										return {
											fontFamily: `"${option.fontFamily}", var(--font-sans)`,
										};
									}
									return {};
								})();

								return (
									<CommandItem
										className="flex items-center gap-2"
										key={option.value}
										onSelect={() => {
											onValueChange?.(option.value);
											setOpen(false);
										}}
										value={`${option.label} ${option.value}`}
									>
										<CheckIcon
											className={cn(
												"h-4 w-4 shrink-0",
												value === option.value ? "opacity-100" : "opacity-0"
											)}
										/>
										<span className="flex-1 truncate" style={optionStyle}>
											{option.label}
										</span>
										{option.imageUrl ? (
											<Image
												alt={option.label}
												className="ml-auto h-10 w-16 shrink-0 rounded border border-border/50 object-cover shadow-sm"
												height={40}
												src={option.imageUrl}
												width={64}
											/>
										) : null}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
