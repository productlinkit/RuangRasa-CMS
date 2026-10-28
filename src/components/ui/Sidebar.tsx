import { message } from "../../locales";
import { useEffect, useRef } from "react";
import { copy, navigation, roleIndex, roles } from "../../data/mock/index";
import { useEscape } from "../../hooks/useEscape";
import { Language, Role } from "../../types/index";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { LanguageToggle } from "./LanguageToggle";

export function Sidebar({
  language,
  role,
  active,
  variant = "desktop",
  onNavigate,
  onRole,
  setLanguage,
  onLogout,
  onClose,
}: {
  language: Language;
  role: Role;
  active: string;
  variant?: "desktop" | "rail" | "drawer";
  onNavigate: (id: string) => void;
  onRole: (role: Role) => void;
  setLanguage?: (language: Language) => void;
  onLogout?: () => void;
  onClose?: () => void;
}) {
  const visibleItems = navigation.filter(
    (item) => item.access[roleIndex[role]] !== "—",
  );
  const drawerRef = useRef<HTMLElement>(null);
  useEscape(() => onClose?.(), variant === "drawer");
  useEffect(() => {
    if (variant !== "drawer" || !drawerRef.current) return;
    const drawer = drawerRef.current;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      "button, select, [href], input, [tabindex]:not([tabindex='-1'])",
    );
    focusable[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    drawer.addEventListener("keydown", trap);
    return () => drawer.removeEventListener("keydown", trap);
  }, [variant]);
  return (
    <aside className={`sidebar sidebar--${variant}`} ref={drawerRef}>
      {variant === "drawer" && (
        <button
          className="drawer-close"
          onClick={onClose}
          aria-label={message(language, "components.ui.001")}
        >
          <Icon>close</Icon>
        </button>
      )}
      <div className="brand">
        <img src="/ruangrasa-logo.png" alt="RuangRasa." />
      </div>
      <nav className="nav-list" aria-label="Admin navigation">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "is-active" : ""}`}
            aria-label={item.label[message(language, "components.ui.002")]}
            title={
              variant === "rail"
                ? item.label[message(language, "components.ui.003")]
                : undefined
            }
            onClick={() => {
              onNavigate(item.id);
              onClose?.();
            }}
          >
            <Icon>{item.icon}</Icon>
            <span>{item.label[message(language, "components.ui.004")]}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="admin-panel">
        <div className="admin-profile">
          <div className="avatar">
            {role === "Product/Ops" ? "D" : role.charAt(0)}
          </div>
          <div>
            <strong>{role === "Product/Ops" ? "Dina" : role}</strong>
            <span>{role}</span>
          </div>
          <Badge tone="success">{copy[language].twofa}</Badge>
        </div>
        <label className="role-select">
          <span>{copy[language].demoRole}</span>
          <select
            value={role}
            onChange={(event) => onRole(event.target.value as Role)}
          >
            {roles.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <Icon>expand_more</Icon>
        </label>
        {variant === "drawer" && (
          <div className="drawer-preferences">
            <LanguageToggle language={language} setLanguage={setLanguage!} />
            <Button onClick={onLogout}>
              {copy[language].logout}
              <Icon>logout</Icon>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
