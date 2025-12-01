# FSD Refactoring Plan: App Layer & API Routes

## User Objectives

- **Primary Goal**: Align codebase with Feature-Sliced Design (FSD) architecture as defined in `@frontend_structure.mdc`
- **Specific Requirements**:
  - Move API route handlers to `app/api-routes/` and re-export from `app/api/`
  - Extract business logic from API routes to appropriate FSD layers (entities/features)
  - Move main page component to `pages/` layer
  - Organize services according to FSD structure
  - Maintain all existing functionality and behavior
- **Behavioral Changes**: Preserve all existing behavior - no functional changes, only structural reorganization

## Current State Analysis

### Files Analyzed

1. **`app/api/locations/cities/route.ts`** (55 lines)

   - Issues: Business logic (parsing) mixed with route handler, should be in `app/api-routes/`
   - Current behavior: Parses city data from JS files, returns JSON response

2. **`app/api/wtimes/route.ts`** (356 lines)

   - Issues: Large file with mixed concerns (file I/O, parsing, DST calculation, time shifting), business logic should be extracted
   - Current behavior: Finds prayer times files, parses times, applies offsets and DST adjustments

3. **`app/page.tsx`** (122 lines)

   - Issues: Page component in `app/` instead of `pages/` layer
   - Current behavior: Main prayer times page orchestrating components and hooks

4. **`app/layout.tsx`** (27 lines)

   - Issues: Metadata needs updating, otherwise correct for Next.js App Router
   - Current behavior: Root layout with fonts and analytics

5. **`app/globals.css`** (158 lines)

   - Issues: Correct location, but could reference FSD structure
   - Current behavior: Global styles and theme variables

6. **Services Structure**

   - `services/prayer/` and `services/location/` exist but should align with FSD
   - Services should be in `entities/{entity}/api/` or `shared/api/` segments

7. **`features/prayer/`** (Current structure)

   - Issues: Uses `components/` instead of `ui/`, `hooks/` not categorized by segment
   - Current structure: `components/`, `hooks/`, `constants.ts`
   - Should be: `ui/`, `model/`, `config/` segments
   - Current behavior: Prayer times feature with components, hooks, and constants

8. **`features/navigation/`** (Current structure)

   - Issues: Component directly in feature root instead of `ui/` segment
   - Current structure: `top-bar.tsx` in root
   - Should be: `ui/top-bar.tsx`
   - Current behavior: Top navigation bar component

9. **`features/settings/`** (Current structure)

   - Issues: Uses `components/` and `tabs/` instead of `ui/`, `hooks/` not categorized by segment
   - Current structure: `components/`, `tabs/`, `hooks/`, `constants.ts`, `types.ts`
   - Should be: `ui/` (with `tabs/` subdirectory), `model/`, `config/` segments
   - Current behavior: Settings management feature with dialog, tabs, and persistence hooks

10. **`lib/`** (Backward compatibility wrapper)

- Issues: Root-level directory that re-exports from `shared/libs/` - violates FSD structure
- Current structure: `lib/index.ts`, `lib/utils.ts` (re-exports only)
- Should be: Removed - all imports should use `@/shared/libs/...` directly
- Current behavior: Backward compatibility re-exports for utilities
- Files affected: ~31 files importing from `@/lib`

11. **`hooks/`** (Backward compatibility wrapper)

- Issues: Root-level directory that re-exports from features/shared - violates FSD structure
- Current structure: `hooks/index.ts` (re-exports only)
- Should be: Removed - all imports should use feature/shared public APIs directly
- Current behavior: Backward compatibility re-exports for hooks
- Files affected: 0 files (no current imports found)

12. **`shared/libs/`** (Current structure)

- Issues: Minor naming - FSD typically uses `shared/lib/` but `shared/libs/` is acceptable if established
- Current structure: Well-organized with subdirectories (prayer, time, geo, hooks, utils, file-upload, react, timezone)
- Should be: Keep current structure (already FSD-compliant) or optionally rename to `shared/lib/` for strict FSD
- Current behavior: Shared utilities, hooks, and helpers properly organized by domain
- Note: Structure is already correct - utilities in subdirectories with proper public APIs

13. **`shared/libs/prayer/`** (Current structure)

- Issues: None - already correctly organized in `shared/libs/`
- Current structure: Well-organized with subdirectories:
  - `azan.ts` - Azan audio source management utilities
  - `azkar.ts` - Azkar (remembrance) content arrays
  - `islamic-content.ts` - Islamic content types and data (hadiths, ayahs)
  - `prayer.constants.ts` - Prayer-related constants (timezone coordinates, default settings)
  - `prayer.utils.ts` - Prayer utility functions (time adjustments, progress calculation)
  - `calculation/` - Prayer calculation utilities (offset application, next prayer logic)
  - `index.ts` - Public API exports
- Should be: Keep current structure (already FSD-compliant)
- Current behavior: Shared prayer-related utilities and constants
- Files using: ~11 files importing from `@/shared/libs/prayer`
- Note: Structure is correct - domain-specific utilities properly organized with public API

14. **`shared/libs/hooks/`** (Current structure)

- Issues: None - already correctly organized in `shared/libs/`
- Current structure: Well-organized reusable React hooks:
  - `use-controlled-state.tsx` - Controlled/uncontrolled state management
  - `use-current-time.ts` - Real-time clock updates
  - `use-is-in-view.tsx` - Intersection observer for viewport detection
  - `use-timezone-sync.ts` - Timezone synchronization with system
  - `use-translation.tsx` - Translation context and hook
  - `index.ts` - Public API exports
