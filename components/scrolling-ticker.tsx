"use client";

import { Pause, Play, Settings, SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	DEFAULT_ISLAMIC_CONTENT,
	type IslamicContent,
} from "@/lib/islamic-content";

interface TickerSettings {
	enabled: boolean;
	speed: number; // seconds per content
	showArabic: boolean;
	contentType: "all" | "hadith" | "ayah";
}

type ScrollingTickerProps = {
	className?: string;
	contentPool?: IslamicContent[];
	showArabicDefault?: boolean;
	speedDefault?: number;
	enabledDefault?: boolean;
};

export function ScrollingTicker({
	className,
	contentPool,
	showArabicDefault = true,
	speedDefault = 10,
	enabledDefault = true,
}: ScrollingTickerProps) {
	const [currentContent, setCurrentContent] = useState<IslamicContent>(
		DEFAULT_ISLAMIC_CONTENT[0],
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
		if (settings.contentType === "all") return source;
		return source.filter((content) => content.type === settings.contentType);
	}, [contentPool, settings.contentType]);

	// Auto-advance content
	useEffect(() => {
		if (!isPlaying || !settings.enabled) return;

		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					// Move to next content
					const filteredContent = getFilteredContent();
					const currentIndex = filteredContent.findIndex(
						(c) => c.id === currentContent.id,
					);
					const nextIndex = (currentIndex + 1) % filteredContent.length;
					setCurrentContent(filteredContent[nextIndex]);
					return 0;
				}
				return prev + 100 / (settings.speed * 10); // Update every 100ms
			});
		}, 100);

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
			(c) => c.id === currentContent.id,
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
			className={`p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 ${className ?? ""}`}
		>
			<div className="space-y-3">
				{/* Progress bar */}
				<div className="w-full bg-muted rounded-full h-1">
					<div
						className="bg-primary h-1 rounded-full transition-all duration-100 ease-linear"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Content */}
				<div className="space-y-2">
					{settings.showArabic && currentContent.arabic && (
						<div className="text-right text-lg font-medium text-foreground leading-relaxed">
							{currentContent.arabic}
						</div>
					)}
					<div className="text-sm text-foreground leading-relaxed">
						{currentContent.english}
					</div>
					<div className="text-xs text-muted-foreground">
						— {currentContent.source}
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={togglePlayPause}
							className="h-8 w-8 p-0"
						>
							{isPlaying ? (
								<Pause className="h-3 w-3" />
							) : (
								<Play className="h-3 w-3" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={nextContent}
							className="h-8 w-8 p-0"
						>
							<SkipForward className="h-3 w-3" />
						</Button>
					</div>

					{/* Settings Dialog */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
										value={[settings.speed]}
										onValueChange={([speed]) =>
											setSettings((prev) => ({ ...prev, speed }))
										}
										min={5}
										max={30}
										step={1}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label>Content Type</Label>
									<div className="grid grid-cols-3 gap-2">
										{(["all", "hadith", "ayah"] as const).map((type) => (
											<Button
												key={type}
												variant={
													settings.contentType === type ? "default" : "outline"
												}
												size="sm"
												onClick={() => {
													setSettings((prev) => ({
														...prev,
														contentType: type,
													}));
													const filteredContent = getFilteredContent();
													setCurrentContent(filteredContent[0]);
													setProgress(0);
												}}
												className="capitalize"
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
