export const STORAGE_KEY = "assu-school-theme";

/**
 * Runs before first paint (inlined in <head>) so the page never flashes the
 * wrong theme: saved choice first, otherwise the OS preference.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;