- Should be: Keep current structure (already FSD-compliant)
- Current behavior: Shared reusable React hooks
- Files using: ~12 files importing from `@/shared/libs/hooks`
- Note: Structure is correct - reusable hooks properly organized with public API

15. **`shared/libs/time/`** (Current structure)

- Issues: None - already correctly organized in `shared/libs/`
- Current structure: Well-organized time formatting utilities:
  - `format.ts` - Time formatting functions:
    - `formatTimeDisplay()` - Format 24h time to 12h with AM/PM
    - `formatMinutesHHmm()` - Convert minutes to HH:MM format
    - `sanitizeTimeString()` - Sanitize and validate time strings
    - `formatCurrentTime()` - Format current date/time with locale support
    - `getGmtOffsetLabel()` - Get GMT offset label for timezone
  - `index.ts` - Public API exports
- Should be: Keep current structure (already FSD-compliant)
- Current behavior: Shared time formatting and manipulation utilities
- Files using: Multiple files importing from `@/shared/libs/time` (via `@/lib` backward compatibility)
- Note: Structure is correct - time utilities properly organized with public API

16. **`shared/libs/react/`** (Current structure)

- Issues: None - already correctly organized in `shared/libs/`
- Current structure: Well-organized React-specific utilities:
  - `get-strict-context.tsx` - Type-safe React context factory with runtime validation
  - `index.ts` - Public API exports
- Should be: Keep current structure (already FSD-compliant)
- Current behavior: Shared React utility functions
- Files using: Files importing from `@/shared/libs/react`
- Note: Structure is correct - React utilities properly organized with public API

17. **`shared/libs/utils/`** (Current structure)

- Issues: None - already correctly organized in `shared/libs/`
- Current structure: Well-organized general utility functions:
  - `cn.ts` - Tailwind CSS class name utility (clsx + tailwind-merge)
  - `file-utils.ts` - File size formatting utilities (`formatBytes()`)
  - `layout.utils.ts` - Layout utilities (`getResponsiveWidthClass()`)
  - `time.utils.ts` - Time checking utilities (`isPast()`)
  - `index.ts` - Public API exports
- Should be: Keep current structure (already FSD-compliant)
- Current behavior: Shared general utility functions
- Files using: Multiple files importing from `@/shared/libs/utils` (via `@/lib` backward compatibility)
- Note: Structure is correct - general utilities properly organized with public API

18. **`shared/libs/timezone/`** (Current structure)

- Issues: None - already correctly organized in `shared/libs/`
- Current structure: Well-organized timezone utilities:
  - `timezones.ts` - Timezone data and utilities:
    - `TIMEZONES` - Array of timezone options with labels
    - `countryNameToCode()` - Convert country name to ISO code
    - `countryCodeToFlagEmoji()` - Convert country code to flag emoji
    - `getCountryByTimezone()` - Get country from timezone
    - `getTimezoneFlag()` - Get flag emoji for timezone
    - `getLocationFromTimezone()` - Get location label from timezone
    - `getLocationFromTimezoneLocalized()` - Get localized location label
    - `getTimezoneLabelByLang()` - Get timezone label by language
    - `guessTimezoneFromCountryCode()` - Guess timezone from country code
    - `getCountryPrimaryTimezone()` - Get primary timezone for country
    - `getCountryUtcOffsetLabel()` - Get UTC offset label for country
    - `getCountryCodeFromTimezone()` - Get country code from timezone
  - `index.ts` - Public API exports
- Should be: Keep current structure (already FSD-compliant)
- Current behavior: Shared timezone data and utility functions
- Files using: Files importing from `@/shared/libs/timezone`
- Note: Structure is correct - timezone utilities properly organized with public API

19. **`shared/ui/`** (Current structure)

- Issues: Components using `@/lib/utils` instead of `@/shared/libs/utils/cn` - needs import path updates
- Current structure: Well-organized UI components (Shadcn UI-based):
  - `alert.tsx` - Alert component with variants
  - `button.tsx` - Button component with variants and sizes
  - `calendar.tsx` - Calendar component with date picker
  - `card.tsx` - Card component with header/content/footer
  - `command.tsx` - Command palette component
  - `context-menu.tsx` - Context menu component
  - `country-dropdown.tsx` - Country selection dropdown
  - `dialog.tsx` - Dialog/modal component
  - `file-uploader.tsx` - File upload component
  - `input.tsx` - Input field component
  - `label.tsx` - Label component
  - `popover.tsx` - Popover component
  - `region-dropdown.tsx` - Region/city selection dropdown
  - `select.tsx` - Select dropdown component
  - `skeleton.tsx` - Skeleton loading component
  - `slider.tsx` - Slider component
  - `switch.tsx` - Switch/toggle component
  - `animate/` - Animated UI components:
    - `components/animate/` - Animated component wrappers:
      - `counter.tsx` - Animated counter component (uses `@/lib/utils` - needs update)
      - `tabs.tsx` - Animated tabs component (uses `@/lib/utils` - needs update)
    - `components/radix/` - Radix-based animated components:
      - `tabs.tsx` - Radix tabs with animations (uses `@/lib/utils` - needs update)
    - `primitives/` - Low-level animation primitives:
      - `animate/` - Animation primitives (counter, slot, tabs)
      - `effects/` - Effect primitives (highlight, highlight-item - uses `@/lib/utils` - needs update)
      - `radix/` - Radix primitives
      - `texts/` - Text animation primitives
  - `kokonutui/` - KokonutUI component library:
    - `file-upload.tsx` - File upload component (uses `@/lib/utils` - needs update)
    - `liquid-glass-card.tsx` - Glass morphism card component (uses `@/lib/utils` - needs update)
    - `toolbar.tsx` - Toolbar component (uses `@/lib/utils` - needs update)
  - `shadcn-io/` - Shadcn.io component library:
    - `color-picker/` - Color picker component:
      - `index.tsx` - Color picker with HSL controls (uses `@/lib/utils` - needs update)
  - And other UI components...
