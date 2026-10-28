import { createContext } from "react";
import type { AuditEntry, Language, Role } from "../types";

export type AppStateContextValue = {
  language: Language;
  role: Role;
  isLoggedIn: boolean;
  authReady: boolean;
  apiError: string;
  auditEntries: AuditEntry[];
  setLanguage: (value: Language) => void;
  setRole: (value: Role) => void;
  setIsLoggedIn: (value: boolean) => void;
  setApiError: (value: string) => void;
  addAuditEntry: (value: AuditEntry) => Promise<void>;
};

export const AppStateContext = createContext<AppStateContextValue | null>(null);
