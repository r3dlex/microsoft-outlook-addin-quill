# Tab 1: Email AI (Current Item)

All features in this tab use Office.js exclusively for mailbox operations. LLM calls go directly from the task pane to provider APIs via fetch(). No backend server involved. Works on every Outlook platform (desktop, web, new Outlook, mobile).

## 5.1 Summarize Current Email

- Read: `Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text)`
- Also extract: `item.subject`, `item.from`, `item.to`, `item.cc`, `item.dateTimeCreated`
- Send text + metadata directly to LLM provider API via the provider client service
- Stream response into the task pane via fetch ReadableStream
- Display formatted summary with key points, action items, deadlines, mentioned amounts

## 5.2 Draft Reply

- Read current email body and metadata (same as 5.1)
- Optionally include quoted thread text
- User provides reply intent in the chat prompt
- AI generates reply draft (streamed via ReadableStream)
- User reviews in the task pane
- On approval: create new compose window via `Office.context.mailbox.displayReplyAllForm()` or `displayReplyForm()`, then set body via `item.body.setAsync()`
- Alternative: use `appendOnSendAsync()` to queue content for the next send

## 5.3 Contextual Thread Awareness

- Extract `item.conversationId` from the current email
- Parse quoted text from the email body
- No cross-mailbox thread fetching (no Graph API, no DavMail)
- Rely on quoted text in the current email body for conversation context (covers 80%+ of cases)
- Feed parsed conversation context to the AI for context-aware replies

## 5.4 Extract and Classify

- Extract structured data: names, dates, addresses, tracking numbers, invoice amounts, deadlines
- Classify email type: action required, FYI, meeting request, invoice, newsletter, spam
- Apply Outlook categories via `item.categories.addAsync()`
- Store extracted metadata in `item.customProperties` (2,500 char limit per item)
- Display extracted data in the task pane

## 5.5 Translate

- Read body text, detect source language
- Translate via AI to target language
- Display translation in task pane
- Optionally insert translation into compose body

## 5.6 Tone Rewriting (Compose Mode)

- In compose mode: read current draft body via `item.body.getAsync()`
- User selects target tone: formal, casual, assertive, diplomatic, concise
- AI rewrites the body (streamed via ReadableStream)
- User approves, then `item.body.setAsync()` replaces the draft

## 5.7 Smart Alerts Integration

- Register `OnMessageSend` event handler (requirement set 1.12+)
- Before send: extract composed body, run AI analysis for:
  - Missing attachments (body mentions "attached" but no attachments)
  - Potentially wrong recipients
  - Tone check (aggressive language, missing greeting)
  - Confidential content warnings
- If issues found: block send with `event.completed({ allowEvent: false })`
- Requires admin deployment for event-based activation to fire
- Note: Smart Alert LLM calls must complete within the 300-second event handler timeout
