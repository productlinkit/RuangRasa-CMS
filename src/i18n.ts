import type { Language } from "./types";

export function localized<Indonesian, English>(
  language: Language,
  indonesian: Indonesian,
  english: English,
): Indonesian | English {
  return language === "ID" ? indonesian : english;
}
