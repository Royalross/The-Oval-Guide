// This is a STRING that will be inlined into <head> before hydration.
export const themeInitScript = `
(function(){
  try {
    var STORAGE_KEY = 'theme';
    var d = document.documentElement;

    // 1) Read persisted theme (light/dark/system->resolved)
    var t = localStorage.getItem(STORAGE_KEY);

    // 2) Fallback to system preference
    if (!t || t === 'system') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 3) Apply class + color-scheme BEFORE React hydrates
    d.classList.remove('light','dark');
    d.classList.add(t);
    d.style.colorScheme = (t === 'dark') ? 'dark' : 'light';
  } catch (e) {}
})();
`;