- Should be: Keep current structure (already FSD-compliant location), update imports
- Current behavior: Shared reusable UI components
- Files affected: ~34 files importing from `@/lib/utils` need to be updated to `@/shared/libs/utils/cn` (including animate, kokonutui, shadcn-io subdirectories)
- Note: Structure is correct - UI components properly organized in `shared/ui/` per FSD. Only import paths need updating (Phase 7)

20. **`widgets/`** (Current structure)

- Issues: One file using `@/lib/utils` instead of `@/shared/libs/utils/cn` - needs import path update
- Current structure: Well-organized widget components (FSD-compliant):
  - `dates/` - Date display widgets:
    - `dual-date-display.tsx` - Dual date display (Gregorian + Hijri)
    - `index.ts` - Public API
  - `file-upload/` - File upload widget:
    - `file-upload.tsx` - Main widget component (re-exports from shared/ui)
    - `components/` - Widget sub-components:
      - `dropzone-content.tsx` - Dropzone UI (uses `@/lib/utils` - needs update)
      - `error-message.tsx` - Error display component
      - `upload-illustration.tsx` - Upload illustration SVG
      - `uploading-animation.tsx` - Upload progress animation
      - `uploading-content.tsx` - Upload progress UI
      - `index.ts` - Public API
    - `hooks/` - Widget-specific UI behavior hooks:
      - `use-file-upload-handlers.ts` - Drag/drop and file selection handlers (UI behavior)
      - `use-file-upload-state.ts` - File upload state management (UI behavior)
      - `use-file-validation.ts` - File validation utilities (could be lib/ segment)
      - `use-upload-simulation.ts` - Upload progress simulation (UI behavior)
      - `index.ts` - Public API
    - `index.ts` - Public API
  - `prayer-card/` - Prayer card widgets:
    - `next-prayer-card.tsx` - Next prayer card component
    - `prayer-card.tsx` - Base prayer card component with variants
    - `prayer-card-skeleton.tsx` - Prayer card skeleton loader
    - `index.ts` - Public API
  - `prayer-grid/` - Prayer grid widget:
    - `prayer-grid.tsx` - Grid layout for all prayer cards
    - `index.ts` - Public API
  - `ticker/` - Ticker widgets:
    - `minimal-ticker.tsx` - Minimal ticker component (rotating Islamic content)
    - `scrolling-ticker.tsx` - Scrolling ticker component with settings dialog
    - `index.ts` - Public API
  - `index.ts` - Main widgets public API (re-exports all widgets)
- Should be: Keep current structure (already FSD-compliant), update imports
- Current behavior: Composite UI widgets combining multiple components
- Files affected: 1 file (`widgets/file-upload/components/dropzone-content.tsx`) importing from `@/lib/utils` needs to be updated to `@/shared/libs/utils/cn`
- Note: Structure is correct - widgets properly organized per FSD. Only import paths need updating (Phase 6 & 7)

21. **`types/`** (Current structure)

- Issues: None - type definitions are correctly placed
- Current structure: Type definition files:
  - `country-region-data.d.ts` - Type definitions for country-region-data library
  - `settings.ts` - Settings type definitions
- Should be: Keep current structure (correct location for global types)
- Current behavior: Global type definitions and module augmentations
- Note: Structure is correct - types directory is appropriate for global type definitions

## Proposed Changes

**Refactoring Approach:**

- **Goal-aligned strategy**: Reorganize code to follow FSD layer hierarchy (app → pages → widgets → features → entities → shared)
- **Scope**: Structural reorganization only - all business logic preserved exactly as-is
- **Behavioral impact**: No behavioral changes - all functionality remains identical

**Refactoring Constraints:**

- **Move as-is when possible**: Extract code blocks verbatim when they fit architecture structure
- **Architectural adaptations allowed**: When architecture requires structural changes, wrap/adapt code while preserving all business logic
- **Logic preservation**: Preserve all conditionals, calculations, data transformations, error handling, and business rules exactly
- **Update imports**: Change import paths to use public APIs and maintain correct dependency flow

---

## Phase 1: API Routes Refactoring

### 1.1 Cities API Route

| Step | Description                | Source Lines | Target Location                         | Dependencies | Change Type               |
| ---- | -------------------------- | ------------ | --------------------------------------- | ------------ | ------------------------- |
| 1    | Extract city parsing logic | 5-36         | `entities/location/lib/parse-cities.ts` | None         | Move as-is                |
| 2    | Extract city types         | -            | `entities/location/model/location.ts`   | None         | Create types              |
| 3    | Create API route handler   | 38-54        | `app/api-routes/locations/cities.ts`    | parse-cities | Move as-is, adapt imports |
| 4    | Re-export route handler    | -            | `app/api/locations/cities/route.ts`     | api-routes   | Re-export only            |

### 1.2 Prayer Times API Route

