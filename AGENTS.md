<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 1. Context & Tech Stack
- **Project Goal:** A 2D top-down grid-based web game (`Maze-Racer`) using HTML5 Canvas for rendering.
- **Framework & Runtime:** Next.js 16 (App Router conventions), React 19, and Strict TypeScript.
- **Data Layer:** GraphQL API orchestrated via Apollo Client and Apollo Server (`@as-integrations/next`).
- **Animation & Physics Layer:** Canvas interpolation and state transitions must utilize `gsap` or `velocity-animate` instead of raw CSS transitions where applicable.

## 2. Compilation, Linting, & Asset Constraints
- **Google Fonts Pipeline:** Next.js 16 optimizes fonts automatically. You must use `next/font/google` to import and load Google Fonts. Never use raw HTML `<link>` or CSS `@import` tags.
- **Type Safety & Linting:** Code must adhere to strict TypeScript typings. Avoid using `any`. Code must strictly pass the modern ESLint 9 configuration.
- **Pre-commit Hooks:** This project uses `husky`. All generated or modified code must pass linting and unit testing criteria before a commit is finalized.

## 3. Tooling, Testing & Execution Strings
Always execute these exact scripts inside your shell environment to validate changes:
- **Development Server:** `npm run dev`
- **Strict Build & Font Optimization Compilation:** `npm run build`
- **Lint Check:** `npm run lint`
- **Auto-Fix Lint Errors:** `npm run lint:fix`
- **Interactive Unit Tests:** `npm run test`
- **Single-Run Test Validation:** `npm run test:run`
- **Code Coverage Audit:** `npm run test:coverage`

## 4. Agent Safety Boundaries
- **No Test Degradation:** When creating or modifying game loops (`eventemitter2` events, canvas ticks), you must write or update corresponding unit tests using `vitest`.
- **No Token Overkill:** When updating GraphQL schemas or resolver contexts, do not reprint unaffected React components or UI layout code. Only print the absolute structural delta required.
- **No Placeholders:** Never use partial functions or temporary `// TODO` markers in files.