import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { roles } from "../data/mock";
import { auditApi, authApi } from "../services/api";
import type { AuditEntry, Language, Role } from "../types";
import { AppStateContext } from "./AppStateContext";

type AppState = {
  language: Language;
  role: Role;
  isLoggedIn: boolean;
  authReady: boolean;
  apiError: string;
  auditEntries: AuditEntry[];
};
type AppAction =
  | { type: "set-language"; value: Language }
  | { type: "set-role"; value: Role }
  | { type: "set-logged-in"; value: boolean }
  | { type: "set-auth-ready"; value: boolean }
  | { type: "set-audit-entries"; value: AuditEntry[] }
  | { type: "add-audit-entry"; value: AuditEntry }
  | { type: "set-api-error"; value: string };

function createInitialState(): AppState {
  let language: Language = "ID";
  let role: Role = "Product/Ops";

  if (typeof window !== "undefined") {
    try {
      const savedLanguage = window.localStorage.getItem(
        "ruangrasa.preference.language",
      );
      const savedRole = window.localStorage.getItem(
        "ruangrasa.preference.role",
      );
      if (savedLanguage === "ID" || savedLanguage === "EN")
        language = savedLanguage;
      if (savedRole && roles.includes(savedRole as Role))
        role = savedRole as Role;
    } catch (error) {
      console.error("Unable to read persisted application preferences.", error);
    }
  }

  return {
    language,
    role,
    isLoggedIn: false,
    authReady: false,
    apiError: "",
    auditEntries: [],
  };
}

const initialState = createInitialState();

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "set-language":
      return { ...state, language: action.value };
    case "set-role":
      return { ...state, role: action.value };
    case "set-logged-in":
      return { ...state, isLoggedIn: action.value };
    case "set-auth-ready":
      return { ...state, authReady: action.value };
    case "set-audit-entries":
      return { ...state, auditEntries: action.value };
    case "add-audit-entry":
      return { ...state, auditEntries: [action.value, ...state.auditEntries] };
    case "set-api-error":
      return { ...state, apiError: action.value };
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const authenticated = await authApi.session();
        if (!active) return;
        dispatch({ type: "set-api-error", value: "" });
        if (authenticated) dispatch({ type: "set-logged-in", value: true });
      } catch (error) {
        if (!active) return;
        dispatch({
          type: "set-api-error",
          value:
            error instanceof Error
              ? error.message
              : "Unable to restore the admin session.",
        });
      } finally {
        if (active) dispatch({ type: "set-auth-ready", value: true });
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!state.isLoggedIn) return;
    let active = true;
    auditApi
      .list()
      .then((entries) => {
        if (active) {
          dispatch({ type: "set-audit-entries", value: entries });
          dispatch({ type: "set-api-error", value: "" });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load audit entries.";
        dispatch({ type: "set-api-error", value: message });
        console.error(
          "Unable to load audit entries from the local API.",
          error,
        );
      });
    return () => {
      active = false;
    };
  }, [state.isLoggedIn]);

  const setLanguage = useCallback(
    (value: Language) => dispatch({ type: "set-language", value }),
    [],
  );
  const setRole = useCallback(
    (value: Role) => dispatch({ type: "set-role", value }),
    [],
  );
  const setIsLoggedIn = useCallback(
    (value: boolean) => dispatch({ type: "set-logged-in", value }),
    [],
  );
  const setApiError = useCallback(
    (value: string) => dispatch({ type: "set-api-error", value }),
    [],
  );
  const addAuditEntry = useCallback(async (value: AuditEntry) => {
    try {
      const saved = await auditApi.add(value);
      dispatch({ type: "add-audit-entry", value: saved });
      dispatch({ type: "set-api-error", value: "" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save audit entry.";
      dispatch({ type: "set-api-error", value: message });
      console.error(
        "Unable to persist audit entry through the local API.",
        error,
      );
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "ruangrasa.preference.language",
        state.language,
      );
      window.localStorage.setItem("ruangrasa.preference.role", state.role);
    } catch (error) {
      console.error("Unable to persist application preferences.", error);
    }
  }, [state.language, state.role]);

  const value = useMemo(
    () => ({
      ...state,
      setLanguage,
      setRole,
      setIsLoggedIn,
      setApiError,
      addAuditEntry,
    }),
    [state, setLanguage, setRole, setIsLoggedIn, setApiError, addAuditEntry],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
