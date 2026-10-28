import { message } from "./locales";
import { useCallback, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { navigation, roleIndex } from "./data/mock";
import { useAppState } from "./hooks/useAppState";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { BillingPage } from "./pages/BillingPage";
import { LandingContentPage } from "./pages/LandingContentPage";
import { AdminLogin } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Overview } from "./pages/OverviewPage";
import { Placeholder } from "./pages/PlaceholderPage";
import { RaraConfigPage } from "./pages/RaraConfigPage";
import { SafetyPage } from "./pages/SafetyPage";
import { SessionsPage } from "./pages/SessionsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UsersPage } from "./pages/UsersPage";
import { authApi } from "./services/api";
import type { AuditEntry, Role } from "./types";

function AppRoutes() {
  const {
    language,
    setLanguage,
    role,
    setRole,
    isLoggedIn,
    setIsLoggedIn,
    setApiError,
    authReady,
    apiError,
    auditEntries,
    addAuditEntry,
  } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const [returnPath] = useState(location.pathname);
  const active = location.pathname.slice(1) || "overview";
  const current =
    navigation.find((item) => item.id === active) ?? navigation[0];
  const access = current.access[roleIndex[role]];

  const addAudit = useCallback(
    async (action: string, object: string, reason: string) => {
      const actorNames: Record<Role, string> = {
        "Super Admin": "Arif",
        "Product/Ops": "Dina",
        "Content Editor": "Nadia",
        "Safety Reviewer": "Maya",
        Analyst: "Raka",
        "Finance/Billing": "Rani",
      };
      const time = new Date()
        .toLocaleString(message(language, "App.001"), {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", " ·");
      const entry: AuditEntry = {
        id: `AUD-${Date.now()}`,
        actor: actorNames[role],
        role,
        action,
        object,
        reason,
        time,
        ageHours: 0,
        fresh: true,
      };
      await addAuditEntry(entry);
    },
    [addAuditEntry, language, role],
  );

  const onLogin = async () => {
    await addAudit(
      "Login berhasil (MFA)",
      "Admin CMS",
      "Email kerja + MFA terverifikasi",
    );
    setIsLoggedIn(true);
    const requestedPath = (
      location.state as { from?: { pathname?: string } } | null
    )?.from?.pathname;
    navigate(requestedPath || returnPath || "/overview", { replace: true });
  };

  const loginPage = (
    <AdminLogin
      language={language}
      setLanguage={setLanguage}
      onLogin={onLogin}
    />
  );

  const pageElements = {
    overview: <Overview language={language} role={role} access={access} />,
    users: (
      <UsersPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
        onOpenAudit={() => navigate("/audit")}
      />
    ),
    sessions: (
      <SessionsPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    safety: (
      <SafetyPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    rara: (
      <RaraConfigPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    plans: (
      <BillingPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    notifications: (
      <NotificationsPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    analytics: (
      <AnalyticsPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    content: (
      <LandingContentPage
        language={language}
        role={role}
        access={access}
        onAudit={addAudit}
      />
    ),
    audit: (
      <AuditLogPage
        language={language}
        role={role}
        access={access}
        entries={auditEntries}
        onAudit={addAudit}
      />
    ),
    settings: (
      <SettingsPage language={language} role={role} onAudit={addAudit} />
    ),
  };

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    if (current.access[roleIndex[nextRole]] === "—") navigate("/overview");
  };

  if (!authReady) {
    return <div role="status">Memeriksa sesi admin…</div>;
  }

  const logout = () => {
    void authApi
      .logout()
      .then(() => setIsLoggedIn(false))
      .catch((error: unknown) => {
        setApiError(
          error instanceof Error ? error.message : "Unable to end the session.",
        );
      });
  };

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/overview" replace /> : loginPage}
        />
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isLoggedIn}
              fallback={
                <Navigate to="/login" replace state={{ from: location }} />
              }
            />
          }
        >
          <Route
            element={
              <AdminLayout
                language={language}
                setLanguage={setLanguage}
                role={role}
                onRole={changeRole}
                onLogout={logout}
              />
            }
          >
            <Route path="/" element={<Navigate to="/overview" replace />} />
            {navigation.map((item) => (
              <Route
                key={item.id}
                path={`/${item.id}`}
                element={
                  pageElements[item.id as keyof typeof pageElements] ?? (
                    <Placeholder
                      item={item}
                      language={language}
                      role={role}
                      access={access}
                      onBack={() => navigate("/overview")}
                    />
                  )
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {apiError && (
        <div className="toast" role="alert">
          {apiError}
        </div>
      )}
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}
