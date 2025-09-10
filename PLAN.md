### Azan Widget (Tawkit) → Next.js + React (shadcn) Migration Plan

#### Objective

Recreate the existing JavaScript Tawkit azan widget as a modern, modular Next.js + React widget
using shadcn/ui, TypeScript, Tailwind, and a clean DDD architecture. Preserve core features (times
display, countdowns, iqama rules, audio, azkar, announcements, slides, i18n, themes) while improving
maintainability, testability, performance, and UX.

### 1) Legacy Architecture Overview (No checkboxes)

| Area            | Legacy Path(s)                                                       | Role                                                                       | Notes                                                   |
| --------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------- |
| Boot/Entry      | `index.html`                                                         | Loads config, languages, data files, assets; drives UI with inline scripts | Imperative, global state via `JS_DATA` and localStorage |
| Defaults/Config | `settings-defaults.js`                                               | `JS_DATA` defaults, constants, theme palettes, timings                     | Many feature flags and UX rules                         |
| i18n            | `languages/lang-*.js`                                                | String dictionaries per language                                           | Some HTML-embedded strings                              |
| Static Times    | `data/**/wtimes-*.js`                                                | Annual per-city times (`JS_TIMES`)                                         | Huge tree; eagerly loaded currently                     |
| Custom Times    | `wcsv.js`                                                            | Daily CSV with jamaat/iqama                                                | London example; optional mode                           |
| Content         | `ayats.js`, `ahadith.js`, `messages-bottom.js`, `messages-slides.js` | Rotating content, marquee and slides                                       | Custom formats (e.g., `°°` separators)                  |
| Assets          | `audio/*`, `images/*`, `themes/*`, `font/*`, `slides/*`              | Media and fonts                                                            | To migrate to `public/`                                 |
| Styles          | `style0.css`, `style1.css`, `style2.css`                             | Global CSS for VR/HR                                                       | Complex positional CSS and IDs                          |

### 2) Target Architecture (DDD + SoC) (No checkboxes)

| Layer          | Target Package(s)          | Responsibility           | Key Types/Ports                                                                                                                                                                |
| -------------- | -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Domain         | `src/domain/**`            | Entities/VOs, pure logic | `PrayerName`, `PrayerTime`, `PrayerSchedule`, `IqamaRule`, `Settings`, `Theme`, `City`, `Country`, `GeoPoint`                                                                  |
| Application    | `src/application/**`       | Use-cases/services       | `ComputeScheduleService`, `CountdownService`, `ThemeService`, `LocalizationService`                                                                                            |
| Ports          | `src/application/ports/**` | Boundaries               | `TimesDataSource`, `SettingsRepository`, `ContentRepository`, `AudioPort`, `MeteoPort`                                                                                         |
| Infrastructure | `src/infrastructure/**`    | Adapters/IO              | `JsTimesDataSource`, `WcsvDataSource`, `AdhanCalculatorDataSource` (opt), `LocalStorageSettingsRepository`, `StaticContentRepository`, `HtmlAudioAdapter`, `FetchMeteoAdapter` |
| UI             | `src/components/azan/**`   | React (shadcn)           | `AzanWidget`, `PrayersGrid`, `NextPrayerPanel`, `IqamaBadge`, `AnnouncementsMarquee`, `SlidesCarousel`, `SettingsDrawer`, `MeteoSummary`, `AudioController`                    |

### 3) Tooling & Quality Gates (Checkboxes for actionable)

| ✔︎ | Item                     | Command(s)                    | Files                        | Notes                       |
| --- | ------------------------ | ----------------------------- | ---------------------------- | --------------------------- |
| [x] | Package manager          | `pnpm -v`                     | n/a                          | Project uses pnpm           |
| [x] | Biome (linter/formatter) | `pnpm run biome:check`        | `biome.json`, `.biomeignore` | Enforced pre-commit         |
| [x] | TypeScript noEmit        | `pnpm run typecheck`          | `tsconfig.json`              | Strict; no emit             |
| [x] | Knip (dead code)         | `pnpm run knip`               | `knip.json`                  | Ignores legacy trees        |
| [x] | Husky pre-commit         | n/a                           | `.husky/pre-commit`          | Runs Biome, tsc, Knip       |
| [ ] | mdformat (Markdown)      | `pnpm dlx mdformat --check .` | n/a                          | Enforce Markdown formatting |

Note: Ensure `pnpm install && pnpm exec husky install` after cloning.

---

### 4) Implementation Work Packages (Modular, Parallelizable)

