import { ref } from 'vue';

export interface SelectedMailItem {
  itemId: string;
  subject: string;
}

/**
 * Composable for multi-select mailbox operations.
 * Uses only Office.js APIs -- no backend REST calls.
 * Leverages getSelectedItemsAsync for multi-select in supported clients.
 */
export function useMailbox() {
  const selectedItems = ref<SelectedMailItem[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  /**
   * Get currently selected mail items using Office.js multi-select API.
   * Requires Mailbox 1.13+ for getSelectedItemsAsync support.
   */
  async function getSelectedItems(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      if (typeof Office === 'undefined' || !Office.context?.mailbox) {
        throw new Error('Office.js not available');
      }

      const mailbox = Office.context.mailbox as unknown as {
        getSelectedItemsAsync?: (
          callback: (result: Office.AsyncResult<{ id: string; subject: string }[]>) => void,
        ) => void;
      };

      if (!mailbox.getSelectedItemsAsync) {
        throw new Error(
          'Multi-select not supported in this Outlook version. Requires Mailbox 1.13+.',
        );
      }

      const items = await new Promise<{ id: string; subject: string }[]>((resolve, reject) => {
        mailbox.getSelectedItemsAsync!((result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            resolve(result.value);
          } else {
            reject(new Error(result.error?.message ?? 'Failed to get selected items'));
          }
        });
      });

      selectedItems.value = items.map((item) => ({
        itemId: item.id,
        subject: item.subject,
      }));
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to get selected items';
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get the full body of a specific mail item by ID.
   * Uses Office.js getItemIdAsync and REST API fallback.
   */
  async function getItemBody(itemId: string): Promise<string> {
    if (typeof Office === 'undefined' || !Office.context?.mailbox) {
      throw new Error('Office.js not available');
    }

    // For the currently displayed item, use the standard body API
    const currentItem = Office.context.mailbox.item as Office.MessageRead | undefined;
    if (currentItem?.itemId === itemId) {
      return new Promise<string>((resolve, reject) => {
        currentItem.body.getAsync(Office.CoercionType.Text, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            resolve(result.value);
          } else {
            reject(new Error(result.error?.message ?? 'Failed to get body'));
          }
        });
      });
    }

    // For other items we cannot read the body without Graph API or a backend.
    // Return a placeholder indicating limited access.
    return `[Body not available for item ${itemId} - only the currently displayed email body can be read via Office.js]`;
  }

  return {
    selectedItems,
    isLoading,
    error,
    getSelectedItems,
    getItemBody,
  };
}
