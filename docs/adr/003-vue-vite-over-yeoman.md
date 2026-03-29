# ADR-003: Vue 3 + Vite Over Yeoman Office Template

## Status

Accepted

## Context

Microsoft's official Yeoman generator for Office Add-ins (`generator-office`) scaffolds a project with React or Angular, Webpack, and a pre-configured manifest. While convenient for getting started, the Yeoman template bundles opinionated tooling choices, uses Webpack (slower builds), and does not support Vue. Quill's frontend team has strong Vue 3 expertise, and Vite offers significantly faster HMR and build times. VitePress is also needed for the documentation site, making Vite a natural shared foundation.

## Decision

We scaffold the frontend manually using Vue 3 with the Composition API, Vite as the bundler, and TypeScript throughout. We do not use the Yeoman Office generator. Office.js is loaded via the CDN script tag in `taskpane.html` and typed via `@types/office-js`. VitePress serves the project documentation site from the same repository.

## Consequences

- Full control over the build pipeline, dependencies, and project structure.
- Faster development feedback loops via Vite's HMR compared to Webpack.
- No automatic scaffold updates from Microsoft's generator; we must track Office.js API changes manually.
- Vue 3 + TypeScript provides type-safe components with Composition API composables for Office.js interactions.
- VitePress documentation integrates naturally into the same build pipeline.
