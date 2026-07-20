# AGENTS.md

This file stores project-level Agent context. `ai-work-team` maintains only the marked block below; keep manual project notes outside the markers.

<!-- ai-work-team:buildContext:start -->
## AI Work Team Build Context

> Managed by `/team buildContext` and static repository inspection. This context accelerates later `/team build`, `/team design`, and `/team bugfix`, but does not replace reading the target code before editing.

### Update Scope

- Workdir: `/Users/bytedance/webxiang/work/comfyui-lumi-batcher`
- Request: build reusable project context for faster and more accurate technical feature updates.
- Generated on: 2026-07-20
- Scan evidence: `scripts/build-context.js --json` scanned 458 files.
- Repository shape: Python ComfyUI custom node plugin at root plus standalone React frontend under `frontend/`.
- Existing `AGENTS.md`: none before this run.
- Monorepo: no root workspace config; treat `frontend/` as an embedded standalone package.

### Agent Role Index

- `delivery-manager`: keep workflow state, decisions, risks, handoff, evidence, and delivery summary under `workspace/20260720-build-context/`.
- `tech-lead`: own architecture boundaries across ComfyUI plugin bootstrap, Python handlers/controllers/DAO/threading, frontend injection, and verification strategy.
- `frontend-engineer`: own `frontend/` React implementation, API client contracts, Zustand stores, Rsbuild output, static assets, and ComfyUI browser integration.
- `backend-engineer`: own `lumi_batcher_service/` Python routes, controllers, SQLite DAO and SQL files, task hooks, workspace file handling, and ComfyUI server integration.
- `ui-designer`: own Arco/Babeta theme usage, SCSS/CSS Modules consistency, i18n text coverage, empty/error/loading states, and result-table usability.
- `qa-engineer`: own frontend lint/build, Python syntax checks, ComfyUI runtime smoke checks, route contract regression, and manual verification where runtime dependencies are unavailable.

### Project Identity

- Package name: `comfyui-lumi-batcher`
- Product: ComfyUI Lumi Batcher, a ComfyUI extension for batch parameter generation, task management, result preview, and batch export.
- Python metadata: `pyproject.toml` declares Python package metadata and dependencies.
- Python runtime expectation: README says Python 3.10+.
- Frontend package: `frontend/package.json` with private package name `frontend`.
- Package manager: `pnpm` for `frontend/`; no root `package.json` or root lockfile.
- License headers: source files use GPL-3.0-or-later copyright headers.

### Technology Matrix

| Area | Location | Stack | Key Files | Notes |
| --- | --- | --- | --- | --- |
| ComfyUI plugin bootstrap | root | Python custom node plugin | `__init__.py`, `prestartup_script.py` | Registers Python module, handlers, hooks, and `WEB_DIRECTORY = "./frontend-setup"`. |
| Backend service | `lumi_batcher_service/` | Python, `aiohttp`, ComfyUI `server.PromptServer`, SQLite | `handler/`, `controller/`, `dao/`, `sql/`, `thread/` | Routes use prefix `/api/comfyui-lumi-batcher`; DAO reads SQL from files. |
| Frontend app | `frontend/` | React 18, TypeScript, Rsbuild | `frontend/src/`, `frontend/common/`, `frontend/api/`, `frontend/rsbuild.config.ts` | Built assets are loaded by ComfyUI through `frontend-setup/setup.js`. |
| UI and styling | `frontend/` | Arco Design, Babeta theme, Sass, Less, CSS Modules | `frontend/common/styles/`, `*.scss`, `*.module.scss` | Prefer existing Arco components, theme variables, and local style patterns. |
| State and data | `frontend/src`, `frontend/common` | Zustand, Axios, local helpers | `frontend/src/*/store/`, `frontend/common/zustand/`, `frontend/api/` | Some stores use raw `zustand`; shared enhanced creator exists in `frontend/common/zustand`. |
| Result processing | Python + frontend | output node processing, media handlers, table preview, download | `lumi_batcher_service/controller/output/`, `frontend/src/result-view/`, `frontend/api/result.ts`, `frontend/api/download.ts` | Covers image, video, audio, text, and result packaging/download paths. |

### Runtime Integration

- `__init__.py` calls `check_and_register_module()`, creates `BatchToolsHandler` and `CommonHandler`, recovers packages, registers task start/done hooks, and exports empty ComfyUI node mappings.
- `frontend-setup/setup.js` registers a ComfyUI extension named `waitBatchToolsApp`, fetches `frontend/dist/index.html` through `/api/comfyui-lumi-batcher/get-static-file`, dynamically loads JS/CSS, then calls `window._ba_main()` when available.
- `frontend/src/index.tsx` imports Arco CSS, Babeta theme, global styles, registers the batch tools button, and registers service worker `/api/comfyui-lumi-batcher/sw.js`.
- Rsbuild output uses `assetPrefix` pointing at `/api/comfyui-lumi-batcher/get-static-file?path=./custom_nodes/comfyui-lumi-batcher/frontend/dist`.

### Backend Route Surface

All custom backend routes use prefix `/api/comfyui-lumi-batcher`.

