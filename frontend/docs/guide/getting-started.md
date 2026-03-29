# Getting Started

## Prerequisites

- Node.js 20+
- A Microsoft 365 account (for Outlook integration)
- SSL certificates in `ssl/` directory for local HTTPS development

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server with HTTPS on port 4200:

```bash
npm run dev
```

The add-in task pane will be available at `https://localhost:4200`.

## Sideloading

To test in Outlook, sideload the add-in manifest. See the Microsoft documentation for sideloading instructions specific to your platform (Windows, macOS, or OWA).

## Project Structure

The frontend is a Vue 3 + TypeScript application built with Vite. Key directories:

- `src/composables/` - Reusable composition functions (Office.js, chat, auth)
- `src/views/` - Tab-level view components
- `src/components/` - Feature-specific UI components
- `src/stores/` - Pinia state management stores
