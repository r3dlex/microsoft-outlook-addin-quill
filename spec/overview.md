# Quill Overview

Codename: **Quill**
Version: 2.0.0-draft

## Purpose

Quill is a Microsoft Outlook Add-in that integrates multiple LLM providers into the Outlook mail client. It provides a task pane with two functional tabs:

1. **Email AI (Tab 1)**: Context-aware email AI operations (summarize, draft replies, extract data, translate, tone rewriting) using Office.js for current-item access.
2. **Smart Actions (Tab 2)**: Batch operations on selected items (categorize, extract data, generate draft replies) using Office.js multi-select APIs.

The add-in is a pure client-side application with no backend server. All LLM API calls are made directly from the task pane to provider APIs via HTTPS fetch. Data persistence uses Outlook's built-in storage mechanisms (roamingSettings, customProperties, localStorage).

## Two-Layer Architecture

1. **Vue Task Pane** (Outlook WebView) - Vue 3 + Vite + TypeScript, Office.js, LLM client services, Web Crypto API for key encryption. VitePress for documentation site.
2. **External LLM APIs** - Anthropic Claude, OpenAI, Google Gemini, MiniMax (direct HTTPS from browser)

There is no backend server, no database, and no server-side processing.

## Implementation Phases

1. **Foundation**: Vue 3 + Vite scaffold, Office.js integration, roamingSettings persistence, Web Crypto key encryption, Claude provider client, Tab 1 summarize/reply
2. **Multi-Provider**: Add OpenAI/Gemini/MiniMax clients, provider selector, compose features, streaming via ReadableStream
3. **Smart Actions**: Tab 2 multi-select operations, batch categorize, bulk data extraction, bulk draft generation
4. **Polish**: Smart Alerts, Gemini OAuth via Dialog API, performance optimization, admin deployment guide
