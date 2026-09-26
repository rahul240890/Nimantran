export type ThemeChoice = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "nimantran-theme";

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return value === "system" || value === "light" || value === "dark";
}

/**
 * Runs before first paint (inlined in the root layout) so a saved theme never flashes.
 * Kept as a plain string: it must not depend on the bundle.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})()`;

/** Applies a theme choice to <html> and remembers it. */
export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Private mode or blocked storage: the choice still applies for this visit
  }
}

export function readTheme(): ThemeChoice {
  const value = document.documentElement.dataset.theme;
  return isThemeChoice(value) ? value : "system";
}
