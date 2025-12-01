# React Prayer Widget

Embeddable prayer times widget components for React applications. Perfect for adding Islamic prayer times to headers, sidebars, or dedicated sections of your website.

## Installation

```bash
npm install react-prayer-widget
# or
bun add react-prayer-widget
# or
pnpm add react-prayer-widget
```

## Quick Start

> **Important**: All widgets require a `TranslationProvider` wrapper. Make sure to wrap your app or the component tree where you use the widgets with `TranslationProvider`.

### Setup Translation Provider

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

### Basic Usage - Prayer Card

```tsx
import { WidgetPrayerCard, TranslationProvider } from "react-prayer-widget";

function Header() {
  return (
    <TranslationProvider language="en">
      <header>
        <WidgetPrayerCard name="Dhuhr" time="12:30" isCurrent={true} />
      </header>
    </TranslationProvider>
  );
}
```

### Next Prayer with Countdown

```tsx
import { NextPrayerCard, TranslationProvider } from "react-prayer-widget";

function PrayerWidget() {
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
    </TranslationProvider>
  );
}
```

### Prayer Grid (All 5 Prayers)

```tsx
import { PrayerGrid, TranslationProvider } from "react-prayer-widget";

function PrayerTimesSection() {
  const prayerTimes = {
    fajr: "05:30",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    date: "2025-01-15",
    hijri: "1446-07-14",
  };

  return (
    <TranslationProvider language="en">
      <PrayerGrid
        prayerTimes={prayerTimes}
        currentOrNextName="Dhuhr"
        timeFormat24h={true}
        language="en"
      />
    </TranslationProvider>
  );
}
```

### Embedding in a Header

```tsx
import { NextPrayerCard, TranslationProvider } from "react-prayer-widget";

function AppHeader() {
  // Get prayer times from your API or state management
  const nextPrayer = {
    name: "Asr",
    time: "15:45",
    timeUntil: 125,
    progress: 0.65,
  };

  return (
    <TranslationProvider language="en">
      <header className="flex items-center justify-between p-4">
        <div className="logo">My App</div>

        <div className="flex items-center gap-4">
          {/* Prayer widget embedded in header */}
        <NextPrayerCard nextPrayer={nextPrayer} size="sm" />

        <nav>...</nav>
      </div>
    </header>
  );
}
```

### Horizontal Layout (Compact for Headers)

```tsx
import { WidgetPrayerCard, TranslationProvider } from "react-prayer-widget";

function CompactHeader() {
  return (
    <TranslationProvider language="en">
      <header>
        <WidgetPrayerCard
          name="Dhuhr"
          time="12:30"
          horizontalView={true}
          size="xs"
          showIcon={false}
        />
      </header>
    </TranslationProvider>
  );
}
```

## Components

### `WidgetPrayerCard`

Individual prayer card component.

**Props:**

| Prop             | Type                                     | Description                                   |
| ---------------- | ---------------------------------------- | --------------------------------------------- |
| `name`           | `string`                                 | Prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha) |
| `time`           | `string`                                 | Prayer time (e.g., "12:30")                   |
| `timezone`       | `string?`                                | IANA timezone for Friday detection            |
| `isFriday`       | `boolean?`                               | Override Friday detection                     |
| `isCurrent`      | `boolean?`                               | Highlight as current prayer                   |
| `isNext`         | `boolean?`                               | Show as next prayer with countdown            |
| `progress`       | `number?`                                | Progress value (0-1) for countdown            |
| `countdown`      | `string?`                                | Countdown string (e.g., "02:05")              |
| `size`           | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?` | Card size                                     |
| `horizontalView` | `boolean?`                               | Compact horizontal layout                     |
| `showIcon`       | `boolean?`                               | Show prayer icon                              |
| `className`      | `string?`                                | Additional CSS classes                        |

### `NextPrayerCard`

Specialized card for displaying the next prayer with countdown. This is a convenience wrapper around `WidgetPrayerCard` with `isNext={true}`.

**Props:**

| Prop            | Type                                                          | Description                                                         |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| `nextPrayer`    | `NextPrayer`                                                  | Object with `name`, `time`, `timeUntil` (minutes), `progress` (0-1) |
| `timeFormat24h` | `boolean?`                                                    | Use 24-hour format (default: true)                                  |
| `language`      | `"en" \| "ar"?`                                               | Display language (default: "en")                                    |
| `size`          | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?`                      | Card size                                                           |
| `nextSize`      | `"xxs" \| "xs" \| "sm" \| "md" \| "lg"?`                      | Size for next prayer card                                           |
| `gradientClass` | `string?`                                                     | Override gradient classes                                           |
| `showIcon`      | `boolean?`                                                    | Show prayer icon                                                    |
| `className`     | `string?`                                                     | Additional CSS classes                                              |
| `maxWidth`      | `"md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| number \| string?` | Max width constraint                                                |

### `PrayerGrid`

Grid layout displaying all 5 prayers.

**Props:**

