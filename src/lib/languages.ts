const LANGUAGE_COLOR: Record<string, string> = {
  Java: "#b07219",
  Dart: "#00b4ab",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4f5d95",
  Blade: "#f7523f",
  "C#": "#178600",
  JavaScript: "#c7a008",
  SCSS: "#c6538c",
  Kotlin: "#a97bff",
  "Jupyter Notebook": "#da5b0b",
};

export function languageColor(language: string | null): string {
  if (!language) return "#8a8175";
  return LANGUAGE_COLOR[language] ?? "#8a8175";
}
