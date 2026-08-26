# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CMS for logging and reviewing customer-service quality "gestiones" (case reviews) — used by a QA analyst team to score agent interactions. React 18 + Vite, Firebase (Auth + Firestore) as the only backend, Material UI for components.

## Commands

```
pnpm install     # install deps (pnpm required, see packageManager field)
pnpm dev         # start Vite dev server on port 3000 (opens browser automatically)
pnpm build       # production build, outputs to ./build (not dist)
pnpm preview     # preview the production build
pnpm test        # vitest — NOTE: no test files exist in the repo yet and there's no vitest config
```

No lint script is wired into package.json; run eslint directly if needed: `pnpm exec eslint .` (flat config in `eslint.config.js`).

Requires a `.env` with Firebase web config (see `.env.example`): `VITE_APP_APIKEY`, `VITE_APP_AUTHDOMAIN`, `VITE_APP_PROJECTID`, `VITE_APP_STORAGEBUCKET`, `VITE_APP_MESSAGINGSENDERID`, `VITE_APP_APPID`.

## Architecture

### Firestore data model — single-document arrays, not collections of documents

This is the most important thing to understand before touching data logic. Firestore is used almost like a JSON blob store rather than a normal document-per-record collection:

- **All cases** live in one document: `cases-list/NeCtxuFq7KGvryxgmBpn`, in a `cases` array field. Reads (`useGetCases`, `useGetCaseDetail` in `src/customHooks/indexHooks.js`) fetch that *entire document* and filter/find client-side in JS — there are no Firestore queries (`where`, etc.) anywhere. Writes append via `updateDoc(docRef, { cases: arrayUnion(newCase) })` (see `src/pages/NewCase/NewCase.jsx`).
- **Agents for case entry** live in one document: `agentsList/JUYcFTPxnTi8vQwCMoJC` (`useGetAgents`), keyed by employee id (legajo).
- **Cells** (`agentsList/RojI95r5bfYpye8puHdq`) and **criteria/questions** (`criteria/tNvqGoA6vlN7EgaUYH7T`, holding `habilities` and `perception`) are loaded once in `BasicDataContext` and used to render the scoring form's dynamic fields.

Practical implications: any new "case" field must be added to the object shape used across `NewCase.jsx`, `CaseList.jsx`, `CaseDetail.jsx`, `EmployeeId.jsx`; there's no schema enforcement. Filtering/sorting/pagination (e.g. `CaseList.jsx` slices to the first 20 after sorting by `timestamp`) all happens in-memory on the full array — this won't scale past a certain document size (Firestore's 1MB doc limit), which is a real constraint to flag if the case list grows large.

### Auth and route protection

- `AuthProvider` (`src/context/authContext.jsx`) wraps the app and mirrors Firebase `onAuthStateChanged` into `user` state (`undefined` = loading, `null`/falsy = logged out). It renders nothing until the initial auth check resolves.
- `BasicDataProvider` (`src/context/basicDataContext.jsx`) depends on `AuthContext` — it only fetches cells/criteria once a `user` exists, and both providers are nested in `src/index.jsx` (`AuthProvider > BasicDataProvider > BrowserRouter > App`).
- There is **no route-guard component/HOC**. Every protected page (`NewCase`, `NewAgent`, etc.) does its own `if (!user) return <Navigate to='/login' state={{ from: '/path' }} />` check at the top of the component, and `Login.jsx` reads `state.from` to redirect back after sign-in. Follow this same pattern for new protected pages rather than introducing a wrapper, unless asked to refactor it.
- `Header.jsx` has its own separate `isProtected` flag per nav item (`PAGES` array) purely for showing/hiding links — this is UI-only and independent from the actual page-level guard, so a protected route must be guarded in the page itself even if it's hidden from the nav.

### Session persistence

Login (`src/pages/Login/Login.jsx`) explicitly calls `setPersistence(auth, browserSessionPersistence)` before signing in — sessions do not survive browser restarts by design.

### Structure conventions

- `src/pages/<Name>/<Name>.jsx` + a co-located `<name>.css` (lowercase) imported globally from `src/index.jsx`, not per-component — all page/component CSS is bundled up front rather than scoped/module-based.
- `src/customHooks/indexHooks.js` is a single barrel file for all Firestore data-fetching hooks (not one file per hook).
- `src/utils/constants.js` holds domain vocabulary (contact origins, perception options, star-rating labels, the 5 fixed scoring questions) — check here before hardcoding strings related to case scoring.
- Dates are handled with **both** `moment` (date pickers, formatting in write paths) and `dayjs` (a dependency but check usage before adding new moment usage — moment is in maintenance mode).
- `million/compiler` runs on `react()` in `vite.config.js` with `auto: true`, auto-optimizing components at build time — be aware of this when debugging unexpected render behavior.
