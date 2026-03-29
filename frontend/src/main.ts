import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/main.css';

// Cache history API methods before Office.js nullifies them.
// Office.js overwrites pushState/replaceState which breaks Vue Router.
const cachedPushState = window.history.pushState.bind(window.history);
const cachedReplaceState = window.history.replaceState.bind(window.history);

// Wait for Office.js to be ready before bootstrapping Vue
Office.onReady(() => {
  // Restore the history API methods that Office.js clobbered
  window.history.pushState = cachedPushState;
  window.history.replaceState = cachedReplaceState;

  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);
  app.mount('#app');
});