| Step | Description                       | Source Lines     | Target Location                              | Dependencies                     | Change Type               |
| ---- | --------------------------------- | ---------------- | -------------------------------------------- | -------------------------------- | ------------------------- |
| 1    | Extract timezone mapping constant | 23-50            | `entities/prayer/config/timezone-mapping.ts` | None                             | Move as-is                |
| 2    | Extract DST constants             | 52-59            | `entities/prayer/config/dst-constants.ts`    | None                             | Move as-is                |
| 3    | Extract date utility functions    | 61-66            | `shared/libs/time/date-utils.ts`             | None                             | Move as-is                |
| 4    | Extract city normalization        | 68-82            | `entities/location/lib/normalize-city.ts`    | None                             | Move as-is                |
| 5    | Extract file finding helpers      | 84-140           | `entities/prayer/lib/find-wtimes-file.ts`    | normalize-city, timezone-mapping | Move as-is, adapt imports |
| 6    | Extract time parsing logic        | 196-211          | `entities/prayer/lib/parse-prayer-times.ts`  | None                             | Move as-is                |
| 7    | Extract time shifting logic       | 244-257, 300-301 | `entities/prayer/lib/shift-time.ts`          | dst-constants                    | Move as-is                |
| 8    | Extract DST calculation           | 264-298          | `entities/prayer/lib/calculate-dst.ts`       | dst-constants, date-utils        | Move as-is                |
| 9    | Extract request body type         | 5-21             | `entities/prayer/api/dto.ts`                 | None                             | Move as-is                |
| 10   | Create API route handler          | 213-355          | `app/api-routes/wtimes.ts`                   | All above                        | Move as-is, adapt imports |
| 11   | Re-export route handler           | -                | `app/api/wtimes/route.ts`                    | api-routes                       | Re-export only            |

---

## Phase 2: Page Component Refactoring

| Step | Description                 | Source Lines | Target Location                             | Dependencies         | Change Type      |
| ---- | --------------------------- | ------------ | ------------------------------------------- | -------------------- | ---------------- |
| 1    | Create page slice structure | -            | `pages/prayer-times/`                       | None                 | Create directory |
| 2    | Move page component         | 1-122        | `pages/prayer-times/ui/PrayerTimesPage.tsx` | All existing imports | Move as-is       |
| 3    | Create page public API      | -            | `pages/prayer-times/index.ts`               | ui                   | Export only      |
| 4    | Re-export from app router   | -            | `app/page.tsx`                              | pages                | Re-export only   |

---

## Phase 3: Services Refactoring

### 3.1 Prayer Service

| Step | Description                  | Source Files                        | Target Location                         | Dependencies                     | Change Type                            |
| ---- | ---------------------------- | ----------------------------------- | --------------------------------------- | -------------------------------- | -------------------------------------- |
| 1    | Create entity API segment    | -                                   | `entities/prayer/api/`                  | None                             | Create directory                       |
| 2    | Create entity config segment | -                                   | `entities/prayer/config/`               | None                             | Create directory                       |
| 3    | Move service to entity API   | `services/prayer/prayer.service.ts` | `entities/prayer/api/prayer.service.ts` | entities/prayer model            | Move as-is, update imports             |
| 4    | Move constants               | `services/prayer/constants.ts`      | `entities/prayer/config/constants.ts`   | entities/prayer model            | Move as-is                             |
| 5    | Remove types re-export       | `services/prayer/types.ts`          | -                                       | None                             | Delete (just re-exports from entities) |
| 6    | Create API public API        | -                                   | `entities/prayer/api/index.ts`          | prayer.service, config/constants | Export service and constants           |
| 7    | Update entity public API     | -                                   | `entities/prayer/index.ts`              | api, model                       | Re-export from api                     |

### 3.2 Location Service

| Step | Description                | Source Files                            | Target Location                             | Dependencies                          | Change Type                                 |
| ---- | -------------------------- | --------------------------------------- | ------------------------------------------- | ------------------------------------- | ------------------------------------------- |
| 1    | Create entity structure    | -                                       | `entities/location/`                        | None                                  | Create directory structure                  |
| 2    | Create entity API segment  | -                                       | `entities/location/api/`                    | None                                  | Create directory                            |
| 3    | Move service to entity API | `services/location/location.service.ts` | `entities/location/api/location.service.ts` | entities/prayer model (Location type) | Move as-is, update imports                  |
| 4    | Remove types re-export     | `services/location/types.ts`            | -                                           | None                                  | Delete (just re-exports from entities)      |
| 5    | Create API public API      | -                                       | `entities/location/api/index.ts`            | location.service                      | Export only                                 |
| 6    | Create entity model        | -                                       | `entities/location/model/location.ts`       | entities/prayer                       | Re-export Location type (or move if needed) |
| 7    | Create entity public API   | -                                       | `entities/location/index.ts`                | api, model                            | Export only                                 |

### 3.3 Remove Services Backward Compatibility

| Step | Description                 | Source Files                                            | Target Location                                         | Dependencies          | Change Type                           |
| ---- | --------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | --------------------- | ------------------------------------- |
| 1    | Update service imports      | `features/prayer/api/use-load-prayer-times.ts`          | `features/prayer/api/use-load-prayer-times.ts`          | entities/prayer/api   | Update PrayerService import           |
| 2    | Update service imports      | `features/prayer/api/use-load-prayer-times.ts`          | `features/prayer/api/use-load-prayer-times.ts`          | entities/location/api | Update LocationService import         |
| 3    | Update service imports      | `features/settings/model/use-geolocation-permission.ts` | `features/settings/model/use-geolocation-permission.ts` | entities/location/api | Update LocationService import         |
| 4    | Update service imports      | `features/settings/model/use-location-detection.ts`     | `features/settings/model/use-location-detection.ts`     | entities/location/api | Update LocationService import         |
| 5    | Remove services index       | `services/index.ts`                                     | -                                                       | All imports updated   | Delete backward compatibility wrapper |
| 6    | Remove services directories | `services/prayer/`, `services/location/`                | -                                                       | All imports updated   | Delete directories                    |

---

## Phase 4: Layout & Styles

