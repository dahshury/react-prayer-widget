# React Prayer Widget

Embeddable prayer times widget components for React applications. Perfect for adding Islamic prayer times to headers, sidebars, or dedicated sections of your website.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Package Exports](#package-exports)
- [Next.js Project Setup](#nextjs-project-setup)
- [Quick Start](#quick-start)
- [Components](#components)
- [Hooks & Utilities](#hooks--utilities)
- [Settings & Configuration](#settings--configuration)
- [Types](#types)
- [Styling](#styling)
- [Demo](#demo)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Installation

Install the package using your preferred package manager:

```bash
npm install react-prayer-widget
# or
bun add react-prayer-widget
# or
pnpm add react-prayer-widget
# or
yarn add react-prayer-widget
```

## Prerequisites

Before using this package, ensure your project has:

- **React 19+** (required peer dependency)
- **React DOM 19+** (required peer dependency)
- **TypeScript 5+** (recommended)
- **Tailwind CSS** (required for styling)
- **Node.js 18+**

## Package Exports

The package exports prebuilt ESM and CJS bundles with TypeScript types from `dist/`. The package is tree-shakeable for optimal bundle sizes.

### Widget Components

- `PrayerWidget` - All-in-one widget with next prayer card, grid, and ticker
- `StandaloneNextPrayerCard` - Drop-in next prayer card with built-in context
- `NextPrayerCard` - Next prayer card component
- `WidgetPrayerCard` - Individual prayer card component
- `WidgetPrayerCardSkeleton` - Loading skeleton for prayer cards
- `PrayerGrid` - Grid layout for all 5 prayers
- `MinimalTicker` / `ScrollingTicker` - Ticker components with rotating azkar
- `DualDateDisplay` - Gregorian and Hijri date display

### Navigation & Settings

- `TopBar` - Header with date, time, and location
- `SettingsDialog` - Settings dialog component
- `PrayerGridSettingsDialog` - Settings dialog for prayer grid
- `WidgetSettingsContext` - Context for right-click settings menu
- `PrayerGridSettingsContext` - Context for prayer grid settings

### Hooks

- `useTranslation` - Access translations in components
- `useWidgetSettings` - Access widget settings from context
- `usePrayerGridSettings` - Access prayer grid settings from context
- `useSettingsPersistence` - Hook for localStorage settings persistence
- `useFontSettings` - Hook for applying custom fonts

### Utilities

- `formatCurrentTime` - Format Date object as time string
- `formatMinutesHHmm` - Format minutes as HH:mm string
- `formatTimeDisplay` - Format time string (24h/12h)
- `countryToFlag` - Get flag emoji for country code
- `computePrayerProgress` - Compute prayer progress value
- `cn` - Class name utility (like clsx)

### Providers

- `TranslationProvider` - Required provider for all widgets (handles i18n)

### Type Exports

- `PrayerTimes`, `NextPrayer`, `Location`
- `PrayerSettings`, `ExtendedPrayerSettings`
- `PrayerName`, `CalculationMethodId`, `AsrMethodId`
- `WidgetPrayerCardProps`, `NextPrayerCardProps`, `PrayerWidgetProps`
- `PrayerGridProps`, `StandaloneNextPrayerCardProps`
- `TopBarProps`, `SettingsDialogProps`

## Next.js Project Setup

If you're setting up a new Next.js project or integrating this package into an existing one, follow these steps:

### 1. Create Next.js Project (if starting fresh)

```bash
npx create-next-app@latest my-prayer-app
cd my-prayer-app
```

### 2. Install Dependencies

```bash
npm install react-prayer-widget
# or
bun add react-prayer-widget
```

### 3. Configure Tailwind CSS

Ensure your `tailwind.config.js` (or `tailwind.config.ts`) includes the package's content paths:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-prayer-widget/**/*.{js,ts,jsx,tsx}", // Add this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 4. Setup Global Styles

Ensure your `app/globals.css` (or `styles/globals.css`) includes Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Note**: CSS variables are automatically injected when you import the package. No additional CSS import is needed!

### 5. Run Development Server

```bash
npm run dev
# or
bun dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see your app.

## Quick Start

> **Important**: Most widgets require a `TranslationProvider` wrapper. However, `PrayerWidget` and `StandaloneNextPrayerCard` include their own providers for convenience.
>
> **Note**: CSS variables are automatically injected when you import the package. No manual CSS import is required!

### Simplest Example - PrayerWidget (All-in-One)

The easiest way to get started is with `PrayerWidget`, which bundles everything:

```tsx
import { PrayerWidget, TranslationProvider } from "react-prayer-widget";

function PrayerSection() {
  const prayerTimes = {
    fajr: "05:30",
    sunrise: "06:45",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    date: "2025-01-15",
    hijri: "1446-07-14",
  };

  return (
    <TranslationProvider language="en">
      <PrayerWidget
        prayerTimes={prayerTimes}
        showGrid={true}
        showTicker={true}
      />
    </TranslationProvider>
  );
}
```

### Standalone Next Prayer Card

For a drop-in next prayer card that handles everything internally:

```tsx
import { StandaloneNextPrayerCard } from "react-prayer-widget";

function Header() {
  const prayerTimes = {
    fajr: "05:30",
    sunrise: "06:45",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    date: "2025-01-15",
    hijri: "1446-07-14",
  };

  return <StandaloneNextPrayerCard prayerTimes={prayerTimes} />;
}
```

### Setup Translation Provider (for manual components)

For components that don't include their own providers, wrap your app or component tree:

```tsx
import { TranslationProvider } from "react-prayer-widget";

function App() {
  return (
    <TranslationProvider language="en">
      {/* Your app content with widgets */}
    </TranslationProvider>
  );
}
```

### Basic Usage - Individual Components

```tsx
import {
  WidgetPrayerCard,
  NextPrayerCard,
  PrayerGrid,
  TranslationProvider,
} from "react-prayer-widget";

function PrayerTimesSection() {
  const prayerTimes = {
    fajr: "05:30",
    sunrise: "06:45",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    date: "2025-01-15",
    hijri: "1446-07-14",
  };

  const nextPrayer = {
    name: "Asr",
    time: "15:45",
    timeUntil: 125, // minutes until prayer
    progress: 0.65, // 0-1 progress value
  };

  return (
    <TranslationProvider language="en">
      <NextPrayerCard
        nextPrayer={nextPrayer}
        timeFormat24h={true}
        language="en"
      />
      <PrayerGrid
        prayerTimes={prayerTimes}
        currentOrNextName={nextPrayer.name}
        timeFormat24h={true}
        language="en"
      />
    </TranslationProvider>
  );
}
```

### Complete Example with Settings Persistence

```tsx
import {
  PrayerWidget,
  TranslationProvider,
  useSettingsPersistence,
  type ExtendedPrayerSettings,
} from "react-prayer-widget";
import { useState } from "react";

function PrayerApp() {
  // Settings with automatic localStorage persistence
  const { settings, setSettings } = useSettingsPersistence({
    calculationMethod: 4,
    asrMethod: 0,
    timeFormat24h: true,
    language: "en",
    showOtherPrayers: true,
    showCity: true,
    showTicker: true,
  });

  const prayerTimes = {
    fajr: "05:30",
    sunrise: "06:45",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    date: new Date().toISOString().split("T")[0],
    hijri: "1446-07-14",
  };

  return (
    <TranslationProvider language={settings.language || "en"}>
      <PrayerWidget
        prayerTimes={prayerTimes}
        settings={settings}
        onSettingsChange={setSettings}
        showGrid={settings.showOtherPrayers}
        showTicker={settings.showTicker}
      />
    </TranslationProvider>
  );
}
```

## Components

### `PrayerWidget`

One-stop bundled widget that includes next prayer card, prayer grid, and ticker with built-in settings management.

**Props:**

| Prop               | Type                                | Default | Description                                 |
| ------------------ | ----------------------------------- | ------- | ------------------------------------------- |
| `prayerTimes`      | `PrayerTimes`                       | -       | Prayer times for all prayers                |
| `settings`         | `Partial<ExtendedPrayerSettings>?`  | -       | Settings object (optional, has defaults)    |
| `onSettingsChange` | `(settings: Partial<...>) => void?` | -       | Callback when settings change               |
| `className`        | `string?`                           | -       | Additional CSS classes for container        |
| `cardClassName`    | `string?`                           | -       | Additional CSS classes for next prayer card |
| `gridClassName`    | `string?`                           | -       | Additional CSS classes for prayer grid      |
| `tickerClassName`  | `string?`                           | -       | Additional CSS classes for ticker           |
| `showGrid`         | `boolean?`                          | `true`  | Show prayer grid                            |
| `showTicker`       | `boolean?`                          | `true`  | Show ticker                                 |
| `maxWidth`         | `MaxWidth`                          | -       | Max width constraint (see types below)      |

### `StandaloneNextPrayerCard`

Drop-in next prayer card that bundles translation provider and settings context. Only requires `prayerTimes` prop.

**Props:**

| Prop             | Type                               | Default | Description                             |
| ---------------- | ---------------------------------- | ------- | --------------------------------------- |
| `prayerTimes`    | `PrayerTimes`                      | -       | Prayer times for all prayers (required) |
| `settings`       | `Partial<ExtendedPrayerSettings>?` | -       | Optional settings override              |
| `className`      | `string?`                          | -       | Additional CSS classes                  |
| `gradientClass`  | `string?`                          | -       | Override gradient classes               |
| `showIcon`       | `boolean?`                         | `true`  | Show prayer icon                        |
| `classes`        | `object?`                          | -       | Fine-grained class overrides            |
| `maxWidth`       | `MaxWidth`                         | -       | Max width constraint                    |
| `nextSize`       | `WidgetPrayerCardSize?`            | -       | Size of the card                        |
| `size`           | `WidgetPrayerCardSize?`            | -       | Size (alias for nextSize)               |
| `timeFormat24h`  | `boolean?`                         | -       | Use 24-hour format                      |
| `cardBackground` | `string?`                          | -       | Custom card background image URL        |

### `WidgetPrayerCard`

Individual prayer card component for displaying a single prayer time.

**Props:**

| Prop                    | Type                                     | Default | Description                                   |
| ----------------------- | ---------------------------------------- | ------- | --------------------------------------------- |
| `name`                  | `string`                                 | -       | Prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha) |
| `time`                  | `string`                                 | -       | Prayer time (e.g., "12:30")                   |
| `timezone`              | `string?`                                | -       | IANA timezone for Friday detection            |
| `isFriday`              | `boolean?`                               | `false` | Override Friday detection                     |
| `isCurrent`             | `boolean?`                               | `false` | Highlight as current prayer                   |
| `isNext`                | `boolean?`                               | `false` | Show as next prayer with countdown            |
| `progress`              | `number?`                                | -       | Progress value (0-1) for countdown            |
| `countdown`             | `string?`                                | -       | Countdown string (e.g., "02:05")              |
| `size`                  | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?` | `"md"`  | Card size                                     |
| `horizontalView`        | `boolean?`                               | `false` | Compact horizontal layout                     |
| `showIcon`              | `boolean?`                               | `true`  | Show prayer icon                              |
| `className`             | `string?`                                | -       | Additional CSS classes                        |
| `classes`               | `object?`                                | -       | Fine-grained class overrides                  |
| `gradientClass`         | `string?`                                | -       | Override gradient classes                     |
| `cardBackground`        | `string?`                                | -       | Custom background image URL                   |
| `cardBackgroundOpacity` | `number?`                                | -       | Background opacity (0-1)                      |
| `onNameClick`           | `() => void?`                            | -       | Callback when prayer name is clicked          |
| `onDropFile`            | `(file: File) => Promise<void>?`         | -       | Callback for drag-drop file upload            |

### `NextPrayerCard`

Specialized card for displaying the next prayer with countdown.

**Props:**

| Prop                    | Type                                     | Default | Description                                                         |
| ----------------------- | ---------------------------------------- | ------- | ------------------------------------------------------------------- |
| `nextPrayer`            | `NextPrayer`                             | -       | Object with `name`, `time`, `timeUntil` (minutes), `progress` (0-1) |
| `timeFormat24h`         | `boolean?`                               | `true`  | Use 24-hour format                                                  |
| `language`              | `"en" \| "ar"?`                          | `"en"`  | Display language                                                    |
| `size`                  | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?` | `"md"`  | Card size                                                           |
| `nextSize`              | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?` | `"md"`  | Size for next prayer card                                           |
| `gradientClass`         | `string?`                                | -       | Override gradient classes                                           |
| `showIcon`              | `boolean?`                               | `true`  | Show prayer icon                                                    |
| `className`             | `string?`                                | -       | Additional CSS classes                                              |
| `classes`               | `object?`                                | -       | Fine-grained class overrides                                        |
| `maxWidth`              | `MaxWidth`                               | -       | Max width constraint                                                |
| `cardBackground`        | `string?`                                | -       | Custom background image URL                                         |
| `cardBackgroundOpacity` | `number?`                                | -       | Background opacity (0-1)                                            |

### `PrayerGrid`

Grid layout displaying all 5 prayers in a responsive grid.

**Props:**

| Prop                    | Type                    | Default | Description                                                       |
| ----------------------- | ----------------------- | ------- | ----------------------------------------------------------------- |
| `prayerTimes`           | `PrayerTimes`           | -       | Object with fajr, sunrise, dhuhr, asr, maghrib, isha, date, hijri |
| `currentOrNextName`     | `string`                | -       | Name of current/next prayer to highlight                          |
| `dimPreviousPrayers`    | `boolean?`              | `true`  | Dim past prayers                                                  |
| `horizontalView`        | `boolean?`              | `false` | Horizontal layout                                                 |
| `timeFormat24h`         | `boolean?`              | `true`  | Use 24-hour format                                                |
| `language`              | `"en" \| "ar"?`         | `"en"`  | Display language                                                  |
| `timezone`              | `string?`               | -       | IANA timezone                                                     |
| `isFriday`              | `boolean?`              | -       | Friday override                                                   |
| `size`                  | `WidgetPrayerCardSize?` | `"sm"`  | Card size                                                         |
| `maxWidth`              | `MaxWidth?`             | -       | Max width of grid                                                 |
| `gradientClass`         | `string?`               | -       | Override gradient classes                                         |
| `showIcon`              | `boolean?`              | `true`  | Show prayer icons                                                 |
| `classes`               | `object?`               | -       | Fine-grained class overrides                                      |
| `cardBackground`        | `string?`               | -       | Custom background image URL                                       |
| `cardBackgroundOpacity` | `number?`               | -       | Background opacity (0-1)                                          |

### `WidgetPrayerCardSkeleton`

Loading skeleton component for prayer cards. Useful while prayer times are being fetched.

**Props:**

| Prop             | Type                                     | Default | Description            |
| ---------------- | ---------------------------------------- | ------- | ---------------------- |
| `size`           | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?` | `"md"`  | Skeleton size          |
| `horizontalView` | `boolean?`                               | `false` | Horizontal layout      |
| `className`      | `string?`                                | -       | Additional CSS classes |

### `TopBar`

Header component displaying date, time, and location information.

**Props:**

| Prop            | Type            | Default | Description                       |
| --------------- | --------------- | ------- | --------------------------------- |
| `showDate`      | `boolean?`      | `true`  | Show date display                 |
| `showClock`     | `boolean?`      | `true`  | Show clock                        |
| `showCity`      | `boolean?`      | `true`  | Show city/location                |
| `currentTime`   | `Date`          | -       | Current time to display           |
| `location`      | `Location?`     | -       | Location object with city/country |
| `timeFormat24h` | `boolean?`      | `true`  | Use 24-hour format                |
| `language`      | `"en" \| "ar"?` | `"en"`  | Display language                  |
| `className`     | `string?`       | -       | Additional CSS classes            |
| `classes`       | `object?`       | -       | Fine-grained class overrides      |

### `WidgetSettingsContext`

Context provider that enables right-click settings menu on widgets. Wrap your widgets with this to allow users to customize settings via context menu.

**Props:**

| Prop               | Type                                                  | Description                   |
| ------------------ | ----------------------------------------------------- | ----------------------------- |
| `settings`         | `ExtendedPrayerSettings`                              | Current settings object       |
| `onSettingsChange` | `(settings: Partial<ExtendedPrayerSettings>) => void` | Callback when settings change |
| `children`         | `React.ReactNode`                                     | Widget components to wrap     |

### `PrayerGridSettingsContext`

Context provider specifically for prayer grid settings. Used with `PrayerGridSettingsDialog`.

**Props:**

Similar to `WidgetSettingsContext` but focused on grid-specific settings.

### `MinimalTicker` / `ScrollingTicker`

Ticker components for displaying prayer times and rotating azkar (remembrances) in a scrolling format.

**Props (MinimalTicker):**

| Prop          | Type          | Default | Description                       |
| ------------- | ------------- | ------- | --------------------------------- |
| `prayerTimes` | `PrayerTimes` | -       | Prayer times data                 |
| `intervalMs`  | `number?`     | `5000`  | Rotation interval in milliseconds |
| `className`   | `string?`     | -       | Additional CSS classes            |

**Props (ScrollingTicker):**

Similar to MinimalTicker with additional scrolling animation options.

### `DualDateDisplay`

Component for displaying both Gregorian and Hijri dates side by side.

**Props:**

| Prop        | Type      | Description            |
| ----------- | --------- | ---------------------- |
| `className` | `string?` | Additional CSS classes |

## Hooks & Utilities

### `useSettingsPersistence`

Hook for managing settings with automatic localStorage persistence. Settings are saved automatically whenever they change.

```tsx
import { useSettingsPersistence } from "react-prayer-widget";

function MyComponent() {
  const { settings, setSettings } = useSettingsPersistence({
    calculationMethod: 4,
    language: "en",
    // ... initial settings
  });

  // Settings are automatically persisted to localStorage
  const updateLanguage = (lang: "en" | "ar") => {
    setSettings({ language: lang });
    // Automatically saved to localStorage!
  };

  return <div>Current language: {settings.language}</div>;
}
```

**Returns:**

- `settings: ExtendedPrayerSettings` - Current settings object
- `setSettings: (settings: Partial<ExtendedPrayerSettings>) => void` - Update settings function

### `useFontSettings`

Hook for applying custom fonts based on settings. Automatically injects font styles.

```tsx
import { useFontSettings } from "react-prayer-widget";
import type { ExtendedPrayerSettings } from "react-prayer-widget";

function MyComponent() {
  const settings: ExtendedPrayerSettings = {
    fontFamily: "Amiri",
    // ... other settings
  };

  useFontSettings(settings); // Applies font styles automatically
  // ...
}
```

### `useWidgetSettings`

Hook to access widget settings from `WidgetSettingsContext`.

```tsx
import { useWidgetSettings } from "react-prayer-widget";

function MyComponent() {
  const { settings, updateSettings } = useWidgetSettings();
  // Access settings from context
}
```

### `usePrayerGridSettings`

Hook to access prayer grid settings from `PrayerGridSettingsContext`.

```tsx
import { usePrayerGridSettings } from "react-prayer-widget";

function MyComponent() {
  const { settings, updateSettings } = usePrayerGridSettings();
  // Access grid-specific settings
}
```

### `useTranslation`

Hook to access translations in your components.

```tsx
import { useTranslation } from "react-prayer-widget";

function MyComponent() {
  const t = useTranslation();
  return <div>{t.prayers.fajr}</div>; // "Fajr"
}
```

### `computePrayerProgress`

Utility function to compute prayer progress value (0-1) based on time until prayer.

```tsx
import { computePrayerProgress } from "react-prayer-widget";

const progress = computePrayerProgress(
  currentTime,
  previousPrayerTime,
  nextPrayerTime
); // Returns 0-1 value
```

### `formatCurrentTime(date: Date, format24h?: boolean): string`

Format a Date object as a time string.

```tsx
import { formatCurrentTime } from "react-prayer-widget";

const time = formatCurrentTime(new Date(), true); // "14:30"
const time12h = formatCurrentTime(new Date(), false); // "2:30 PM"
```

### `formatMinutesHHmm(minutes: number): string`

Format minutes as HH:mm string.

```tsx
import { formatMinutesHHmm } from "react-prayer-widget";

const time = formatMinutesHHmm(125); // "02:05"
```

### `formatTimeDisplay(time: string, format24h?: boolean, language?: string): string`

Format a time string (HH:mm) to 12-hour format if needed.

```tsx
import { formatTimeDisplay } from "react-prayer-widget";

const time24h = formatTimeDisplay("14:30", true); // "14:30"
const time12h = formatTimeDisplay("14:30", false); // "2:30 PM"
```

### `countryToFlag(countryCode: string): string`

Get flag emoji for a country code.

```tsx
import { countryToFlag } from "react-prayer-widget";

const flag = countryToFlag("US"); // "🇺🇸"
const flag2 = countryToFlag("SA"); // "🇸🇦"
```

### `cn(...classes): string`

Utility for merging class names (similar to `clsx`).

```tsx
import { cn } from "react-prayer-widget";

const className = cn("base-class", condition && "conditional-class");
```

## Settings & Configuration

The `ExtendedPrayerSettings` type provides comprehensive configuration options for all widgets. Here's a complete reference:

### Prayer Calculation Settings

| Property            | Type       | Default | Description                                                                   |
| ------------------- | ---------- | ------- | ----------------------------------------------------------------------------- |
| `calculationMethod` | `number`   | `4`     | Prayer calculation method (see [Calculation Methods](#calculation-methods))   |
| `asrMethod`         | `number`   | `0`     | Asr calculation method: `0` = Standard (Shafi, Maliki, Hanbali), `1` = Hanafi |
| `fajrOffset`        | `number`   | `0`     | Minutes offset for Fajr time                                                  |
| `dhuhrOffset`       | `number`   | `0`     | Minutes offset for Dhuhr time                                                 |
| `asrOffset`         | `number`   | `0`     | Minutes offset for Asr time                                                   |
| `maghribOffset`     | `number`   | `0`     | Minutes offset for Maghrib time                                               |
| `ishaOffset`        | `number`   | `0`     | Minutes offset for Isha time                                                  |
| `applySummerHour`   | `boolean?` | -       | Apply daylight saving time adjustment                                         |
| `forceHourMore`     | `boolean?` | -       | Force +1 hour adjustment                                                      |
| `forceHourLess`     | `boolean?` | -       | Force -1 hour adjustment                                                      |

### Location & Timezone Settings

| Property             | Type       | Default        | Description                                         |
| -------------------- | ---------- | -------------- | --------------------------------------------------- |
| `timezone`           | `string?`  | `"Asia/Mecca"` | IANA timezone identifier (e.g., "America/New_York") |
| `countryCode`        | `string?`  | `"SA"`         | ISO 3166-1 alpha-2 country code                     |
| `city`               | `string?`  | -              | City name                                           |
| `cityCode`           | `string?`  | -              | City code identifier                                |
| `autoDetectTimezone` | `boolean?` | `false`        | Automatically detect timezone from browser          |
| `locationError`      | `string?`  | -              | Error message for location/permission issues        |

### Display Settings

| Property             | Type            | Default | Description                                 |
| -------------------- | --------------- | ------- | ------------------------------------------- |
| `showOtherPrayers`   | `boolean?`      | `true`  | Show prayer grid with all 5 prayers         |
| `showCity`           | `boolean?`      | `true`  | Show city name in TopBar                    |
| `showTicker`         | `boolean?`      | `true`  | Show ticker with azkar                      |
| `showDate`           | `boolean?`      | `true`  | Show date in TopBar                         |
| `showClock`          | `boolean?`      | `true`  | Show clock in TopBar                        |
| `horizontalView`     | `boolean?`      | `false` | Use horizontal layout for prayer grid       |
| `timeFormat24h`      | `boolean?`      | `true`  | Use 24-hour time format (false for 12-hour) |
| `dimPreviousPrayers` | `boolean?`      | `true`  | Dim past prayers in grid                    |
| `language`           | `"en" \| "ar"?` | `"en"`  | Display language (English or Arabic)        |

### Visual Customization

| Property                | Type                                                       | Default     | Description                              |
| ----------------------- | ---------------------------------------------------------- | ----------- | ---------------------------------------- |
| `nextCardSize`          | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?`                   | `"md"`      | Size of the next prayer card             |
| `otherCardSize`         | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?`                   | `"sm"`      | Size of other prayer cards in grid       |
| `appWidth`              | `"xxs" \| "xs" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"?` | `"xl"`      | Max width for the overall container      |
| `prayerNameColor`       | `string?`                                                  | `"#ffffff"` | Custom color for prayer name text        |
| `prayerTimeColor`       | `string?`                                                  | `"#ffffff"` | Custom color for prayer time text        |
| `prayerCountdownColor`  | `string?`                                                  | `"#ffffff"` | Custom color for countdown text          |
| `cardBackground`        | `string?`                                                  | -           | Custom background image URL for cards    |
| `cardBackgroundOpacity` | `number?`                                                  | -           | Background opacity (0-1)                 |
| `fontFamily`            | `string?`                                                  | -           | Custom font family                       |
| `tickerIntervalMs`      | `number?`                                                  | `5000`      | Ticker rotation interval in milliseconds |

### Azan (Adhan) Settings

| Property               | Type                                                                          | Default     | Description                                                         |
| ---------------------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `azanEnabled`          | `boolean?`                                                                    | `true`      | Enable azan playback at prayer times                                |
| `azanPerPrayer`        | `boolean?`                                                                    | `false`     | Customize azan per prayer (vs. global)                              |
| `azanByPrayer`         | `Partial<Record<"Fajr" \| "Dhuhr" \| "Asr" \| "Maghrib" \| "Isha", string>>?` | -           | Per-prayer azan selection (default\|short\|fajr\|beep\|off\|custom) |
| `azanGlobalChoice`     | `string?`                                                                     | `"default"` | Global azan choice when not per-prayer                              |
| `azanVolume`           | `number?`                                                                     | `1`         | Azan volume (0-1)                                                   |
| `azanEditMode`         | `boolean?`                                                                    | `false`     | Enable drag-drop azan file upload mode                              |
| `azanCustomNames`      | `Partial<Record<"Fajr" \| "Dhuhr" \| "Asr" \| "Maghrib" \| "Isha", string>>?` | -           | Display names for custom uploaded azan files                        |
| `azanGlobalCustomName` | `string?`                                                                     | -           | Global custom azan file name                                        |

### Calculation Methods

The `calculationMethod` property accepts the following values:

| Value | Method                                        |
| ----- | --------------------------------------------- |
| `1`   | University of Islamic Sciences, Karachi       |
| `2`   | Islamic Society of North America (ISNA)       |
| `3`   | Muslim World League                           |
| `4`   | Umm Al-Qura University, Makkah (default)      |
| `5`   | Egyptian General Authority of Survey          |
| `7`   | Institute of Geophysics, University of Tehran |
| `8`   | Gulf Region                                   |
| `9`   | Kuwait                                        |
| `10`  | Qatar                                         |
| `11`  | Majlis Ugama Islam Singapura, Singapore       |
| `12`  | Union Organization islamic de France          |
| `13`  | Diyanet İşleri Başkanlığı, Turkey             |

### Azan Types

When configuring azan, you can use these values:

- `"default"` - Full azan (default)
- `"short"` - Short azan
- `"fajr"` - Special Fajr azan
- `"beep"` - Beep only
- `"off"` - Disabled
- `"custom"` - Custom uploaded file

### Example: Complete Settings Configuration

```tsx
import type { ExtendedPrayerSettings } from "react-prayer-widget";

const settings: ExtendedPrayerSettings = {
  // Calculation
  calculationMethod: 4, // Umm Al-Qura University
  asrMethod: 0, // Standard
  fajrOffset: 0,
  dhuhrOffset: 0,
  asrOffset: 0,
  maghribOffset: 0,
  ishaOffset: 0,

  // Location
  timezone: "America/New_York",
  countryCode: "US",
  city: "New York",
  autoDetectTimezone: true,

  // Display
  showOtherPrayers: true,
  showCity: true,
  showTicker: true,
  showDate: true,
  showClock: true,
  horizontalView: false,
  timeFormat24h: false, // 12-hour format
  dimPreviousPrayers: true,
  language: "en",

  // Visual
  nextCardSize: "lg",
  otherCardSize: "sm",
  appWidth: "xl",
  prayerNameColor: "#ffffff",
  prayerTimeColor: "#ffffff",
  prayerCountdownColor: "#ffffff",
  cardBackground: "https://example.com/bg.jpg",
  cardBackgroundOpacity: 0.8,
  fontFamily: "Amiri",
  tickerIntervalMs: 5000,

  // Azan
  azanEnabled: true,
  azanPerPrayer: false,
  azanGlobalChoice: "default",
  azanVolume: 0.8,
  azanEditMode: false,
};
```

## Types

### `PrayerTimes`

```typescript
type PrayerTimes = {
  fajr: string; // Fajr prayer time (HH:mm format)
  sunrise: string; // Sunrise time (HH:mm format)
  dhuhr: string; // Dhuhr prayer time (HH:mm format)
  asr: string; // Asr prayer time (HH:mm format)
  maghrib: string; // Maghrib prayer time (HH:mm format)
  isha: string; // Isha prayer time (HH:mm format)
  date: string; // Date string (ISO format: YYYY-MM-DD)
  hijri: string; // Hijri date string (YYYY-MM-DD)
};
```

### `NextPrayer`

```typescript
type NextPrayer = {
  name: string; // Prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha)
  time: string; // Prayer time (HH:mm format)
  timeUntil: number; // Minutes until prayer
  progress: number; // Progress value (0-1) for countdown visualization
};
```

### `Location`

```typescript
type Location = {
  latitude?: number;
  longitude?: number;
  city?: string | null;
  country?: string | null;
  countryCode?: string | null;
};
```

### `WidgetPrayerCardSize`

```typescript
type WidgetPrayerCardSize = "xxs" | "xs" | "sm" | "md" | "lg";
```

| Size  | Description       |
| ----- | ----------------- |
| `xxs` | Extra extra small |
| `xs`  | Extra small       |
| `sm`  | Small             |
| `md`  | Medium (default)  |
| `lg`  | Large             |

### `MaxWidth`

```typescript
type MaxWidth =
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | number
  | string
  | "fit-content"
  | "max-content"
  | "min-content"
  | "auto"
  | `calc(${string})`
  | `clamp(${string})`
  | `min(${string})`
  | `max(${string})`
  | `var(${string})`
  | `${number}${"px" | "rem" | "em" | "%" | "vw" | "vh" | "ch"}`;
```

## Styling

This package uses **Tailwind CSS** for styling. Make sure your project has Tailwind CSS configured.

### Automatic CSS Injection

**CSS variables are automatically injected** when you import the package. No manual CSS import is required! The package will automatically add all necessary CSS variables (colors, spacing, component tokens) to your document when any component is imported.

### Customization Options

Components are fully customizable via:

- **`className` prop** - Additional CSS classes for the root element
- **`classes` prop** - Fine-grained styling of internal elements (object with nested class names)
- **`gradientClass` prop** - Override gradient classes for prayer cards
- **`cardBackground` prop** - Custom background image URL
- **`cardBackgroundOpacity` prop** - Background opacity (0-1)
- **`style` prop** - Inline styles

### Example: Custom Styling

```tsx
<WidgetPrayerCard
  name="Dhuhr"
  time="12:30"
  className="my-custom-class"
  classes={{
    container: "bg-blue-500",
    time: "text-xl font-bold",
  }}
  gradientClass="bg-gradient-to-r from-blue-500 to-purple-500"
  cardBackground="https://example.com/bg.jpg"
  cardBackgroundOpacity={0.8}
/>
```

### Font Customization

Use the `fontFamily` setting and `useFontSettings` hook to apply custom fonts:

```tsx
import { useFontSettings } from "react-prayer-widget";

function MyComponent() {
  const settings = {
    fontFamily: "Amiri", // or any font name from available fonts
  };

  useFontSettings(settings);
  // Font styles are automatically applied
}
```

## Demo

A comprehensive live demo is available at `/demo` route in this repository. The demo showcases:

- PrayerWidget - All-in-one widget
- StandaloneNextPrayerCard - Drop-in next prayer card
- Next Prayer Card with countdown
- Prayer Grid with all 5 prayers
- TopBar with date, time, and location
- Minimal Ticker with rotating azkar
- Different widget sizes (xxs, xs, sm, md, lg)
- Right-click settings menu (via `WidgetSettingsContext`)
- Settings persistence with localStorage
- Custom fonts and backgrounds
- All settings variations and configurations

### Running the Demo Locally

```bash
# Clone the repository
git clone https://github.com/dahshury/react-prayer-widget.git
cd react-prayer-widget

# Install dependencies
bun install
# or
npm install

# Run development server
bun dev
# or
npm run dev

# Visit http://localhost:3000/demo
```

## Requirements

- **React 19+** (peer dependency)
- **React DOM 19+** (peer dependency)
- **TypeScript 5+** (recommended)
- **Tailwind CSS** (required for styling)
- **Node.js 18+**

## Troubleshooting

### Dynamic require error in Next.js with Turbopack

**Why this happens:** This error occurs when importing the **built package** (`react-prayer-widget` from `node_modules`), but **not** when using the source code directly (like in this repo's demo page or Vercel deployment).

- **Demo/Vercel**: Uses source TypeScript files → Next.js processes them directly → Dependencies handled normally by Node.js module resolution
- **External imports**: Uses pre-built bundle from `node_modules` → Turbopack processes the bundle → Tries to analyze dependencies → Encounters dynamic `require()` calls in `countries-and-timezones`, `country-data-list`, and `country-region-data` → Fails

The built package correctly externalizes these dependencies, but Turbopack still tries to process them when analyzing the bundle, causing the error.

**Solution:** If you encounter the error "dynamic usage of require is not supported" when using this package with Next.js 16+ and Turbopack, add the following configuration to your `next.config.js` or `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Next.js 16+ with Turbopack
  experimental: {
    serverExternalPackages: [
      "countries-and-timezones",
      "country-data-list",
      "country-region-data",
    ],
  },
  // Alternative: If using webpack instead of Turbopack
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      "countries-and-timezones": "commonjs countries-and-timezones",
      "country-data-list": "commonjs country-data-list",
      "country-region-data": "commonjs country-region-data",
    });
    return config;
  },
};

module.exports = nextConfig;
```

Or if using ESM format (`next.config.mjs`):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: [
      "countries-and-timezones",
      "country-data-list",
      "country-region-data",
    ],
  },
};

export default nextConfig;
```

This configuration tells Next.js/Turbopack to treat these packages as external dependencies and not attempt to bundle them, which resolves the dynamic require issue.

## License

MIT
