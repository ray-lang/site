import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

// Merge your overrides with the theme’s defaults
export function useMDXComponents(components?: Record<string, unknown>) {
  const themeComponents = getThemeComponents()
  return {
    ...themeComponents,
    ...components
  }
}
