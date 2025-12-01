# TypeScript Type Checking and Error Resolution Workflow

## Objective

Fix all TypeScript type errors in this monorepo (Python backend + TypeScript/React frontend) systematically and recursively until the codebase achieves zero type errors.

## Project Context

- **Monorepo Structure**: Backend (Python/FastAPI) + Frontend (Next.js with TypeScript)
- **Frontend Location**: `app/frontend/` (TypeScript/React components and services)
- **TypeScript Config**: `app/frontend/tsconfig.json` and root `tsconfig.json`
- **Linting Tool**: Biome (configured in `biome.json`)
- **Code Quality Standards**: Strict type safety, accessibility, clean code principles (following Uncle Bob, Martin Fowler, Eric Evans patterns)
- **Package Manager**: bun (monorepo workspace)
- **🚨 Type Checking Command**: **ONLY use `bun typecheck`** - NEVER use `bun tsgo --noEmit`, `tsc`, or any other TypeScript checking command

## Pre-Execution Checklist

Before starting the workflow:

1. Verify you understand the project structure and constraints
2. Review the workspace rules in the project context for TypeScript best practices
3. Note that this is a strict type-safety codebase - avoid `any` types at all costs
4. Familiarize yourself with the domain entities: conversation, event, phone, rsvp, user, vacation
5. Check existing patterns in similar files before making changes

## Execution Workflow

### Phase 1: Initial Error Discovery and Documentation

1. **🚨 CRITICAL: Execute ONLY `bun typecheck`** from the project root directory
   - **ONLY use `bun typecheck`** - this is the single source of truth for type checking
2. Capture ALL error output completely
3. Count total errors and categorize by type (missing imports, type mismatches, unused variables, etc.)
4. **Create error documentation file**: Write all errors to `docs/ts-errors.md` in the docs directory as a minimal numbered bullet point list
   - Each bullet point should contain: file path, line number, and error message
   - Format: `1. [filepath:line] error message`
   - Example: `1. [app/frontend/components/Button.tsx:42] Property 'onClick' is missing in type 'ButtonProps'`
   - Include nothing else in this file - only the numbered error list
5. Do NOT attempt fixes yet - only gather information and document
6. **🚫 CRITICAL: After creating `docs/ts-errors.md`, DO NOT run `bun typecheck` again until Phase 4**
   - The markdown file becomes the single source of truth for all errors
   - All fixes in Phase 3 must be based on the errors documented in `docs/ts-errors.md`
   - Re-running the command will only happen in Phase 4 after all documented errors are addressed
   - This prevents redundant command executions and ensures fixes are based on the documented error list

### Phase 2: Create Structured Todo List

1. **Read the error documentation file** (`docs/ts-errors.md`) created in Phase 1 to understand all errors
2. **Use the Cursor built-in todo list** (NOT an .md file)
3. Create todos using the `todo_write` tool with these guidelines:
   - **One todo per error category** initially (e.g., "Fix missing imports in services", "Resolve type mismatches in components")
   - **Break down large categories** into specific file-based todos if the category has 5+ errors
   - **Prioritize by dependency**: Fix foundational errors first (domain models, services, types) before components
   - **Include file paths** in todo titles for clarity
   - Set initial status: `pending` for all
4. Order todos strategically:
   - First: Core types and domain models (`app/services/domain/`, `app/frontend/entities/`)
   - Second: Services and utilities (`app/services/`, `app/frontend/services/`)
   - Third: Components and features (`app/frontend/features/`, `app/frontend/widgets/`)
   - Fourth: Pages and public-facing code (`app/frontend/app/`)

### Phase 3: Iterative Error Resolution

**For each todo in order:**

1. **Read the Error Details**

   - Reference the `docs/ts-errors.md` file for the complete error list
   - Identify specific files, line numbers, and error messages
   - Understand the root cause (missing type, incorrect import, unused declaration, etc.)
   - Check if the error is in a dependency or the main code

2. **Analyze Before Fixing**

   - Examine the file context and related code
   - Check how similar issues are resolved elsewhere in the codebase
   - Ensure your fix aligns with project patterns and TypeScript strictness

3. **Apply the Fix**

   - Make minimal, focused changes
   - Prefer proper typing over `any` or type assertions (`as`)
   - For imports: use `import type` for type-only imports
   - For unused items: remove them unless they're exported API
   - Follow Biome formatting and linting rules automatically
   - Ensure accessibility standards are maintained in components
   - **Fix ALL errors in the current todo batch** based on the `docs/ts-errors.md` file

4. **Verify the Fix (Work from Documentation)**

   - **🚫 DO NOT run `bun typecheck` here** - work from the `docs/ts-errors.md` file instead
   - Mark errors as resolved in your todos based on the fixes you've applied
   - Update the todo status to `in_progress`, then `completed` when you've fixed all errors in that batch
   - The final verification will happen in Phase 4, not during Phase 3

