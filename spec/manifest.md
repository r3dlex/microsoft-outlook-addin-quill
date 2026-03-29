# Outlook Add-in Manifest

XML manifest format for maximum Outlook client compatibility. No unified JSON manifest. Single manifest file (no variants).

## Single Manifest

- `manifests/manifest.xml`: Standard manifest with no `<WebApplicationInfo>` (no Graph API, no Entra required)

No build-time variant selection needed. One manifest for all deployment scenarios.

## Key Manifest Elements

- `<MailApp>` type with `<Host Name="Mailbox"/>`
- Minimum requirement set: `Mailbox 1.5`
- Forms: `ItemRead` and `ItemEdit` both point to `https://{domain}/taskpane.html`
- Permission: `ReadWriteMailbox`
- Rules: `ItemIs` for `Message` in both `Read` and `Edit` form types
- ExtensionPoint: `MessageReadCommandSurface` with task pane button

No `<WebApplicationInfo>` section. No Graph API scopes. No Entra app registration required.

## Event-Based Activation (Optional)

For Smart Alerts and OnNewMessageCompose, add `<LaunchEvent>` elements. These events will not fire unless the add-in is deployed via Microsoft 365 admin center (sideloaded add-ins cannot activate on events).

## Sideloading vs Admin Deployment

- Sideloading: user uploads manifest via OWA settings. Works for all task pane features.
- Admin deployment: IT deploys via Microsoft 365 admin center. Enables event-based activation. Required for Smart Alerts.
