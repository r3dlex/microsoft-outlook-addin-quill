import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Quill Documentation',
  description: 'Documentation for the Quill Outlook Add-in',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/api' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Architecture', link: '/guide/architecture' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API', link: '/reference/api' },
        ],
      },
    ],
  },
});
