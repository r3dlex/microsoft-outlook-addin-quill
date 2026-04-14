import { definePreset } from '@primevue/themes';
import Aura from '@primeuix/themes/aura';

/**
 * QuillPreset — custom PrimeVue 4 theme matching the Outlook Fluent palette.
 * Maps PrimeVue tokens to existing --color-* CSS custom properties.
 */
export const QuillPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e8f4fd',
      100: '#c5e0f8',
      200: '#9fc8f3',
      300: '#78b0ee',
      400: '#5a9fea',
      500: '#0078d4',
      600: '#0066b8',
      700: '#00549c',
      800: '#004280',
      900: '#003064',
      950: '#001f3f',
    },
  },
});