Each row is an atomic, parallelizable task with legacy→target mapping and concrete deliverables.

#### WP-01: Initialize Next.js (App Router, Tailwind, shadcn)

| ✔︎ | ID    | Legacy Path(s)             | Target Path(s)                                                | Steps/Details                                                                                                                                | Dependencies | Parallel | Done When                             |
| --- | ----- | -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ------------------------------------- |
| [ ] | WP-01 | `index.html`, `style*.css` | `src/app/**`, `src/styles/globals.css`, `src/components/ui/*` | - `pnpm create next-app` (TS)<br>- Add Tailwind; include base styles in `globals.css`<br>- `pnpm dlx shadcn-ui init` and add core components | Tooling      | Yes      | App runs; shadcn primitives available |

#### WP-02: Domain & Application Scaffolding

| ✔︎ | ID    | Legacy                                  | Target                                | Steps/Details                                                                                                                                                                              | Dependencies | Parallel | Done When                                     |
| --- | ----- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | -------- | --------------------------------------------- |
| [ ] | WP-02 | `settings-defaults.js` (flags/policies) | `src/domain/**`, `src/application/**` | - Define `PrayerName`, `PrayerTime`, `PrayerSchedule`, `IqamaRule`, `Settings`, `Theme`<br>- Implement `ComputeScheduleService`, `CountdownService`, `ThemeService`, `LocalizationService` | WP-01        | Yes      | Unit tests green for schedule/iqama/countdown |

#### WP-03: Times Data Adapters & Converters

| ✔︎ | ID     | Legacy                             | Target                                                                                                                       | Steps/Details                                                                                                                       | Dependencies | Parallel | Done When                                 |
| --- | ------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ----------------------------------------- |
| [ ] | WP-03A | `data/**/wtimes-*.js` (`JS_TIMES`) | `public/static/times/<COUNTRY>/<CITY>.json`, `src/infrastructure/times/JsTimesDataSource.ts`, `scripts/convert-js-times.mjs` | - Converter: parse `JS_TIMES` to normalized JSON `{date,fajr,sunrise,dhuhr,asr,maghrib,isha}`<br>- Adapter: lazy load per-city JSON | WP-01        | Yes      | Selected city loads and hydrates schedule |
| [ ] | WP-03B | `wcsv.js`                          | `public/static/times/wcsv.json`, `src/infrastructure/times/WcsvDataSource.ts`, `scripts/convert-wcsv.mjs`                    | - Convert CSV to JSON incl. jamaat/iqama<br>- Adapter: resolve iqama (fixed/relative)                                               | WP-01        | Yes      | WCSV mode displays jamaat/iqama           |
| [ ] | WP-03C | (none)                             | `src/infrastructure/times/AdhanCalculatorDataSource.ts`                                                                      | - Wrap adhan-js for computed times fallback                                                                                         | WP-02        | Yes      | Calculation parity within tolerance       |

| [ ] | WP-03D | `countries.js`, `data/<CC>/<CC>.js` (city lists) | `public/static/geo/countries.json`,
`public/static/geo/<CC>/cities.json`, `src/infrastructure/geo/GeoRepository.ts` | - Convert legacy country
list and per-country city lists to JSON<br>- Implement `GeoRepository` to query countries/cities and
provide labels (AR/EN) | WP-01 | Yes | Country/city lists load lazily and feed selector |

#### WP-04: Content Repositories (Ayats, Ahadith, Messages, Slides)

| ✔︎ | ID     | Legacy                           | Target                                                           | Steps/Details                                                                                           | Dependencies | Parallel                       | Done When                    |
| --- | ------ | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------ | ---------------------------- | --- | -------------------------------- |
| [ ] | WP-04A | `ayats.js`                       | `public/static/content/ayats.json`, `StaticContentRepository`    | - Convert to JSON array; tag categories (e.g., `TAKBIR`, `10NIGHTS`)<br>- Repo filters VR-short vs full | WP-01        | Yes                            | Randomized content renders   |
| [ ] | WP-04B | `ahadith.js`                     | `public/static/content/ahadith.json`, `StaticContentRepository`  | - Convert to JSON; support weighting via duplicates                                                     | WP-01        | Yes                            | Randomized content renders   |
| [ ] | WP-04C | `messages-bottom.js`             | `public/static/content/messages.json`, `StaticContentRepository` | - Parse `a                                                                                              | b            | c°°`→`{enabled,schedule,text}` | WP-01                        | Yes | Marquee shows scheduled messages |
| [ ] | WP-04D | `messages-slides.js`, `slides/*` | `public/static/content/slides.json`, `public/slides/*`           | - Text/image slides; durations from settings                                                            | WP-01        | Yes                            | Carousel cycles per settings |