| Step | Description      | Source Lines | Target Location   | Dependencies | Change Type                  |
| ---- | ---------------- | ------------ | ----------------- | ------------ | ---------------------------- |
| 1    | Update metadata  | 7-11         | `app/layout.tsx`  | None         | Update content only          |
| 2    | Keep globals.css | -            | `app/globals.css` | None         | No change (correct location) |

---

## Phase 5: Features Layer Refactoring

### 5.1 Prayer Feature

**Hook Categorization Rationale:**

| Hook File                  | Current Location | Target Segment | Rationale                                                                     |
| -------------------------- | ---------------- | -------------- | ----------------------------------------------------------------------------- |
| `use-load-prayer-times.ts` | `hooks/`         | `api/`         | Fetches data from PrayerService and LocationService - API query/mutation hook |
| `use-prayer-times.ts`      | `hooks/`         | `model/`       | Orchestrates multiple hooks, manages domain state - domain-specific data hook |
| `use-prayer-progress.ts`   | `hooks/`         | `model/`       | Computes prayer progress using domain logic - domain-specific data hook       |
| `use-azan.ts`              | `hooks/`         | `model/`       | Implements azan playback business logic - domain-specific data hook           |
| `use-prayer-page-state.ts` | `hooks/`         | `ui/`          | Manages UI state (deferred updates, responsive visibility) - UI behavior hook |

**Refactoring Steps:**

| Step | Description                        | Source Lines                                         | Target Location                                | Dependencies                                         | Change Type                        |
| ---- | ---------------------------------- | ---------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| 1    | Move constants to config segment   | `features/prayer/constants.ts`                       | `features/prayer/config/constants.ts`          | None                                                 | Move as-is                         |
| 2    | Move components to ui segment      | `features/prayer/components/prayer-page-loading.tsx` | `features/prayer/ui/prayer-page-loading.tsx`   | widgets/prayer-card                                  | Move as-is                         |
| 3    | Move components to ui segment      | `features/prayer/components/ticker-section.tsx`      | `features/prayer/ui/ticker-section.tsx`        | widgets/ticker, config                               | Move as-is                         |
| 4    | Move components to ui segment      | `features/prayer/components/next-prayer-section.tsx` | `features/prayer/ui/next-prayer-section.tsx`   | All existing imports                                 | Move as-is                         |
| 5    | Move components to ui segment      | `features/prayer/components/prayer-cards-grid.tsx`   | `features/prayer/ui/prayer-cards-grid.tsx`     | All existing imports                                 | Move as-is                         |
| 6    | Move components to ui segment      | `features/prayer/components/prayer-page-header.tsx`  | `features/prayer/ui/prayer-page-header.tsx`    | All existing imports                                 | Move as-is                         |
| 7    | Update components index            | `features/prayer/components/index.ts`                | `features/prayer/ui/index.ts`                  | ui components                                        | Move as-is                         |
| 8    | Move API query hook to api segment | `features/prayer/hooks/use-load-prayer-times.ts`     | `features/prayer/api/use-load-prayer-times.ts` | entities/prayer, services (will be entities), shared | Move as-is, update service imports |
| 9    | Move domain hooks to model segment | `features/prayer/hooks/use-prayer-times.ts`          | `features/prayer/model/use-prayer-times.ts`    | api, model hooks, shared                             | Move as-is, update imports         |
| 10   | Move domain hooks to model segment | `features/prayer/hooks/use-prayer-progress.ts`       | `features/prayer/model/use-prayer-progress.ts` | entities/prayer, shared                              | Move as-is                         |
| 11   | Move domain hooks to model segment | `features/prayer/hooks/use-azan.ts`                  | `features/prayer/model/use-azan.ts`            | entities/prayer, shared                              | Move as-is                         |
| 12   | Move UI hooks to ui segment        | `features/prayer/hooks/use-prayer-page-state.ts`     | `features/prayer/ui/use-prayer-page-state.ts`  | entities/prayer, config                              | Move as-is                         |
| 13   | Create api hooks index             | -                                                    | `features/prayer/api/index.ts`                 | use-load-prayer-times                                | Export only                        |
| 14   | Create model hooks index           | -                                                    | `features/prayer/model/index.ts`               | All model hooks                                      | Export only                        |
| 15   | Update feature public API          | `features/prayer/index.ts`                           | `features/prayer/index.ts`                     | config, api, model, ui                               | Update exports                     |

### 5.2 Navigation Feature

| Step | Description               | Source Lines                      | Target Location                      | Dependencies         | Change Type      |
| ---- | ------------------------- | --------------------------------- | ------------------------------------ | -------------------- | ---------------- |
| 1    | Create ui segment         | -                                 | `features/navigation/ui/`            | None                 | Create directory |
| 2    | Move top-bar component    | `features/navigation/top-bar.tsx` | `features/navigation/ui/top-bar.tsx` | All existing imports | Move as-is       |
| 3    | Update feature public API | `features/navigation/index.ts`    | `features/navigation/index.ts`       | ui                   | Update exports   |

### 5.3 Settings Feature

**Hook Categorization Rationale:**

| Hook File                       | Current Location | Target Segment | Rationale                                                         |
| ------------------------------- | ---------------- | -------------- | ----------------------------------------------------------------- |
| `use-settings-persistence.ts`   | `hooks/`         | `model/`       | Manages localStorage persistence - domain-specific data hook      |
| `use-geolocation-permission.ts` | `hooks/`         | `model/`       | Monitors geolocation permission state - domain-specific data hook |
| `use-location-detection.ts`     | `hooks/`         | `model/`       | Detects location using services - domain-specific data hook       |
| `use-azan-player.ts`            | `hooks/`         | `model/`       | Manages azan audio playback - domain-specific data hook           |

