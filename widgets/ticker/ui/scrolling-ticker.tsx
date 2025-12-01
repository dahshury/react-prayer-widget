"use client";

import { Pause, Play, Settings, SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	DEFAULT_ISLAMIC_CONTENT,
	type IslamicContent,
} from "@/shared/lib/prayer";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";

type TickerSettings = {
	enabled: boolean;
	speed: number; // seconds per content
	showArabic: boolean;
	contentType: "all" | "hadith" | "ayah";
};

type ScrollingTickerProps = {
	className?: string;
	contentPool?: IslamicContent[];
	showArabicDefault?: boolean;
	speedDefault?: number;
	enabledDefault?: boolean;
};

const PROGRESS_COMPLETE = 100; // Progress bar completion percentage
const ANIMATION_INTERVAL_MS = 100; // Update interval in milliseconds
const SPEED_DIVISOR = 10; // Divisor for converting speed to update frequency

export function ScrollingTicker({
	className,
	contentPool,
	showArabicDefault = true,
	speedDefault = 10,
	enabledDefault = true,
}: ScrollingTickerProps) {
	const [currentContent, setCurrentContent] = useState<IslamicContent>(
		DEFAULT_ISLAMIC_CONTENT[0]
	);
	const [isPlaying, setIsPlaying] = useState(true);
	const [settings, setSettings] = useState<TickerSettings>({
		enabled: enabledDefault,
		speed: speedDefault,
		showArabic: showArabicDefault,
		contentType: "all",
	});
	const [progress, setProgress] = useState(0);

	// Filter content based on settings
	const getFilteredContent = useCallback(() => {
		const source =
			contentPool && contentPool.length > 0
				? contentPool
				: DEFAULT_ISLAMIC_CONTENT;
		if (settings.contentType === "all") {
			return source;
		}
		return source.filter((content) => content.type === settings.contentType);
	}, [contentPool, settings.contentType]);

	// Auto-advance content
	useEffect(() => {
		if (!(isPlaying && settings.enabled)) {
			return;
		}

		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= PROGRESS_COMPLETE) {
					// Move to next content
					const filteredContent = getFilteredContent();
					const currentIndex = filteredContent.findIndex(
						(c) => c.id === currentContent.id
					);
					const nextIndex = (currentIndex + 1) % filteredContent.length;
					setCurrentContent(filteredContent[nextIndex]);
					return 0;
				}
				return prev + PROGRESS_COMPLETE / (settings.speed * SPEED_DIVISOR); // Update every 100ms
			});
		}, ANIMATION_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [
		isPlaying,
		settings.enabled,
		settings.speed,
		getFilteredContent,
		currentContent.id,
	]);

	const nextContent = () => {
		const filteredContent = getFilteredContent();
		const currentIndex = filteredContent.findIndex(
			(c) => c.id === currentContent.id
		);
		const nextIndex = (currentIndex + 1) % filteredContent.length;
		setCurrentContent(filteredContent[nextIndex]);
		setProgress(0);
	};

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	if (!settings.enabled) {
		return null;
	}

	return (
		<Card
			className={`border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-4 ${className ?? ""}`}
		>
			<div className="space-y-3">
				{/* Progress bar */}
				<div className="h-1 w-full rounded-full bg-muted">
					<div
						className="h-1 rounded-full bg-primary transition-all duration-100 ease-linear"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Content */}
				<div className="space-y-2">
					{!!settings.showArabic && !!currentContent.arabic && (
						<div className="text-right font-medium text-foreground text-lg leading-relaxed">
							{currentContent.arabic}
						</div>
					)}
					<div className="text-foreground text-sm leading-relaxed">
						{currentContent.english}
					</div>
					<div className="text-muted-foreground text-xs">
						— {currentContent.source}
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							className="h-8 w-8 p-0"
							onClick={togglePlayPause}
							size="sm"
							variant="ghost"
						>
							{isPlaying ? (
								<Pause className="h-3 w-3" />
							) : (
								<Play className="h-3 w-3" />
							)}
						</Button>
						<Button
							className="h-8 w-8 p-0"
							onClick={nextContent}
							size="sm"
							variant="ghost"
						>
							<SkipForward className="h-3 w-3" />
						</Button>
					</div>

					{/* Settings Dialog */}
					<Dialog>
						<DialogTrigger asChild>
							<Button className="h-8 w-8 p-0" size="sm" variant="ghost">
								<Settings className="h-3 w-3" />
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Ticker Settings</DialogTitle>
							</DialogHeader>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Enable Ticker</Label>
									<Switch
										checked={settings.enabled}
										onCheckedChange={(enabled) =>
											setSettings((prev) => ({ ...prev, enabled }))
										}
									/>
								</div>

								<div className="flex items-center justify-between">
									<Label>Show Arabic Text</Label>
									<Switch
										checked={settings.showArabic}
										onCheckedChange={(showArabic) =>
											setSettings((prev) => ({ ...prev, showArabic }))
										}
									/>
								</div>

								<div className="space-y-2">
									<Label>Display Speed: {settings.speed}s per content</Label>
									<Slider
										className="w-full"
										max={30}
										min={5}
										onValueChange={([speed]) =>
											setSettings((prev) => ({ ...prev, speed }))
										}
										step={1}
										value={[settings.speed]}
									/>
								</div>

								<div className="space-y-2">
									<Label>Content Type</Label>
									<div className="grid grid-cols-3 gap-2">
										{(["all", "hadith", "ayah"] as const).map((type) => (
											<Button
												className="capitalize"
												key={type}
												onClick={() => {
													setSettings((prev) => ({
														...prev,
														contentType: type,
													}));
													const filteredContent = getFilteredContent();
													setCurrentContent(filteredContent[0]);
													setProgress(0);
												}}
												size="sm"
												variant={
													settings.contentType === type ? "default" : "outline"
												}
											>
												{type}
											</Button>
										))}
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</Card>
	);
}
