import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/email-ai',
  },
  {
    path: '/email-ai',
    name: 'EmailAi',
    component: () => import('@/views/EmailAiView.vue'),
  },
  {
    path: '/automation',
    name: 'Automation',
    component: () => import('@/views/AutomationView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
  },
];

const router = createRouter({
  // Use hash history to avoid conflicts with Office.js history manipulation
  history: createWebHashHistory(),
  routes,
});

export default router;
