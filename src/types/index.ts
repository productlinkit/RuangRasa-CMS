export type Language = "ID" | "EN";

export type Role =
  | "Super Admin"
  | "Product/Ops"
  | "Content Editor"
  | "Safety Reviewer"
  | "Analyst"
  | "Finance/Billing";

export type Access = "F" | "R" | "M" | "—";

export type AuditEntry = {
  id: string;
  time: string;
  ageHours: number;
  actor: string;
  role: string;
  action: string;
  object: string;
  reason: string;
  fresh?: boolean;
};

export type Breakpoint = "mobile" | "tablet" | "desktop";

export type SessionStatus = "Aktif" | "Selesai" | "Krisis" | "Abuse";

export type SessionData = {
  id: string;
  phone: string;
  name: string;
  context: string;
  mode: "1-on-1" | "Group mediation";
  language: string;
  status: SessionStatus;
  duration: string;
};

export type ChatMessage = {
  sender: "Rara" | "User" | "Pihak A" | "Pihak B";
  text: string;
  time: string;
  flag?: string;
};

export type SafetyState = "baru" | "ditinjau" | "dieskalasi" | "selesai";

export type SafetyFlag = {
  id: string;
  sessionId: string;
  name: string;
  title: string;
  context: string;
  mode: "1-on-1" | "Group mediation";
  language: string;
  severity: "Kritis" | "Tinggi" | "Sedang";
  time: string;
  duration: string;
  status: SafetyState;
};

export type PlanData = {
  id: string;
  name: string;
  price: number;
  cycle: "Bulanan" | "Tahunan";
  status: "Aktif" | "Draft" | "Diarsipkan";
  sessions: number;
  duration: number;
  group: boolean;
  subscribers: number;
  version: number;
  paid: boolean;
};

export type SubscriptionRow = {
  id: string;
  user: string;
  name: string;
  plan: string;
  status: "Aktif" | "Trial" | "Jatuh tempo" | "Dibatalkan";
  next: string;
};

export type TransactionRow = {
  id: string;
  time: string;
  user: string;
  amount: string;
  method: string;
  status: "Berhasil" | "Menunggu" | "Gagal" | "Refund";
  note: string;
};

export type TemplateStatus = "Disetujui" | "Menunggu" | "Ditolak" | "Draft";

export type NotificationTemplate = {
  id: string;
  name: string;
  status: TemplateStatus;
  idText: string;
  enText: string;
};

export type NotificationRule = {
  name: string;
  trigger: string;
  delay: number;
  frequency: string;
  active: boolean;
};

export type NotificationAlert = {
  event: string;
  severity: "Kritis" | "Tinggi" | "Sedang";
  channels: boolean[];
  roles: Role[];
};

export type TeamMember = {
  name: string;
  email: string;
  role: Role;
  mfa: boolean;
  lastLogin: string;
};

export type Integration = {
  id: string;
  icon: string;
  name: string;
  nameEN?: string;
  description: string;
  descriptionEN: string;
  status: string;
  tone: "success" | "neutral" | "warning";
};

export type VoucherRow = [string, string, string, string, boolean];

export type LandingHeroContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta: string;
  secondary: string;
  stat1: string;
  stat2: string;
  stat3: string;
  floating1: string;
  floating2: string;
  phone: string;
  prefilled: string;
};

export type UserStatus = "Aktif" | "Diblokir" | "Data dihapus";

export type UserPlan = "Free" | "Premium";

export type UserData = {
  id: string;
  name: string;
  phone: string;
  fullPhone: string;
  language: string;
  context: string;
  joined: string;
  joinedDays: number;
  activity: string;
  status: UserStatus;
  plan: UserPlan;
  simulatedPremium?: boolean;
  sessions: number;
};

export type SensitiveAction = "reveal" | "plan" | "export" | "block" | "delete";