| [ ] | WP-04E | `azkar/azkar.js`, `azkar/azkar-sabah.js`, `azkar/azkar-masaa.js`, `azkar/*.jpg`, `azkar/*.bmp`
| `public/static/content/azkar/*.json`, `public/azkar/*` (images), `StaticContentRepository` | - Convert
azkar files to structured JSON (sections, lines, timings)<br>- Migrate azkar images (hr0.jpg, hr1.jpg,
hr2.jpg, vr0.jpg, vr1.jpg, azkar5min-hr.jpg, azkar5min-vr.jpg, azkar5min-hr.bmp)<br>- Expose filtered
sets (after-prayer, sabah, masaa) | WP-01 | Yes | Azkar display lists render per settings with proper
images |

#### WP-05: i18n Migration

| ✔︎ | ID    | Legacy                | Target                                              | Steps/Details                                                                                               | Dependencies | Parallel | Done When                             |
| --- | ----- | --------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------ | -------- | ------------------------------------- |
| [ ] | WP-05 | `languages/lang-*.js` | `public/static/i18n/<lang>.json`, `src/lib/i18n.ts` | - Convert dictionaries to JSON<br>- Implement `useI18n()` provider<br>- Arabic digits toggle in `format.ts` | WP-01        | Yes      | EN/AR selectable; digits toggle works |

#### WP-06: Settings & Persistence

| ✔︎ | ID    | Legacy                                      | Target                                                 | Steps/Details                                                                                                 | Dependencies | Parallel | Done When                            |
| --- | ----- | ------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ------------------------------------ |
| [ ] | WP-06 | `settings-defaults.js` + localStorage merge | `LocalStorageSettingsRepository`, `SettingsDrawer.tsx` | - Map `JS_DATA` → typed `Settings`<br>- Repo with schema versioning & migration<br>- shadcn-based Settings UI | WP-01, WP-02 | Yes      | Settings persist and apply on reload |

#### WP-07: Theming

| ✔︎ | ID    | Legacy                                         | Target                         | Steps/Details                                                   | Dependencies | Parallel | Done When                   |
| --- | ----- | ---------------------------------------------- | ------------------------------ | --------------------------------------------------------------- | ------------ | -------- | --------------------------- |
| [ ] | WP-07 | `JS_THEMES_VERTICALS`, `JS_THEMES_HORIZONTALS` | `next-themes`, Tailwind tokens | - Map palettes → CSS variables<br>- Apply per prayer/day/random | WP-06        | Yes      | Theme switching meets rules |

#### WP-08: Core UI (Vertical first)

| ✔︎ | ID     | Legacy                           | Target                                                       | Steps/Details                                                        | Dependencies                      | Parallel | Done When                        |
| --- | ------ | -------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------- | -------- | -------------------------------- |
| [ ] | WP-08A | VR blocks in `index.html`        | `AzanWidget`, `PrayersGrid`, `NextPrayerPanel`, `IqamaBadge` | - Compose widget; highlight next prayer; show iqama (fixed/relative) | WP-02, WP-03, WP-05, WP-06, WP-07 | No       | VR parity achieved               |
| [ ] | WP-08B | Audio in `index.html`, `audio/*` | `AudioController`, `HtmlAudioAdapter`                        | - Wire azan/fajr/short/iqama; last-minute alerts                     | WP-08A                            | No       | Audio triggers correctly         |
| [ ] | WP-08C | Marquee in `index.html`          | `AnnouncementsMarquee`                                       | - Autoscroll; schedule by day/date/jomoa                             | WP-04C                            | Yes      | Messages rotate; pause on hover  |
| [ ] | WP-08D | Slides                           | `SlidesCarousel`                                             | - Text/image slides; durations from settings                         | WP-04D                            | Yes      | Slides cycle and can be disabled |

| [ ] | WP-08E | City/Location Selector | `src/components/azan/LocationSelector.tsx` | - Selector using
`GeoRepository` to choose country/city and persist choice<br>- Triggers data source reload; integrates
with widget header | WP-03D, WP-06 | Yes | User can pick country/city and widget updates times |

#### WP-10: Styling & Tokens Migration

