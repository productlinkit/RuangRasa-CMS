import { Language } from "../../types/index";

export function LanguageToggle({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  return (
    <div className="language-toggle" aria-label="Language">
      {(["ID", "EN"] as Language[]).map((item) => (
        <button
          key={item}
          className={language === item ? "is-active" : ""}
          onClick={() => setLanguage(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
