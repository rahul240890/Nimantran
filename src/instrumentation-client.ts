import { reportError } from "@/lib/errors/report";

/* Uncaught errors in the browser go to the server logs (lib/errors/report.ts). */

window.addEventListener("error", (event) => {
  // Only our own scripts: browser extensions and other sites' scripts are not ours to fix
  if (event.filename && !event.filename.startsWith(window.location.origin)) return;
  if (/ResizeObserver loop/.test(event.message)) return;
  reportError(event.error ?? event.message, "window");
});

window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason, "promise");
});