- Task lifecycle: `POST /batch-task/create`, `GET /batch-task/list`, `GET /batch-task/detail`, `POST /batch-task/update-name`, `POST /batch-task/cancel`, `POST /batch-task/delete`.
- Result and download: `GET /download-batch-task-result`, `GET /batch-task/result`, `GET /view-image`.
- File and static serving: `POST /resolve-file`, `POST /upload-file`, `GET /get-static-file`, `GET /sw.js`.
- Workflow validation: `POST /workflow-validate`.
- Frontend clients live in `frontend/api/*.ts`; keep request/response contracts aligned with Python handlers before changing either side.

### Backend Directory Rules

- Put route registration in `lumi_batcher_service/handler/` and keep route prefix consistent.
- Put workflow/task/resource/output transformations in `lumi_batcher_service/controller/`.
- Put persistence logic in `lumi_batcher_service/dao/`; SQL statements belong in `lumi_batcher_service/sql/<domain>/`.
- Keep shared filesystem, workspace, validation, JSON, and client helpers in `lumi_batcher_service/common/`.
- Keep task status constants in `lumi_batcher_service/constant/`; update frontend enums/contracts when backend statuses change.
- Threaded work uses `lumi_batcher_service/thread/`; review concurrency, timeout, and shutdown behavior before adding long-running work.
- File deletion, upload, and static serving changes must respect path allowlists and avoid writing outside intended ComfyUI/input/workspace directories.

### Frontend Directory Rules

- `frontend/src/` contains feature modules: `batch-tools`, `create-task`, `task-list`, `result-view`, `result-download`, `params-config`, `tools-tabs`, `home`, and integration helpers.
- `frontend/common/` contains reusable components, constants, errors, hooks, i18n, styles, types, utilities, and the enhanced Zustand wrapper.
- `frontend/api/` is the typed backend client layer; add API calls here instead of scattering raw endpoint strings across components.
- `frontend/typings/` contains ComfyUI, LiteGraph, global, CSS, SVG, and API type declarations.
- `frontend/static/` stores icons and images used by the frontend.
- TypeScript path aliases are defined in `frontend/tsconfig.json`: `@common/*`, `@src/*`, `@api/*`, `@typings/*`, `@utils/*`, `@static/*`.

### UI And State Conventions

- Prefer Arco Design components and `@arco-design/theme-babeta` before introducing new UI systems.
- Global styles enter through `frontend/common/styles/index.scss`; feature styles are usually colocated `index.scss` or `index.module.scss`.
- CSS Modules use camel-case class exports through Rsbuild `cssModules.exportLocalsConvention = "camelCaseOnly"` and typed CSS modules plugin.
- Keep user-facing text behind existing i18n utilities where surrounding code uses `I18n.t`, `languageUtils`, and `TranslateKeys`.
- Use existing Zustand store patterns in the feature being modified. For new shared stores, consider `frontend/common/zustand` only when its reset/action middleware is useful.
- Cover loading, empty, error, disabled, long-text, and permission-sensitive states for task creation, result preview, downloads, uploads, and delete/cancel actions.

### Verification Commands

- Context scanner: `node /Users/bytedance/.trae-cn/skills/ai-work-team/scripts/build-context.js . --request "<request>" --json`
- Frontend install: run `pnpm install` in `frontend/` when dependencies are absent.
- Frontend lint: run `pnpm lint` in `frontend/`.
- Frontend build: run `pnpm build` in `frontend/`.
- Python syntax check: prefer Python 3.10+ and run `python3 -m compileall __init__.py prestartup_script.py lumi_batcher_service`.
- Runtime smoke test: in a ComfyUI environment, install this repo as a custom node, restart ComfyUI, open the batch tool button, create/list/cancel/delete a small task, validate workflow, preview results, and download output.
- Automated tests: no root test suite or frontend test script detected; add focused tests before high-risk logic changes where feasible.

### Existing Knowledge Entrypoints

- `.trae/knowledges/batch-task-lifecycle/`: navigate here for task creation, queue execution, cancel, and delete work.
- `.trae/knowledges/result-processing/`: navigate here for output node resolution, media output handlers, result packaging, and download work.
- These knowledge files currently provide mostly navigation metadata; still read source code directly for implementation decisions.

### Known Constraints And Risks

- The local default `python3` detected during this run is 3.9.6, below the README requirement of Python 3.10+.
- The build-context scanner does not aggregate `frontend/package.json` because the root has no workspace config; keep this manual frontend context until the scanner supports embedded packages.
- `frontend/node_modules` was absent during this run, so frontend lint/build require dependency installation first.
- ComfyUI-specific imports such as `server`, `execution`, and `folder_paths` require the ComfyUI runtime; static checks cannot fully validate route registration or runtime hooks.
- File operations and downloads can touch local user files; validate path normalization, allowlists, and error handling before changing upload/delete/static-file behavior.

### Later `/team build` Constraints

- Start from this file, then read the exact feature module and adjacent API/backend code before editing.
- Keep frontend and backend contracts in sync; update TS types and Python response structures together.
- Keep changes scoped to the relevant feature slice and avoid unrelated UI refreshes or backend refactors.
- If a change touches task status, result payloads, resource maps, packaging, or cancellation, inspect both DAO SQL and frontend table/result rendering.
- If a change touches frontend assets or build output, verify Rsbuild asset prefix and ComfyUI dynamic injection behavior.
- If verification cannot run locally because ComfyUI or dependencies are missing, record the skipped command, impact, and manual runtime check plan.
<!-- ai-work-team:buildContext:end -->
