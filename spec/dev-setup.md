# Development Setup and Deployment

## Prerequisites

- Node.js 20+ and npm
- mkcert (for local HTTPS certificates)

That is all. No Elixir, no PostgreSQL, no DavMail.

## Local Development

```bash
# Generate local HTTPS certs
mkcert -install
mkcert localhost 127.0.0.1

# Install dependencies
npm install

# Start Vite dev server with HTTPS
npm run dev  # Vite dev server with HTTPS on port 4200

# Sideload the manifest
# Open https://aka.ms/olksideload in OWA
# Upload manifests/manifest.xml
```

## Environment Variables

```bash
# No backend environment variables needed.
# All configuration (API keys, proxy URL, preferences) is managed
# through the Settings panel in the task pane and stored in roamingSettings.

# Optional: CORS proxy URL for local development
# (Can also be set in the Settings panel at runtime)
VITE_DEFAULT_PROXY_URL=https://your-cors-proxy.workers.dev
```

## CORS Proxy for Development

For local development with LLM providers that block CORS:

1. Deploy a minimal Cloudflare Worker or use a local proxy
2. Set the proxy URL in the Settings panel or via `VITE_DEFAULT_PROXY_URL`
3. The proxy forwards requests with CORS headers added; it does not store credentials

## Deployment

### Static Hosting

The add-in is a static Vue/Vite build. No server required.

```bash
npm run build
# Deploy dist/ to any static hosting provider
```

Suitable hosts:
- Azure Static Web Apps
- Cloudflare Pages
- Vercel
- GitHub Pages (with custom domain and HTTPS)
- Any CDN or web server serving static files over HTTPS

### CORS Proxy Deployment

If needed, deploy the CORS proxy as:
- Cloudflare Worker (free tier sufficient)
- Vercel Edge Function
- Any lightweight HTTP proxy with CORS header injection

### Manifest Distribution

- **Sideloading**: Upload `manifests/manifest.xml` via OWA settings (for individual users)
- **Admin deployment**: IT uploads manifest via Microsoft 365 admin center (enables event-based activation for Smart Alerts)
- Update the `<SourceLocation>` URL in the manifest to point to the deployed static site