| ✔︎                                                             | ID     | Legacy                                   | Target                                         | Steps/Details                                                              | Dependencies | Parallel | Done When |
| --------------------------------------------------------------- | ------ | ---------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- | ------------ | -------- | --------- |
| [ ]                                                             | WP-10  | `style0.css`, `style1.css`, `style2.css` | Tailwind theme tokens, component-scoped styles | - Extract relevant color/spacing/typography to Tailwind theme and CSS vars |
| - Rebuild layouts with responsive flex/grid in React components | WP-08A | Yes                                      | No reliance on legacy CSS files                |

#### WP-11: Admin Directory Handling

| ✔︎ | ID    | Legacy                     | Target                         | Steps/Details                                                                                                                                                                | Dependencies | Parallel | Done When                                  |
| --- | ----- | -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ------------------------------------------ |
| [ ] | WP-11 | `admin/` (empty directory) | `docs/legacy/admin/` or remove | - Verify admin directory is empty in tawkit-9.61/<br>- Archive empty directory with note or remove entirely<br>- Document admin functionality was likely external or removed | None         | Yes      | Admin directory handled with documentation |

#### WP-12: Legacy Artifacts Archival (Completeness)

| ✔︎ | ID    | Legacy                                                                                                             | Target           | Steps/Details                                                                                                    | Dependencies | Parallel | Done When                                              |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------- | ------------ | -------- | ------------------------------------------------------ |
| [ ] | WP-12 | Misc legacy files: `**/*.md`, `**/*.ps1`, `**/*.cmd`, `**/*.yaml`, `**/*.yml`, `**/*.exe`, any non-migrated assets | `docs/legacy/**` | - Move or copy non-runtime artifacts to `docs/legacy/` with brief index listing their purpose and original paths | None         | Yes      | No orphan files remain; index lists all archived items |

#### WP-09: Optional HR Mode & Meteo

| ✔︎ | ID     | Legacy                    | Target                              | Steps/Details                          | Dependencies | Parallel | Done When                   |
| --- | ------ | ------------------------- | ----------------------------------- | -------------------------------------- | ------------ | -------- | --------------------------- |
| [ ] | WP-09A | HR blocks in `index.html` | HR variant components               | - Extend UI with HR layout variant     | WP-08A       | Yes      | HR parity acceptable        |
| [ ] | WP-09B | Weather icons/values      | `MeteoSummary`, `FetchMeteoAdapter` | - Simple fetch (lat/lon from settings) | WP-06        | Yes      | Forecasts show when enabled |

---

### 5) Parallelization Matrix (No checkboxes)

| Work Package | Can Run In Parallel With                               |
| ------------ | ------------------------------------------------------ |
| WP-01        | Tooling only                                           |
| WP-02        | WP-03, WP-04, WP-05, WP-06                             |
| WP-03A/B/C   | WP-02, WP-04, WP-05, WP-06                             |
| WP-04A/B/C/D | WP-02, WP-03, WP-05, WP-06                             |
| WP-05        | WP-02, WP-03, WP-04, WP-06                             |
| WP-06        | WP-02, WP-03, WP-04, WP-05                             |
| WP-07        | After WP-06                                            |
| WP-08A       | After WP-02, one of WP-03 (A/B/C), WP-05, WP-06, WP-07 |
| WP-08B/C/D   | After respective dependencies (see tables)             |
| WP-09A/B     | After WP-08A / WP-06 respectively                      |
| WP-10        | WP-08A in progress or after                            |
| WP-11        | WP-06                                                  |
| WP-12        | Any time                                               |

---

### 6) File Mapping Reference (Legacy → Target) (No checkboxes)