**Refactoring Steps:**

| Step | Description                        | Source Lines                                               | Target Location                                         | Dependencies                                      | Change Type                        |
| ---- | ---------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| 1    | Move constants to config segment   | `features/settings/constants.ts`                           | `features/settings/config/constants.ts`                 | None                                              | Move as-is                         |
| 2    | Move types to model segment        | `features/settings/types.ts`                               | `features/settings/model/types.ts`                      | types/settings                                    | Move as-is                         |
| 3    | Move components to ui segment      | `features/settings/components/color-picker-group.tsx`      | `features/settings/ui/color-picker-group.tsx`           | shared/ui                                         | Move as-is                         |
| 4    | Move components to ui segment      | `features/settings/components/offset-control.tsx`          | `features/settings/ui/offset-control.tsx`               | shared/ui                                         | Move as-is                         |
| 5    | Move components to ui segment      | `features/settings/components/settings-dialog.tsx`         | `features/settings/ui/settings-dialog.tsx`              | ui/tabs, shared/ui                                | Move as-is                         |
| 6    | Move components to ui segment      | `features/settings/components/widget-settings-context.tsx` | `features/settings/ui/widget-settings-context.tsx`      | ui/settings-dialog, shared/ui                     | Move as-is                         |
| 7    | Move tabs to ui segment            | `features/settings/tabs/azan-tab.tsx`                      | `features/settings/ui/tabs/azan-tab.tsx`                | model/use-azan-player, shared                     | Move as-is, update hook import     |
| 8    | Move tabs to ui segment            | `features/settings/tabs/calculation-tab.tsx`               | `features/settings/ui/tabs/calculation-tab.tsx`         | ui/offset-control, config/constants               | Move as-is, update imports         |
| 9    | Move tabs to ui segment            | `features/settings/tabs/display-tab.tsx`                   | `features/settings/ui/tabs/display-tab.tsx`             | ui/color-picker-group, shared                     | Move as-is, update imports         |
| 10   | Move tabs to ui segment            | `features/settings/tabs/general-tab.tsx`                   | `features/settings/ui/tabs/general-tab.tsx`             | model/types, shared                               | Move as-is, update types import    |
| 11   | Move tabs to ui segment            | `features/settings/tabs/location-tab.tsx`                  | `features/settings/ui/tabs/location-tab.tsx`            | model/use-location-detection, model/types, shared | Move as-is, update imports         |
| 12   | Update tabs index                  | `features/settings/tabs/index.ts`                          | `features/settings/ui/tabs/index.ts`                    | ui/tabs components                                | Move as-is                         |
| 13   | Update components index            | `features/settings/components/index.ts`                    | `features/settings/ui/index.ts`                         | ui components                                     | Move as-is                         |
| 14   | Move domain hooks to model segment | `features/settings/hooks/use-settings-persistence.ts`      | `features/settings/model/use-settings-persistence.ts`   | entities/prayer, shared                           | Move as-is                         |
| 15   | Move domain hooks to model segment | `features/settings/hooks/use-geolocation-permission.ts`    | `features/settings/model/use-geolocation-permission.ts` | entities/prayer, services (will be entities)      | Move as-is, update service imports |
| 16   | Move domain hooks to model segment | `features/settings/hooks/use-location-detection.ts`        | `features/settings/model/use-location-detection.ts`     | services (will be entities), shared, model/types  | Move as-is, update service imports |
| 17   | Move domain hooks to model segment | `features/settings/hooks/use-azan-player.ts`               | `features/settings/model/use-azan-player.ts`            | shared, types/settings                            | Move as-is                         |
| 18   | Create model hooks index           | -                                                          | `features/settings/model/index.ts`                      | All model hooks, model/types                      | Export only                        |
| 19   | Update feature public API          | `features/settings/index.ts`                               | `features/settings/index.ts`                            | config, model, ui                                 | Update exports                     |

---

## Phase 6: Remove Backward Compatibility Wrappers

### 6.1 Update lib/ Imports

| Step | Description                | Source Files                   | Target Import Path                                                                 | Dependencies        | Change Type         |
| ---- | -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- | ------------------- | ------------------- |
| 1    | Update @/lib/utils imports | All files using `@/lib/utils`  | `@/shared/libs/utils/cn`, `@/shared/libs/geo/country`, `@/shared/libs/time/format` | shared/libs         | Update import paths |
| 2    | Update @/lib imports       | All files using `@/lib`        | `@/shared/libs/...` (specific paths)                                               | shared/libs         | Update import paths |
| 3    | Remove lib directory       | `lib/index.ts`, `lib/utils.ts` | -                                                                                  | All imports updated | Delete files        |

### 6.2 Remove hooks/ Directory

| Step | Description            | Source Files     | Target Location | Dependencies        | Change Type                     |
| ---- | ---------------------- | ---------------- | --------------- | ------------------- | ------------------------------- |
| 1    | Verify no imports      | All files        | -               | None                | Check for any `@/hooks` imports |
| 2    | Remove hooks directory | `hooks/index.ts` | -               | Verified no imports | Delete file                     |

---

## Phase 7: Update All Imports

