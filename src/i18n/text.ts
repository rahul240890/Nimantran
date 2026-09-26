import type { UiLocale } from "./locales";

/**
 * Copy in every site language, checked against English: a translation with a missing or
 * misshapen string fails the type check. Functions keep their arguments, so plurals and
 * word order stay the translator's choice. Lists keep their length, and an item's `id`
 * stays exactly as in English, since code looks items up by it.
 */
export type Translation<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Translation<R>
    : T extends readonly unknown[]
      ? { readonly [K in keyof T]: Translation<T[K]> }
      : T extends object
        ? { readonly [K in keyof T]: K extends "id" ? T[K] : Translation<T[K]> }
        : T;

export type Localized<T> = Record<UiLocale, Translation<T>>;
