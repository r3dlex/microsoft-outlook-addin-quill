# ADR-001: XML Manifest Over JSON Unified Manifest

## Status

Accepted

## Context

Microsoft offers two manifest formats for Office Add-ins: the legacy XML manifest and the newer JSON unified manifest. The JSON format is newer and aligns with Teams app packaging, but it has limited Outlook client support. Quill targets corporate environments where users may run Outlook desktop (Windows/Mac), Outlook on the web (OWA), and older Outlook builds. The XML manifest has been the standard for over a decade and is supported across all Outlook clients, including legacy desktop versions. The JSON unified manifest does not yet support all Outlook-specific features such as event-based activation rules and certain ExtensionPoint types.

## Decision

We use the XML manifest format for Quill. We maintain two XML manifest variants (Graph and DavMail) rather than adopting the JSON unified manifest. Manifest validation is automated via `npx office-addin-manifest validate` in the CI pipeline.

## Consequences

- Maximum compatibility across all Outlook clients and deployment methods (sideloading and admin deployment).
- Two manifest files must be maintained and kept in sync; a build script selects the correct one.
- We forgo automatic Teams app integration that the JSON manifest would provide.
- If Microsoft deprecates XML manifests in the future, migration will be required, but the decision can be revisited at that time.
