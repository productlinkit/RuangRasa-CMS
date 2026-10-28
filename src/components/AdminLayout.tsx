import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "./ui";
import { useBreakpoint } from "../hooks/useBreakpoint";
import type { Language, Role } from "../types";

type AdminLayoutProps = {
  language: Language;
  setLanguage: (language: Language) => void;
  role: Role;
  onRole: (role: Role) => void;
  onLogout: () => void;
};

export function AdminLayout({
  language,
  setLanguage,
  role,
  onRole,
  onLogout,
}: AdminLayoutProps) {
  const breakpoint = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.slice(1) || "overview";
  return (
    <AdminLayoutFrame
      key={`${breakpoint}:${location.pathname}`}
      breakpoint={breakpoint}
      active={active}
      language={language}
      setLanguage={setLanguage}
      role={role}
      onRole={onRole}
      onLogout={onLogout}
      navigate={navigate}
    />
  );
}

function AdminLayoutFrame({
  breakpoint,
  active,
  language,
  setLanguage,
  role,
  onRole,
  onLogout,
  navigate,
}: AdminLayoutProps & {
  breakpoint: ReturnType<typeof useBreakpoint>;
  active: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const onNavigate = (id: string) => {
    setMenuOpen(false);
    navigate(`/${id}`);
  };
  const onRoleChange = (nextRole: Role) => {
    setMenuOpen(false);
    onRole(nextRole);
  };

  return (
    <div className="app-shell">
      {breakpoint === "desktop" && (
        <Sidebar
          language={language}
          role={role}
          active={active}
          onNavigate={onNavigate}
          onRole={onRoleChange}
        />
      )}
      {breakpoint === "tablet" && (
        <Sidebar
          language={language}
          role={role}
          active={active}
          variant="rail"
          onNavigate={onNavigate}
          onRole={onRoleChange}
        />
      )}
      {menuOpen && (
        <div
          className="navigation-scrim"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setMenuOpen(false)
          }
        >
          <Sidebar
            language={language}
            role={role}
            active={active}
            variant="drawer"
            onNavigate={onNavigate}
            onRole={onRoleChange}
            setLanguage={setLanguage}
            onLogout={() => {
              setMenuOpen(false);
              onLogout();
            }}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      )}
      <div className="app-main">
        <Topbar
          language={language}
          setLanguage={setLanguage}
          onLogout={onLogout}
          onMenu={() => setMenuOpen(true)}
          breakpoint={breakpoint}
          role={role}
        />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