| Prop                 | Type                    | Description                                              |
| -------------------- | ----------------------- | -------------------------------------------------------- |
| `prayerTimes`        | `PrayerTimes`           | Object with fajr, dhuhr, asr, maghrib, isha, date, hijri |
| `currentOrNextName`  | `string`                | Name of current/next prayer to highlight                 |
| `dimPreviousPrayers` | `boolean?`              | Dim past prayers                                         |
| `horizontalView`     | `boolean?`              | Horizontal layout                                        |
| `timeFormat24h`      | `boolean?`              | Use 24-hour format                                       |
| `language`           | `"en" \| "ar"?`         | Display language                                         |
| `timezone`           | `string?`               | IANA timezone                                            |
| `isFriday`           | `boolean?`              | Friday override                                          |
| `size`               | `WidgetPrayerCardSize?` | Card size                                                |
| `maxWidth`           | `string?`               | Max width of grid                                        |

### `TopBar`

Header component displaying date, time, and location information.

**Props:**

| Prop            | Type                    | Description                          |
| --------------- | ----------------------- | ------------------------------------ |
| `showDate`      | `boolean?`              | Show date display (default: true)    |
| `showClock`     | `boolean?`              | Show clock (default: true)           |
| `showCity`      | `boolean?`              | Show city/location (default: true)   |
| `currentTime`   | `Date`                  | Current time to display              |
| `location`      | `Location?`             | Location object with city/country    |
| `timeFormat24h` | `boolean?`              | Use 24-hour format (default: true)   |
| `language`      | `"en" \| "ar"?`         | Display language (default: "en")     |
| `className`     | `string?`               | Additional CSS classes               |
| `classes`       | `object?`               | Fine-grained class overrides         |

### `WidgetSettingsContext`

Context provider that enables right-click settings menu on widgets. Wrap your widgets with this to allow users to customize settings via context menu.

**Props:**

| Prop                | Type                        | Description                    |
| ------------------- | --------------------------- | ------------------------------ |
| `settings`          | `ExtendedPrayerSettings`    | Current settings object        |
| `onSettingsChange`  | `(settings: Partial<...>) => void` | Callback when settings change |
| `children`          | `React.ReactNode`           | Widget components to wrap      |

### `DualDateDisplay`

Component for displaying both Gregorian and Hijri dates side by side.

**Props:**

| Prop        | Type      | Description              |
| ----------- | --------- | ------------------------ |
| `className` | `string?` | Additional CSS classes   |

### `MinimalTicker` / `ScrollingTicker`

Ticker components for displaying prayer times and rotating azkar (remembrances) in a scrolling format.

**Props (MinimalTicker):**

| Prop          | Type         | Description                          |
| ------------- | ------------ | ------------------------------------ |
| `prayerTimes` | `PrayerTimes`| Prayer times data                    |
| `intervalMs`  | `number?`    | Rotation interval in milliseconds     |
| `className`   | `string?`    | Additional CSS classes               |

**Props (ScrollingTicker):**

Similar to MinimalTicker with additional scrolling animation options.

## Types

### `PrayerTimes`

| Property  | Type     | Description              |
| --------- | -------- | ------------------------ |
| `fajr`    | `string` | Fajr prayer time         |
| `sunrise` | `string` | Sunrise time             |
| `dhuhr`   | `string` | Dhuhr prayer time        |
| `asr`     | `string` | Asr prayer time          |
| `maghrib` | `string` | Maghrib prayer time      |
| `isha`    | `string` | Isha prayer time         |
| `date`    | `string` | Date string (ISO format) |
| `hijri`   | `string` | Hijri date string        |

### `WidgetPrayerCardSize`

| Type    | Description       |
| ------- | ----------------- |
| `"xxs"` | Extra extra small |
| `"xs"`  | Extra small       |
| `"sm"`  | Small             |
| `"md"`  | Medium            |
| `"lg"`  | Large             |

## Styling

This package uses Tailwind CSS. Make sure your project has Tailwind CSS configured. The components are fully customizable via:

- `className` prop for additional styles
- `classes` prop for fine-grained styling of internal elements
- `gradientClass` prop for custom gradients
- `style` prop for inline styles

## Demo

A live demo is available at `/demo` route in this repository. The demo showcases:

- Next Prayer Card with countdown
- Prayer Grid with all 5 prayers
- TopBar with date, time, and location
- Minimal Ticker with rotating azkar
- Different widget sizes
- Right-click settings menu (via `WidgetSettingsContext`)

To run the demo locally:

```bash
git clone https://github.com/dahshury/react-prayer-widget.git
cd react-prayer-widget
bun install
bun dev
# Visit http://localhost:3000/demo
```

## Utilities

The package also exports utility functions:

- `formatCurrentTime(date: Date, format24h?: boolean): string` - Format current time
- `formatMinutesHHmm(minutes: number): string` - Format minutes as HH:mm
- `formatTimeDisplay(time: string, format24h?: boolean): string` - Format time string
- `countryToFlag(countryCode: string): string` - Get flag emoji for country code
- `useTranslation()` - Hook to access translations
- `cn(...classes)` - Utility for merging class names

## Requirements

- React 19+
- TypeScript 5+
- Tailwind CSS (for styling)

## License

MIT
