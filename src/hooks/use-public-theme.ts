/**
 * Public marketing pages use the global dark theme — no body class needed.
 * Hook is kept as a no-op for backwards compatibility with existing imports.
 */
export function usePublicTheme() {
  return { theme: "dark" as const, isLight: false };
}