| Step | Description                         | Source Lines                                                              | Target Location                                           | Dependencies                              | Change Type                                              |
| ---- | ----------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| 1    | Update prayer service imports       | `features/prayer/api/use-load-prayer-times.ts`                            | `features/prayer/api/use-load-prayer-times.ts`            | entities/prayer/api                       | Update PrayerService import path                         |
| 2    | Update location service imports     | `features/prayer/api/use-load-prayer-times.ts`                            | `features/prayer/api/use-load-prayer-times.ts`            | entities/location/api                     | Update LocationService import path                       |
| 3    | Update location service imports     | `features/settings/model/use-geolocation-permission.ts`                   | `features/settings/model/use-geolocation-permission.ts`   | entities/location/api                     | Update LocationService import path                       |
| 4    | Update location service imports     | `features/settings/model/use-location-detection.ts`                       | `features/settings/model/use-location-detection.ts`       | entities/location/api                     | Update LocationService import path                       |
| 5    | Verify no remaining service imports | All files                                                                 | -                                                         | None                                      | Check for any remaining `@/services` imports             |
| 4    | Update prayer feature imports       | All files using `features/prayer/components`                              | Various                                                   | features/prayer/ui                        | Update import paths                                      |
| 5    | Update prayer feature imports       | All files using `features/prayer/hooks/use-load-prayer-times`             | Various                                                   | features/prayer/api                       | Update import paths                                      |
| 6    | Update prayer feature imports       | All files using `features/prayer/hooks/use-prayer-times`                  | Various                                                   | features/prayer/model                     | Update import paths                                      |
| 7    | Update prayer feature imports       | All files using `features/prayer/hooks/use-prayer-progress`               | Various                                                   | features/prayer/model                     | Update import paths                                      |
| 8    | Update prayer feature imports       | All files using `features/prayer/hooks/use-azan`                          | Various                                                   | features/prayer/model                     | Update import paths                                      |
| 9    | Update prayer feature imports       | All files using `features/prayer/hooks/use-prayer-page-state`             | Various                                                   | features/prayer/ui                        | Update import paths                                      |
| 10   | Update prayer feature imports       | All files using `features/prayer/constants`                               | Various                                                   | features/prayer/config                    | Update import paths                                      |
| 11   | Update prayer feature hook imports  | `features/prayer/model/use-prayer-times.ts`                               | `features/prayer/model/use-prayer-times.ts`               | api, model                                | Update relative imports                                  |
| 12   | Update navigation feature imports   | All files using `features/navigation/top-bar`                             | Various                                                   | features/navigation                       | Update import paths (should use public API)              |
| 13   | Update settings feature imports     | All files using `features/settings/components`                            | Various                                                   | features/settings/ui                      | Update import paths                                      |
| 14   | Update settings tabs imports        | `features/settings/ui/tabs/azan-tab.tsx`                                  | `features/settings/ui/tabs/azan-tab.tsx`                  | model/use-azan-player                     | Update hook import path                                  |
| 15   | Update settings tabs imports        | `features/settings/ui/tabs/calculation-tab.tsx`                           | `features/settings/ui/tabs/calculation-tab.tsx`           | ui/offset-control, config/constants       | Update component and constants imports                   |
| 16   | Update shared/ui animate imports    | `shared/ui/animate/components/animate/counter.tsx`                        | `shared/ui/animate/components/animate/counter.tsx`        | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 17   | Update shared/ui animate imports    | `shared/ui/animate/components/animate/tabs.tsx`                           | `shared/ui/animate/components/animate/tabs.tsx`           | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 18   | Update shared/ui animate imports    | `shared/ui/animate/components/radix/tabs.tsx`                             | `shared/ui/animate/components/radix/tabs.tsx`             | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 19   | Update shared/ui animate imports    | `shared/ui/animate/primitives/effects/highlight-item.tsx`                 | `shared/ui/animate/primitives/effects/highlight-item.tsx` | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 20   | Update shared/ui animate imports    | `shared/ui/animate/primitives/effects/highlight.tsx`                      | `shared/ui/animate/primitives/effects/highlight.tsx`      | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 21   | Update shared/ui animate imports    | `shared/ui/animate/primitives/animate/slot.tsx`                           | `shared/ui/animate/primitives/animate/slot.tsx`           | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 22   | Update shared/ui kokonutui imports  | `shared/ui/kokonutui/file-upload.tsx`                                     | `shared/ui/kokonutui/file-upload.tsx`                     | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 23   | Update shared/ui kokonutui imports  | `shared/ui/kokonutui/toolbar.tsx`                                         | `shared/ui/kokonutui/toolbar.tsx`                         | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 24   | Update shared/ui kokonutui imports  | `shared/ui/kokonutui/liquid-glass-card.tsx`                               | `shared/ui/kokonutui/liquid-glass-card.tsx`               | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 25   | Update shared/ui shadcn-io imports  | `shared/ui/shadcn-io/color-picker/index.tsx`                              | `shared/ui/shadcn-io/color-picker/index.tsx`              | shared/libs/utils/cn                      | Update `@/lib/utils` to `@/shared/libs/utils/cn`         |
| 16   | Update settings tabs imports        | `features/settings/ui/tabs/display-tab.tsx`                               | `features/settings/ui/tabs/display-tab.tsx`               | ui/color-picker-group                     | Update component import                                  |
| 17   | Update settings tabs imports        | `features/settings/ui/tabs/general-tab.tsx`                               | `features/settings/ui/tabs/general-tab.tsx`               | model/types                               | Update types import                                      |
| 18   | Update settings tabs imports        | `features/settings/ui/tabs/location-tab.tsx`                              | `features/settings/ui/tabs/location-tab.tsx`              | model/use-location-detection, model/types | Update hook and types imports                            |
| 19   | Update settings dialog imports      | `features/settings/ui/settings-dialog.tsx`                                | `features/settings/ui/settings-dialog.tsx`                | ui/tabs                                   | Update tabs import path                                  |
| 20   | Update settings feature imports     | All files using `features/settings/tabs`                                  | Various                                                   | features/settings/ui/tabs                 | Update import paths                                      |
| 21   | Update settings feature imports     | All files using `features/settings/hooks`                                 | Various                                                   | features/settings/model                   | Update import paths                                      |
| 22   | Update settings feature imports     | All files using `features/settings/constants`                             | Various                                                   | features/settings/config                  | Update import paths                                      |
| 23   | Update settings feature imports     | All files using `features/settings/types`                                 | Various                                                   | features/settings/model/types             | Update import paths                                      |
| 24   | Update features index imports       | `features/index.ts`                                                       | `features/index.ts`                                       | All feature public APIs                   | Update exports (prayer hooks, settings components/hooks) |
| 25   | Update lib imports in shared/ui     | All files in `shared/ui/` using `@/lib`                                   | Various                                                   | shared/libs                               | Update to direct shared/libs imports                     |
| 26   | Update lib imports in widgets       | `widgets/file-upload/components/dropzone-content.tsx` using `@/lib/utils` | `widgets/file-upload/components/dropzone-content.tsx`     | shared/libs/utils/cn                      | Update `@/lib/utils` → `@/shared/libs/utils/cn`          |
| 27   | Update lib imports in features      | All files in `features/` using `@/lib`                                    | Various                                                   | shared/libs                               | Update to direct shared/libs imports                     |
| 28   | Verify all imports                  | -                                                                         | All files                                                 | All above                                 | Check for broken imports                                 |

