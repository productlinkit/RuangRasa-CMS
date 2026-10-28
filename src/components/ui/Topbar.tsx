import { message } from "../../locales";
import { localized } from "../../i18n";
import { copy } from "../../data/mock/index";
import { Breakpoint, Language, Role } from "../../types/index";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { LanguageToggle } from "./LanguageToggle";

export function Topbar({
  language,
  setLanguage,
  onLogout,
  onMenu,
  breakpoint,
  role,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  onLogout: () => void;
  onMenu: () => void;
  breakpoint: Breakpoint;
  role: Role;
}) {
  return (
    <header className="topbar">
      {breakpoint !== "desktop" && (
        <button
          className="icon-button menu-button"
          onClick={onMenu}
          aria-label={message(language, "components.ui.005")}
        >
          <Icon>menu</Icon>
        </button>
      )}
      {breakpoint === "mobile" && (
        <img
          className="topbar-logo"
          src="/ruangrasa-logo.png"
          alt="RuangRasa."
        />
      )}
      <span className="topbar-spacer" />
      <button
        className="icon-button notification"
        aria-label={message(language, "components.ui.006")}
      >
        <Icon>notifications</Icon>
        <span />
      </button>
      {breakpoint !== "mobile" && (
        <LanguageToggle language={language} setLanguage={setLanguage} />
      )}
      {breakpoint !== "mobile" ? (
        <Button onClick={onLogout}>
          {copy[language].logout}
          <Icon>logout</Icon>
        </Button>
      ) : (
        <div
          className="topbar-avatar"
          aria-label={localized(
            language,
            `Profil admin ${role === "Product/Ops" ? "Dina" : role}`,
            `${role === "Product/Ops" ? "Dina" : role} admin profile`,
          )}
        >
          {role === "Product/Ops" ? "D" : role.charAt(0)}
        </div>
      )}
    </header>
  );
}
