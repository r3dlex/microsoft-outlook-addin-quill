import { ref, onMounted } from 'vue';

export interface OfficeMailItem {
  subject: string;
  from: string;
  body: string;
  conversationId: string;
}

/**
 * Composable that wraps Office.js mailbox item calls.
 * All Office.js getAsync callbacks are wrapped in Promises for clean async usage.
 */
export function useOffice() {
  const subject = ref<string>('');
  const from = ref<string>('');
  const body = ref<string>('');
  const conversationId = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function getItem(): Office.MessageRead | null {
    const item = Office.context?.mailbox?.item;
    return item ? (item as Office.MessageRead) : null;
  }

  function getSubject(): Promise<string> {
    return new Promise((resolve, reject) => {
      const item = getItem();
      if (!item) {
        reject(new Error('No mail item available'));
        return;
      }
      // subject is a direct property on read items
      resolve(item.subject ?? '');
    });
  }

  function getFrom(): Promise<string> {
    return new Promise((resolve, reject) => {
      const item = getItem();
      if (!item) {
        reject(new Error('No mail item available'));
        return;
      }
      // from is a direct property on read items
      const sender = item.from;
      resolve(sender?.emailAddress ?? '');
    });
  }

  function getBody(): Promise<string> {
    return new Promise((resolve, reject) => {
      const item = getItem();
      if (!item) {
        reject(new Error('No mail item available'));
        return;
      }
      item.body.getAsync(Office.CoercionType.Text, (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve(result.value);
        } else {
          reject(new Error(result.error?.message ?? 'Failed to get body'));
        }
      });
    });
  }

  function getConversationId(): Promise<string> {
    return new Promise((resolve, reject) => {
      const item = getItem();
      if (!item) {
        reject(new Error('No mail item available'));
        return;
      }
      resolve(item.conversationId ?? '');
    });
  }

  async function refresh(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const [s, f, b, c] = await Promise.all([
        getSubject(),
        getFrom(),
        getBody(),
        getConversationId(),
      ]);
      subject.value = s;
      from.value = f;
      body.value = b;
      conversationId.value = c;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error reading mail item';
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    refresh();
  });

  return {
    subject,
    from,
    body,
    conversationId,
    isLoading,
    error,
    refresh,
  };
}
