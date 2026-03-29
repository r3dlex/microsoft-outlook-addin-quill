/**
 * Type augmentations for Office.js.
 * Extends the global Office namespace with types used by Quill.
 */

declare namespace Office {
  interface Auth {
    getAccessToken(options?: AuthOptions): Promise<string>;
  }

  interface AuthOptions {
    allowSignInPrompt?: boolean;
    allowConsentPrompt?: boolean;
    forMSGraphAccess?: boolean;
  }

  interface RoamingSettings {
    get(name: string): unknown;
    set(name: string, value: unknown): void;
    saveAsync(callback?: (result: AsyncResult<void>) => void): void;
  }

  interface Context {
    roamingSettings: RoamingSettings;
    ui: UI;
    mailbox: Mailbox;
    auth: Auth;
  }

  interface UI {
    displayDialogAsync(
      startAddress: string,
      options?: DialogOptions,
      callback?: (result: AsyncResult<Dialog>) => void,
    ): void;
    messageParent(message: string): void;
  }

  interface DialogOptions {
    height?: number;
    width?: number;
    promptBeforeOpen?: boolean;
  }

  interface Dialog {
    close(): void;
    addEventHandler(
      eventType: EventType,
      handler: (args: { message: string; origin: string }) => void,
    ): void;
  }
}
