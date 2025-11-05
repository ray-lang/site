import { createHighlighter, LanguageInput } from "shiki";
import rayGrammar from "@/grammars/ray.tmLanguage.json";

let cached: Awaited<ReturnType<typeof createHighlighter>> | null = null;

export async function highlightRay(
  code: string,
  theme: "github-light" | "github-dark" = "github-light"
) {
  if (!cached) {
    cached = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        rayGrammar as LanguageInput
      ]
    });
  }
  return cached.codeToHtml(code, { lang: "ray", theme, });
}