5. **Document Learnings**
   - If a fix reveals a pattern or reusable solution, note it internally
   - If similar errors appear elsewhere, apply the same fix proactively before running the next check

### Phase 4: Recursive Validation Loop

**After completing all todos:**

1. **🚨 FIRST TIME RUNNING COMMAND SINCE PHASE 1**: Now run `bun typecheck` from the project root directory to verify all documented errors are fixed
   - **🚨 CRITICAL: Use ONLY `bun typecheck` - DO NOT use `bun tsgo --noEmit`, `tsgo`, or any other command**
2. **If errors remain**:
   - Update `docs/ts-errors.md` with the remaining errors (replace the file content with the new error list)
   - Create new todos for the remaining errors
   - Repeat Phase 3 until all errors are gone (working from the updated `docs/ts-errors.md` file)
   - This may involve cascading fixes (fixing one error reveals another)
   - **🚫 DO NOT run `bun typecheck` again** until you've fixed all errors in the updated `docs/ts-errors.md` file
3. **If zero errors**:
   - Success! All TypeScript type errors are resolved.
   - Optionally delete `docs/ts-errors.md` (or keep it for reference)
   - Run: `bun biome check` to ensure linting compliance
   - If biome finds issues, fix them and rerun `bun typecheck` to confirm no regressions

## Critical Optimization Principle

**🚨 CRITICAL: Use ONLY `bun typecheck` for type checking - NEVER use `bun tsgo --noEmit`, `tsgo`, or any other TypeScript checking command**

**Run `bun typecheck` ONLY in Phase 1 and Phase 4:**

- ✅ **Phase 1**: Run `bun typecheck` once to discover all errors and create `docs/ts-errors.md`
- ❌ **Phase 3**: DO NOT run `bun typecheck` - work from `docs/ts-errors.md` file instead
- ✅ **Phase 4**: Run `bun typecheck` only after completing all todos to verify fixes
- ❌ Do NOT run `bun typecheck` after every single fix
- ❌ Do NOT run `bun typecheck` between related changes
- ✅ Minimize total command executions to save time and resources
- 🚫 **NEVER use `bun tsgo --noEmit`, `tsgo --noEmit`, or any other type checking command**

This approach ensures efficiency while maintaining accuracy. The `docs/ts-errors.md` file is the single source of truth during Phase 3, eliminating the need for repeated command executions.

## Best Practices During Execution

### Type Safety

- ❌ **Never use `any`** - use `unknown` with type narrowing or proper generics
- ❌ **Never use non-null assertions (`!`)** - fix the underlying type issue
- ✅ **Use `import type`** for type-only imports
- ✅ **Use `as const`** for literal types
- ✅ **Use generics** for reusable, type-safe functions

### Code Quality

- Prefer removing unused code over leaving it with suppressions
- Keep changes minimal and focused
- Maintain existing code style and patterns
- Fix only what's necessary; don't refactor unrelated code

### Component-Specific Rules

- Ensure all props are properly typed
- Make sure React hooks dependencies are complete
- Validate accessibility attributes (no `aria-hidden` on focusable elements, proper `alt` text, etc.)
- Use semantic HTML elements; avoid `role` attributes when semantic alternatives exist

### Import/Export Patterns

- Centralize type definitions in domain entities (`app/frontend/entities/`)
- Use barrel exports (index.ts) for logical modules
- Avoid circular dependencies
- Keep service layer imports separate from UI layer

## Error Categories and Common Solutions

| Category                 | Solution Strategy                                                |
| ------------------------ | ---------------------------------------------------------------- |
| Missing type definitions | Check if type exists in `app/frontend/entities/` or create it    |
| Unused imports           | Remove the import unless it's a public API                       |
| Type mismatches          | Understand expected vs. actual type; adjust or convert           |
| Missing properties       | Add to interface/type or make them optional (`?`) if appropriate |
| Import path errors       | Verify correct path; use absolute imports if configured          |
| Implicit `any`           | Add explicit type annotation or let TS infer from context        |
| Circular dependencies    | Restructure imports or create separate type file                 |

## Success Criteria

✅ `bun typecheck` runs with zero errors (ONLY use `bun typecheck` - never use `bun tsgo --noEmit`, `tsgo`, or other commands)\
✅ `bun biome check` passes all checks\
✅ No type suppressions (`@ts-ignore`, `@ts-expect-error`) added unnecessarily\
✅ Code follows the workspace's clean code and accessibility standards\
✅ All changes are tracked and logical

## Communication During Execution

- Report error counts and categories at each phase
- Highlight blocking issues that require human judgment
- Summarize completed todos and remaining work
- Flag any patterns that suggest systemic issues to address

---

**Ready to begin? Execute this workflow methodically, one step at a time.**
