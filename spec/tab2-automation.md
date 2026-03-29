# Tab 2: Smart Actions (Selected Items)

All features in this tab use Office.js exclusively. No Graph API, no DavMail, no backend server. Operations are limited to items the user explicitly selects in Outlook or the currently open item.

There is no cross-mailbox search, no inbox rules, no background processing, no automated replies, no folder navigation, and no webhook-based triggers.

## 6.1 Batch Categorize

- User selects multiple emails in Outlook (requirement set 1.13: `getSelectedItemsAsync()` returns up to 100 item IDs)
- Load each item via `Office.context.mailbox.loadItemByIdAsync(itemId)` (requirement set 1.14+)
- For each item: extract subject, sender, body snippet
- Send batch to AI with system prompt for classification
- AI returns suggested categories for each item
- User reviews and approves suggestions in the task pane
- Apply categories via `item.categories.addAsync()` for each item
- Display progress in the task pane (processed N of M)

## 6.2 Bulk Data Extraction

- User selects multiple emails
- Load each item via `loadItemByIdAsync()`
- For each item: extract body text and metadata
- Send to AI with extraction prompt (names, dates, amounts, tracking numbers, etc.)
- Display structured extracted data in a table view in the task pane
- Allow user to copy extracted data to clipboard (JSON or CSV format)
- Store per-item extraction results in `item.customProperties` (2,500 char limit)

## 6.3 Bulk Draft Replies

- User selects multiple emails that need replies
- Load each item via `loadItemByIdAsync()`
- User provides a general reply intent or template
- AI generates a personalized reply draft for each email
- User reviews each draft in the task pane (prev/next navigation)
- On approval per draft: open compose window via `displayReplyForm()` with pre-filled body
- Or approve all: queue all reply drafts to open compose windows sequentially

## 6.4 Quick Actions on Current Item

- Single-click actions available on the currently open email:
  - **Flag and categorize**: AI suggests category + flag status based on content
  - **Extract contacts**: Pull all email addresses, phone numbers, names from body
  - **Generate follow-up reminder**: AI suggests a follow-up date and creates a reminder text (user copies to calendar manually)
  - **Summarize attachments**: If attachments are present, note their names and types (cannot read attachment content via Office.js in read mode without Graph)

## Limitations

- `getSelectedItemsAsync()` returns item IDs only; full content requires `loadItemByIdAsync()` which needs requirement set 1.14+
- No way to enumerate folders or access items outside the current view
- No background processing; all actions require the task pane to be open and the user to initiate
- No automated replies or scheduled actions (no server to run them)
- `loadItemByIdAsync()` may be slow for large batches; implement sequential processing with progress UI
- Cannot read attachment binary content in read mode without Graph API
