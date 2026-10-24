import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// text-ui is a size of ours (globals.css); unknown, it would pass for a colour and push out
// the real one, such as a primary button's dark words in the dark theme
const twMerge = extendTailwindMerge({ extend: { theme: { text: ["ui"] } } });

/** Merge class names, letting later Tailwind classes override earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