---

## Expected Outcomes

- **Goal metrics**:
  - Files organized: ~45-50 files created/moved
  - Files updated: ~31 files with import path updates (lib/ removal)
  - Directories removed: 2 backward compatibility wrappers (`lib/`, `hooks/`)
  - API routes properly separated: 2 route handlers in `app/api-routes/`
  - Business logic extracted: ~10 utility functions in entities/shared
  - Services relocated: 2 services moved to entities layer
  - Page component moved: 1 page moved to pages layer
  - Features reorganized: 3 features restructured with proper segments (ui, model, api, config)
  - Hooks categorized: 9 hooks moved to appropriate segments (1 api, 7 model, 1 ui)
  - Components reorganized: 14 components moved from `components/`/`tabs/` to `ui/` segment
- **Code organization**:
  - Clear separation of concerns across FSD layers
  - Business logic in entities, route handlers in app/api-routes
  - Features properly segmented (ui, model, config, api)
  - Hooks categorized by purpose (domain logic in model, UI state in ui)
  - Proper public API exports via index.ts files
- **Architectural compliance**:
  - All code follows FSD layer hierarchy
  - Import boundaries respected (no upward dependencies)
  - Public APIs properly exposed
- **Behavioral validation**:
  - All API endpoints work identically
  - Page renders and functions the same
  - No breaking changes to existing functionality

---

## Verification Steps

- [ ] TypeScript compiles without errors
- [ ] All API routes respond correctly (`/api/locations/cities`, `/api/wtimes`)
- [ ] Main page renders and functions identically
- [ ] All imports use public APIs (no deep imports)
- [ ] Import boundaries respected (no cross-feature, no upward dependencies)
- [ ] No circular dependencies
- [ ] All services accessible via entity public APIs
- [ ] Linter passes (`bunx biome check .`)
- [ ] No runtime errors in browser console
- [ ] Prayer times calculation works correctly
- [ ] Location detection works correctly

---

## Implementation Notes

1. **API Routes**: Next.js App Router requires routes in `app/api/`, but FSD recommends business logic in `app/api-routes/`. Solution: Keep thin route handlers in `app/api/` that re-export from `app/api-routes/`.

2. **Services**: Current `services/` directory should be migrated to `entities/{entity}/api/` segments to align with FSD structure.

3. **Page Component**: The main page is currently a client component in `app/page.tsx`. It should be moved to `pages/prayer-times/` and re-exported from `app/page.tsx` to maintain Next.js routing.

4. **Constants & Types**: All constants and types should be organized in appropriate segments (`config/`, `model/`, `api/`) within entities.

5. **Features Segments**: Features must use proper segments (`ui/`, `model/`, `api/`, `config/`, `lib/`) instead of generic `components/` and `hooks/` directories.

6. **Hooks Categorization** (per FSD rules):

   - **API query/mutation hooks** → `api/` segment (e.g., `use-load-prayer-times.ts` - fetches data from services)
   - **Domain-specific data hooks** → `model/` segment (e.g., `use-prayer-times.ts`, `use-prayer-progress.ts`, `use-azan.ts` - business logic)
   - **UI behavior hooks** → `ui/` segment or same file as component (e.g., `use-prayer-page-state.ts` - UI state management)
   - **Reusable utility hooks** → `shared/lib/hooks/`

7. **Backward Compatibility Removal**: Root-level `lib/` and `hooks/` directories are backward compatibility wrappers that violate FSD structure. They must be removed and all imports updated to use direct paths:

   - `@/lib` → `@/shared/libs/...` (specific paths)
   - `@/hooks` → Feature/shared public APIs (no current usage found)

8. **Shared Layer Structure**: The `shared/libs/` directory is already well-organized and FSD-compliant:

   - Utilities organized by domain (prayer, time, geo, etc.)
   - Proper public API exports via index.ts files
   - Hooks in `shared/libs/hooks/` (correct per FSD rules)
   - Minor note: FSD typically uses `shared/lib/` (singular) but `shared/libs/` (plural) is acceptable if established
   - No changes needed unless renaming for strict FSD compliance

9. **Import Updates**: All files importing from old locations must be updated to use new public API paths.

---

## Next Steps

After completing this refactoring plan:

1. Review and verify all changes
2. Test all functionality
3. Update any remaining files that reference old paths
4. Consider additional refactoring for other parts of the codebase
5. Document the new structure for team reference