| Legacy Path                                         | Target Path                                                      | Notes                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| `index.html`                                        | `src/app/page.tsx`, `src/components/azan/**`                     | Decompose into React components                           |
| `settings-defaults.js`                              | `src/domain/core/Settings.ts`, `LocalStorageSettingsRepository`  | Typed model + persistence                                 |
| `languages/lang-*.js`                               | `public/static/i18n/<lang>.json`, `src/lib/i18n.ts`              | JSON + provider                                           |
| `data/**/wtimes-*.js`                               | `public/static/times/<COUNTRY>/<CITY>.json`, `JsTimesDataSource` | On-demand fetch                                           |
| `wcsv.js`                                           | `public/static/times/wcsv.json`, `WcsvDataSource`                | Includes iqama/jumua fields                               |
| `ayats.js`, `ahadith.js`                            | `public/static/content/*.json`, `StaticContentRepository`        | Structured content                                        |
| `messages-bottom.js`, `messages-slides.js`          | `public/static/content/*.json`, components                       | Normalized data                                           |
| `azkar/azkar*.js`                                   | `public/static/content/azkar/*.json`                             | Structured azkar collections                              |
| `azkar/*.jpg`, `azkar/*.bmp`                        | `public/azkar/*`                                                 | Azkar images (hr0-2.jpg, vr0-1.jpg, azkar5min-\*.jpg/bmp) |
| `countries.js`, `data/<CC>/<CC>.js`                 | `public/static/geo/*`, `GeoRepository`                           | Countries and cities for selector                         |
| `data/**/wtimes-*.js` (4000+ files)                 | `public/static/times/<COUNTRY>/<CITY>.json`                      | Prayer times per city (lazy-loaded)                       |
| `audio/*` (8 files: azan, fajr, iqama, alerts)      | `public/audio/*`                                                 | Audio files served statically                             |
| `images/*` (12 files + meteo subdir)                | `public/images/*`                                                | UI images, backgrounds, weather icons                     |
| `images/meteo/*` (9 PNG + 1 license)                | `public/images/meteo/*`                                          | Weather condition icons                                   |
| `themes/*` (80 files: HR-0 to HR-39, VR-0 to VR-39) | `public/themes/*`                                                | Background theme images                                   |
| `font/*` (19 woff2 files)                           | `public/font/*`                                                  | Arabic/multilingual fonts                                 |
| `slides/*` (4 files: demo, hr, other, vr JPGs)      | `public/slides/*`                                                | Default slide images                                      |
| `languages/lang-*.js` (19 files)                    | `public/static/i18n/<lang>.json`                                 | Localization dictionaries                                 |
| `favicon.ico`                                       | `public/favicon.ico`                                             | Favicon                                                   |
| `logo.png`, `ps.png`                                | `public/logo.png`, `public/ps.png`                               | Logos/icons                                               |
| `License-06-2025.txt`                               | `LICENSE` or `docs/licenses/`                                    | Preserve licensing notice                                 |
| `961news.txt`                                       | `docs/legacy/961news.txt`                                        | Archive as release notes                                  |
| `admin/` (empty directory)                          | `docs/legacy/admin/` or remove                                   | Empty admin directory                                     |
| `tsconfig.json` (legacy)                            | superseded by Next.js `tsconfig.json`                            | Not migrated; use new config                              |
| `node_modules/` (legacy)                            | n/a                                                              | Ignored                                                   |

---

### 7) Complete Coverage Summary (No checkboxes)

**Total Files Scanned in tawkit-9.61/**: ~4,200+ files

- **Core Application**: 8 files (index.html, settings-defaults.js, wcsv.js, ayats.js, ahadith.js,
  messages-\*.js)
- **Prayer Times Data**: ~4,000+ files (data/\*_/wtimes-_.js across 37 countries)
- **Geographic Data**: 38 files (countries.js + data/<CC>/<CC>.js city lists)
- **Localization**: 19 files (languages/lang-\*.js)
- **Content & Azkar**: 6 files (azkar/\*.js + azkar images)
- **Assets**: 120+ files (audio: 8, images: 12+meteo, themes: 80, fonts: 19, slides: 4)
- **Static Files**: 4 files (favicon.ico, logo.png, ps.png, License-06-2025.txt, 961news.txt)
- **Config/Build**: 2 files (tsconfig.json, node_modules/ - ignored)
- **Empty Directories**: 1 (admin/ - empty)

**Migration Coverage**: ✅ 100% - All files and directories accounted for in work packages WP-01
through WP-12.

### 8) Notes & Decisions (No checkboxes)

- Start with vertical layout (VR), then extend to horizontal (HR) once domain and services
  stabilize.
- Prefer calculated times (adhan-js) as a safe default; if an exact city file exists, allow user to
  select it (parity with current app).
- Keep localStorage persistence for settings; allow import/export of settings JSON.
- Avoid bundling the entire `data/` tree; generate and load only needed city JSON.

### 9) Acceptance Criteria (V1) (No checkboxes)

- Display of six prayers with names, times, iqama indicators, next-prayer highlighting.
- Countdown to azan and iqama with configurable cues and audio.
- Language toggle (at least AR/EN) and Arabic digits option.
- Theme switching per rules (manual / per prayer / per day / random list).
- Announcements and basic slides.
- All settings persist across reloads.

### 10) How to Run Checks (No checkboxes)

| Task       | Command                                 |
| ---------- | --------------------------------------- |
| Biome      | `pnpm run biome:check`                  |
| TypeScript | `pnpm run typecheck`                    |
| Knip       | `pnpm run knip`                         |
| mdformat   | `pnpm dlx mdformat --check .`           |
| Pre-commit | Triggered automatically on `git commit` |
