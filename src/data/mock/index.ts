import {
  Access,
  ChatMessage,
  Integration,
  LandingHeroContent,
  NotificationAlert,
  NotificationRule,
  NotificationTemplate,
  PlanData,
  Role,
  SafetyFlag,
  SessionData,
  SubscriptionRow,
  TeamMember,
  TransactionRow,
  VoucherRow,
} from "../../types/index";

export const roles: Role[] = [
  "Super Admin",
  "Product/Ops",
  "Content Editor",
  "Safety Reviewer",
  "Analyst",
  "Finance/Billing",
];

export const RELATIONSHIP_CONTEXTS = [
  "Romantic & partnership",
  "Family & home",
  "Friendship & work",
] as const;

export const CONTEXT_METRICS = [
  [RELATIONSHIP_CONTEXTS[0], "52%", "context-fill--52"],
  [RELATIONSHIP_CONTEXTS[1], "31%", "context-fill--31"],
  [RELATIONSHIP_CONTEXTS[2], "17%", "context-fill--17"],
] as const;

export const roleIndex: Record<Role, number> = {
  "Super Admin": 0,
  "Product/Ops": 1,
  "Content Editor": 2,
  "Safety Reviewer": 3,
  Analyst: 4,
  "Finance/Billing": 5,
};

export const navigation: Array<{
  id: string;
  icon: string;
  label: [string, string];
  title: [string, string];
  accent: [string, string];
  access: Access[];
  badge?: string;
}> = [
  {
    id: "overview",
    icon: "space_dashboard",
    label: ["Overview", "Overview"],
    title: ["Ringkasan", "A calm view of"],
    accent: ["hari ini.", "today."],
    access: ["F", "F", "R", "R", "R", "R"],
  },
  {
    id: "users",
    icon: "group",
    label: ["Pengguna", "Users"],
    title: ["Pengguna &", "Users &"],
    accent: ["privasi.", "privacy."],
    access: ["F", "F", "—", "M", "—", "M"],
  },
  {
    id: "sessions",
    icon: "forum",
    label: ["Sesi & Mediasi", "Sessions & Mediation"],
    title: ["Sesi &", "Sessions &"],
    accent: ["Mediasi.", "Mediation."],
    access: ["F", "R", "—", "R", "—", "—"],
  },
  {
    id: "safety",
    icon: "health_and_safety",
    label: ["Safety & Krisis", "Safety & Crisis"],
    title: ["Safety &", "Safety &"],
    accent: ["Krisis.", "Crisis."],
    access: ["F", "R", "—", "F", "—", "—"],
    badge: "3",
  },
  {
    id: "rara",
    icon: "auto_awesome",
    label: ["Konfigurasi Rara", "Rara Configuration"],
    title: ["Konfigurasi", "Configure"],
    accent: ["Rara.", "Rara."],
    access: ["F", "F", "R", "R", "—", "—"],
  },
  {
    id: "plans",
    icon: "loyalty",
    label: ["Plan & Langganan", "Plans & Subscriptions"],
    title: ["Plan &", "Plans &"],
    accent: ["Langganan.", "Subscriptions."],
    access: ["F", "R", "—", "—", "—", "F"],
  },
  {
    id: "notifications",
    icon: "notifications",
    label: ["Notifikasi", "Notifications"],
    title: ["Pesan &", "Messages &"],
    accent: ["Notifikasi.", "Notifications."],
    access: ["F", "F", "F", "R", "—", "R"],
  },
  {
    id: "analytics",
    icon: "monitoring",
    label: ["Analytics", "Analytics"],
    title: ["Insight &", "Insights &"],
    accent: ["Analytics.", "Analytics."],
    access: ["F", "R", "R", "R", "R", "R"],
  },
  {
    id: "content",
    icon: "web",
    label: ["Konten Landing", "Landing Content"],
    title: ["Konten", "Landing"],
    accent: ["Landing.", "Content."],
    access: ["F", "R", "F", "—", "—", "—"],
  },
  {
    id: "audit",
    icon: "history",
    label: ["Audit Log", "Audit Log"],
    title: ["Jejak &", "Activity &"],
    accent: ["Audit.", "Audit."],
    access: ["F", "R", "—", "—", "—", "—"],
  },
  {
    id: "settings",
    icon: "settings",
    label: ["Pengaturan", "Settings"],
    title: ["Pengaturan", "Admin"],
    accent: ["admin.", "settings."],
    access: ["F", "—", "—", "—", "—", "—"],
  },
];

export const copy = {
  ID: {
    eyebrow: "PUSAT KENDALI RUANGRASA",
    greeting: "Selamat pagi, Dina. Rara siap menemani.",
    subheading: "Pantau ruang cerita hari ini tanpa mengusik privasi mereka.",
    sample: "Data contoh",
    range: "7 hari terakhir",
    full: "Lihat laporan",
    sessions: "Sesi aktif",
    users: "Pengguna baru",
    mediation: "Mediasi bersama",
    consent: "Consent tercatat",
    compared: "dibanding pekan lalu",
    sessionTitle: "Aktivitas sesi terbaru",
    sessionCopy:
      "Metadata saja — isi percakapan tidak pernah tampil di daftar.",
    allSessions: "Lihat semua sesi",
    user: "PENGGUNA",
    context: "KONTEKS",
    mode: "MODE",
    consentCol: "CONSENT",
    status: "STATUS",
    encrypted: "Terenkripsi",
    agreed: "Disetujui",
    active: "Aktif",
    finished: "Selesai",
    safetyTitle: "Perlu perhatian hangat",
    safetyCopy:
      "3 sinyal menunggu tinjauan Safety Reviewer. Prioritaskan konteks, bukan asumsi.",
    review: "Tinjau dengan aman",
    raraTitle: "Rara hari ini",
    raraCopy: "Semua gaya bahasa aktif dan stabil.",
    online: "Rara online",
    style: "Gaya terpopuler",
    language: "Bahasa utama",
    privacyTitle: "Privasi dijaga dari awal",
    privacyCopy:
      "Nomor WhatsApp selalu termasker. Sesi tersimpan terenkripsi dan tidak dibagikan kepada pihak ketiga.",
    access: "Sebagai {role}, Anda hanya bisa melihat modul ini.",
    placeholder: "Modul ini sedang disiapkan",
    placeholderCopy:
      "Struktur, kontrol akses, dan fondasi visual sudah siap untuk tahap berikutnya.",
    back: "Kembali ke Overview",
    demoRole: "Lihat sebagai role (demo)",
    logout: "Keluar",
    twofa: "2FA aktif",
    page: "Halaman 1 / 2",
    loginEyebrow: "RUANG ADMIN",
    loginTitle: "Masuk ke",
    loginAccent: "ruang admin.",
    loginIntro:
      "Masuk dengan email kerja dan kode MFA. Hanya untuk tim RuangRasa.",
    workEmail: "Email kerja",
    password: "Kata sandi",
    mfaCode: "Kode MFA 6 digit",
    signIn: "Masuk",
    forgot: "Lupa kata sandi?",
    loginPrivacy:
      "Sesi berakhir otomatis jika tidak aktif. Setiap login berhasil maupun gagal tercatat di Audit Log.",
    backToSite: "Kembali ke situs",
    resetTitle: "Atur ulang akses.",
    resetCopy:
      "Masukkan email kerja Anda. Jika terdaftar, petunjuk reset yang aman akan dikirim oleh tim.",
    resetSubmit: "Kirim petunjuk",
    cancel: "Batal",
  },
  EN: {
    eyebrow: "RUANGRASA CONTROL CENTRE",
    greeting: "Good morning, Dina. Rara is ready.",
    subheading:
      "Keep an eye on today's story space without intruding on anyone's privacy.",
    sample: "Sample data",
    range: "Last 7 days",
    full: "View report",
    sessions: "Active sessions",
    users: "New users",
    mediation: "Group mediations",
    consent: "Consent recorded",
    compared: "compared with last week",
    sessionTitle: "Latest session activity",
    sessionCopy: "Metadata only — conversation content never appears in lists.",
    allSessions: "View all sessions",
    user: "USER",
    context: "CONTEXT",
    mode: "MODE",
    consentCol: "CONSENT",
    status: "STATUS",
    encrypted: "Encrypted",
    agreed: "Confirmed",
    active: "Active",
    finished: "Finished",
    safetyTitle: "Needs thoughtful attention",
    safetyCopy:
      "3 signals are awaiting a Safety Reviewer. Prioritise context, not assumptions.",
    review: "Review safely",
    raraTitle: "Rara today",
    raraCopy: "All language styles are active and stable.",
    online: "Rara online",
    style: "Most-used style",
    language: "Primary language",
    privacyTitle: "Privacy, protected from the start",
    privacyCopy:
      "WhatsApp numbers always stay masked. Sessions are encrypted and never shared with third parties.",
    access: "As {role}, you can only view this module.",
    placeholder: "This module is being prepared",
    placeholderCopy:
      "Its structure, access controls, and visual foundation are ready for the next stage.",
    back: "Back to Overview",
    demoRole: "View as role (demo)",
    logout: "Log out",
    twofa: "2FA active",
    page: "Page 1 / 2",
    loginEyebrow: "ADMIN SPACE",
    loginTitle: "Sign in to your",
    loginAccent: "admin space.",
    loginIntro:
      "Sign in with your work email and MFA code. For the RuangRasa team only.",
    workEmail: "Work email",
    password: "Password",
    mfaCode: "6-digit MFA code",
    signIn: "Sign in",
    forgot: "Forgot password?",
    loginPrivacy:
      "Sessions end automatically when inactive. Every successful and failed login is recorded in the Audit Log.",
    backToSite: "Back to site",
    resetTitle: "Reset your access.",
    resetCopy:
      "Enter your work email. If it is registered, secure reset instructions will be sent by the team.",
    resetSubmit: "Send instructions",
    cancel: "Cancel",
  },
};

export const sampleSessions: SessionData[] = [
  {
    id: "RR-48213",
    phone: "+62 812-****-3421",
    name: "Ayu",
    context: RELATIONSHIP_CONTEXTS[0],
    mode: "1-on-1",
    language: "Bahasa Indonesia",
    status: "Aktif",
    duration: "24m",
  },
  {
    id: "RR-48207",
    phone: "+62 857-****-9902",
    name: "Dimas",
    context: RELATIONSHIP_CONTEXTS[0],
    mode: "Group mediation",
    language: "Bahasa Indonesia",
    status: "Aktif",
    duration: "41m",
  },
  {
    id: "RR-48190",
    phone: "+62 813-****-1175",
    name: "K.",
    context: RELATIONSHIP_CONTEXTS[1],
    mode: "1-on-1",
    language: "Jaksel mix",
    status: "Krisis",
    duration: "18m",
  },
  {
    id: "RR-48176",
    phone: "+62 821-****-6630",
    name: "Bima",
    context: RELATIONSHIP_CONTEXTS[2],
    mode: "1-on-1",
    language: "English",
    status: "Selesai",
    duration: "32m",
  },
  {
    id: "RR-48151",
    phone: "+62 878-****-2048",
    name: "Sari",
    context: RELATIONSHIP_CONTEXTS[1],
    mode: "Group mediation",
    language: "Bahasa Indonesia",
    status: "Abuse",
    duration: "55m",
  },
  {
    id: "RR-48122",
    phone: "+62 811-****-7719",
    name: "Raka",
    context: RELATIONSHIP_CONTEXTS[0],
    mode: "1-on-1",
    language: "Jaksel mix",
    status: "Selesai",
    duration: "12m",
  },
];

export const transcriptData: Record<string, ChatMessage[]> = {
  "RR-48213": [
    {
      sender: "Rara",
      text: "Hai M•••, aku di sini. Apa yang paling ingin kamu ceritakan hari ini?",
      time: "09:12",
    },
    {
      sender: "User",
      text: "Pacarku belakangan jarang membalas. Aku jadi kepikiran terus.",
      time: "09:14",
    },
    {
      sender: "Rara",
      text: "Kedengarannya ketidakpastian itu cukup menguras energi. Sudah berapa lama pola ini terasa?",
      time: "09:15",
    },
    {
      sender: "User",
      text: "Sekitar dua minggu. Kalau ditanya, jawabnya cuma lagi sibuk.",
      time: "09:17",
    },
    {
      sender: "Rara",
      text: "Kamu ingin didengar tanpa langsung menuduh. Kita bisa susun kalimat yang berangkat dari perasaanmu.",
      time: "09:19",
    },
    {
      sender: "User",
      text: "Boleh. Aku nggak mau terdengar menuntut.",
      time: "09:21",
    },
    {
      sender: "Rara",
      text: "Coba: “Aku merasa jauh akhir-akhir ini dan ingin tahu kapan kita bisa ngobrol dengan tenang.” Gimana rasanya?",
      time: "09:23",
    },
  ],
  "RR-48207": [
    {
      sender: "Rara",
      text: "Terima kasih sudah hadir. Aku akan membantu agar Pihak A dan Pihak B mendapat ruang bicara yang seimbang.",
      time: "14:03",
    },
    {
      sender: "Pihak A",
      text: "Aku merasa semua keputusan selalu dibuat tanpa melibatkanku.",
      time: "14:05",
    },
    {
      sender: "Rara",
      text: "Aku menangkap kebutuhan untuk dilibatkan. Pihak B, boleh ceritakan yang kamu dengar dari pernyataan itu?",
      time: "14:07",
    },
    {
      sender: "Pihak B",
      text: "Dia merasa aku jalan sendiri. Aku sebenarnya takut pembicaraan jadi bertengkar.",
      time: "14:10",
    },
    {
      sender: "Rara",
      text: "Keduanya ingin aman saat mengambil keputusan. Mari sepakati satu cara berhenti sejenak bila tensi naik.",
      time: "14:13",
    },
    {
      sender: "Pihak A",
      text: "Aku setuju kalau kami pakai jeda 10 menit, lalu lanjut.",
      time: "14:15",
    },
    {
      sender: "Pihak B",
      text: "Aku juga setuju, asal kami benar-benar kembali membahasnya.",
      time: "14:17",
    },
  ],
  "RR-48190": [
    {
      sender: "Rara",
      text: "Hai M•••, kedengarannya rumah lagi terasa berat. Aku siap dengerin pelan-pelan.",
      time: "22:08",
    },
    {
      sender: "User",
      text: "Capek banget sama rumah. Kayak nggak ada tempat buat napas.",
      time: "22:10",
    },
    {
      sender: "Rara",
      text: "That sounds really exhausting. Kamu lagi sendirian sekarang atau ada orang yang kamu percaya di dekatmu?",
      time: "22:11",
    },
    {
      sender: "User",
      text: "Sendirian. Kadang mikir mending ilang aja.",
      time: "22:13",
      flag: "Sinyal krisis",
    },
    {
      sender: "Rara",
      text: "Aku peduli sama keselamatanmu. Apakah kamu dalam bahaya langsung saat ini?",
      time: "22:14",
    },
    {
      sender: "User",
      text: "Nggak, aku aman sekarang. Cuma overwhelmed banget.",
      time: "22:16",
    },
    {
      sender: "Rara",
      text: "Terima kasih sudah bilang kamu aman. Rara is not a crisis service. If you're in danger, contact emergency services immediately. In Indonesia: Into The Light, 119 ext. 8. Bisa hubungi satu orang yang kamu percaya sekarang?",
      time: "22:17",
    },
  ],
  "RR-48151": [
    {
      sender: "Rara",
      text: "Aku akan menjaga percakapan ini tetap seimbang. Kita fokus pada kejadian dan kebutuhan masing-masing.",
      time: "18:02",
    },
    {
      sender: "Pihak A",
      text: "Aku sudah berkali-kali mencoba bicara baik-baik.",
      time: "18:04",
    },
    {
      sender: "Pihak B",
      text: "Omong kosong, kamu selalu bikin semuanya jadi masalah!",
      time: "18:06",
      flag: "Bahasa kasar",
    },
    {
      sender: "Rara",
      text: "Aku akan menghentikan sejenak. Kita boleh marah, tapi tidak menyerang pribadi. Bisa ulangi sebagai perasaan atau kebutuhan?",
      time: "18:07",
    },
    {
      sender: "Pihak B",
      text: "Aku merasa tidak pernah cukup didengar.",
      time: "18:10",
    },
    {
      sender: "Pihak A",
      text: "Aku bisa dengar itu. Aku juga ingin didengar tanpa disalahkan.",
      time: "18:12",
    },
    {
      sender: "Rara",
      text: "Ada kebutuhan yang sama: didengar dengan aman. Mari beri masing-masing dua menit tanpa interupsi.",
      time: "18:14",
    },
  ],
  "RR-48176": [
    {
      sender: "Rara",
      text: "What feels hardest at work right now?",
      time: "11:02",
    },
    {
      sender: "User",
      text: "I feel left out of decisions by my team.",
      time: "11:04",
    },
    {
      sender: "Rara",
      text: "That can feel isolating. Was there a recent moment that made it especially clear?",
      time: "11:06",
    },
    {
      sender: "User",
      text: "A project changed and nobody told me.",
      time: "11:08",
    },
    {
      sender: "Rara",
      text: "Would it help to prepare a calm way to ask for a clearer update process?",
      time: "11:09",
    },
    { sender: "User", text: "Yes, that would help.", time: "11:11" },
  ],
  "RR-48122": [
    {
      sender: "Rara",
      text: "What would you like to unpack today?",
      time: "16:21",
    },
    {
      sender: "User",
      text: "Aku bingung cara ngomong soal boundaries.",
      time: "16:22",
    },
    {
      sender: "Rara",
      text: "Valid banget. Boundary mana yang paling urgent buat disampaikan?",
      time: "16:24",
    },
    { sender: "User", text: "Soal waktu sendiri.", time: "16:26" },
    {
      sender: "Rara",
      text: "Kita bisa bikin kalimat yang clear tapi tetap warm.",
      time: "16:27",
    },
    { sender: "User", text: "Okay, let's do that.", time: "16:29" },
  ],
};

export const initialSafetyFlags: SafetyFlag[] = [
  {
    id: "RR-48190",
    sessionId: "SES-7A92",
    name: "K.",
    title: "Sinyal self-harm terdeteksi",
    context: RELATIONSHIP_CONTEXTS[1],
    mode: "1-on-1",
    language: "Jaksel mix",
    severity: "Kritis",
    time: "2 menit lalu",
    duration: "18m",
    status: "baru",
  },
  {
    id: "RR-48151",
    sessionId: "SES-4F18",
    name: "Sari",
    title: "Indikasi abuse verbal di grup",
    context: RELATIONSHIP_CONTEXTS[1],
    mode: "Group mediation",
    language: "Bahasa Indonesia",
    severity: "Tinggi",
    time: "14 menit lalu",
    duration: "55m",
    status: "baru",
  },
  {
    id: "RR-48122",
    sessionId: "SES-9C31",
    name: "Raka",
    title: "Kata kunci kekerasan (konteks fiksi?)",
    context: RELATIONSHIP_CONTEXTS[0],
    mode: "1-on-1",
    language: "Jaksel mix",
    severity: "Sedang",
    time: "1 jam lalu",
    duration: "12m",
    status: "baru",
  },
];

export const initialPlans: PlanData[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    cycle: "Bulanan",
    status: "Aktif",
    sessions: 5,
    duration: 20,
    group: false,
    subscribers: 9278,
    version: 4,
    paid: false,
  },
  {
    id: "monthly",
    name: "Premium Bulanan",
    price: 49000,
    cycle: "Bulanan",
    status: "Draft",
    sessions: 30,
    duration: 60,
    group: true,
    subscribers: 892,
    version: 2,
    paid: true,
  },
  {
    id: "annual",
    name: "Premium Tahunan",
    price: 490000,
    cycle: "Tahunan",
    status: "Draft",
    sessions: 30,
    duration: 60,
    group: true,
    subscribers: 312,
    version: 1,
    paid: true,
  },
];

export const heroPhoto =
  "https://images.unsplash.com/photo-1758525863122-0c0a51d4a946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

export const landingSectionDefs = [
  {
    id: "navbar",
    icon: "navigation",
    name: "Navbar & CTA",
    count: 6,
    en: [
      "How It Works · Meet Rara · Stories · FAQ · My dashboard",
      "Start Talking",
    ],
    idText: [
      "Cara Kerja · Kenalan dengan Rara · Cerita · FAQ · Dashboard saya",
      "Mulai Cerita",
    ],
  },
  {
    id: "hero",
    icon: "web_asset",
    name: "Hero",
    count: 12,
    en: [],
    idText: [],
  },
  {
    id: "problem",
    icon: "insights",
    name: "The quiet problem",
    count: 5,
    en: [
      "Things that rarely get talked about before it breaks.",
      "28% — of people in conflict feel heard",
      "54% — avoid the conversation that matters",
      "72% — just needed someone to listen",
      "Don't let it sit. Talk it through now.",
    ],
    idText: [
      "Hal-hal yang jarang dibicarakan sebelum semuanya retak.",
      "28% — orang dalam konflik merasa didengar",
      "54% — menghindari percakapan yang penting",
      "72% — hanya butuh seseorang untuk mendengar",
      "Jangan dipendam. Bicarakan sekarang.",
    ],
  },
  {
    id: "familiar",
    icon: "format_quote",
    name: "Sound familiar?",
    count: 6,
    en: [
      "The thoughts you keep to yourself.",
      "I don't want to burden my friends again.",
      "Every time I try to talk, it turns into a fight.",
      "I don't even know what I'm feeling anymore.",
      "Therapy feels like too big a step right now.",
      "I need to talk about this now, not next week.",
    ],
    idText: [
      "Pikiran yang kamu simpan sendiri.",
      "Aku tidak mau membebani teman-temanku lagi.",
      "Setiap kali mencoba bicara, ujungnya bertengkar.",
      "Aku bahkan tidak tahu apa yang kurasakan.",
      "Terapi terasa seperti langkah yang terlalu besar sekarang.",
      "Aku perlu membicarakan ini sekarang, bukan minggu depan.",
    ],
  },
  {
    id: "quote",
    icon: "format_quote",
    name: "Pull quote",
    count: 1,
    en: [
      "Sometimes you don't need an answer. You need a calmer place to think.",
    ],
    idText: [
      "Kadang kamu tidak butuh jawaban. Kamu butuh ruang yang lebih tenang untuk berpikir.",
    ],
  },
  {
    id: "meet",
    icon: "auto_awesome",
    name: "Meet Rara",
    count: 7,
    en: [
      "Not a therapist. Not a chatbot. Your thinking partner.",
      "Listens without judgment",
      "Asks one question at a time",
      "Keeps both sides heard",
      "Adapts to your language",
      "Available any time",
      "Knows when safety comes first",
    ],
    idText: [
      "Bukan terapis. Bukan chatbot. Teman berpikirmu.",
      "Mendengar tanpa menghakimi",
      "Bertanya satu per satu",
      "Menjaga kedua pihak tetap didengar",
      "Menyesuaikan bahasamu",
      "Tersedia kapan saja",
      "Mendahulukan keselamatan",
    ],
  },
  {
    id: "style",
    icon: "translate",
    name: "Adaptive Style Mirroring",
    count: 4,
    en: [
      "Rara talks the way you do.",
      "Casual (Jaksel)",
      "Composed (EN)",
      "Formal (ID)",
    ],
    idText: [
      "Rara berbicara seperti caramu berbicara.",
      "Casual (Jaksel)",
      "Composed (EN)",
      "Formal (ID)",
    ],
  },
  {
    id: "how",
    icon: "route",
    name: "How RuangRasa works",
    count: 8,
    en: [
      "How RuangRasa works.",
      "Four steps, under two minutes. No account, no onboarding, no app to install.",
      "1 Choose your context",
      "2 Tell Rara your name",
      "3 Open WhatsApp",
      "4 Talk it through",
      ...RELATIONSHIP_CONTEXTS,
    ],
    idText: [
      "Cara kerja RuangRasa.",
      "Empat langkah, kurang dari dua menit. Tanpa akun, tanpa onboarding, tanpa aplikasi yang perlu dipasang.",
      "1 Pilih konteksmu",
      "2 Beri tahu Rara namamu",
      "3 Buka WhatsApp",
      "4 Bicarakan bersama",
      ...RELATIONSHIP_CONTEXTS,
    ],
  },
  {
    id: "stories",
    icon: "favorite",
    name: "Stories / testimoni",
    count: 3,
    en: [
      "Real conversations. Real shifts.",
      "Ayu · 27 · Romantic conflict · Jakarta",
      "Dimas & Reni · Group mediation · Bandung",
      "K. · 24 · Family conflict · Surabaya",
      "names and identifying details have been changed",
    ],
    idText: [
      "Percakapan nyata. Perubahan nyata.",
      "Ayu · 27 · Konflik romantis · Jakarta",
      "Dimas & Reni · Mediasi grup · Bandung",
      "K. · 24 · Konflik keluarga · Surabaya",
      "nama dan detail identitas telah diubah",
    ],
  },
  {
    id: "comparison",
    icon: "table_chart",
    name: "Comparison table",
    count: 3,
    en: [
      "The support you need, without the barriers.",
      "Venting to friends · RuangRasa (Recommended) · Therapy",
      "Available now · Private by design · Free to start",
    ],
    idText: [
      "Dukungan yang kamu butuhkan, tanpa hambatan.",
      "Curhat ke teman · RuangRasa (Direkomendasikan) · Terapi",
      "Tersedia sekarang · Privasi sejak awal · Gratis untuk mulai",
    ],
  },
  {
    id: "faq",
    icon: "help",
    name: "FAQ",
    count: 6,
    en: [
      "Is Rara a real therapist?",
      "Is my conversation private?",
      "Does it cost anything?",
      "What if I'm in crisis?",
      "Can I use it with the other person?",
      "What languages?",
    ],
    idText: [
      "Apakah Rara terapis sungguhan?",
      "Apakah percakapan saya privat?",
      "Apakah ada biaya?",
      "Bagaimana jika saya dalam krisis?",
      "Bisakah saya menggunakannya bersama orang lain?",
      "Bahasa apa saja?",
    ],
  },
  {
    id: "final",
    icon: "campaign",
    name: "Final CTA",
    count: 2,
    en: ["Ready to talk it through?", "Start Talking — Free"],
    idText: ["Siap membicarakannya?", "Mulai Cerita — Gratis"],
  },
  {
    id: "footer",
    icon: "vertical_align_bottom",
    name: "Footer, legal, disclaimer krisis",
    count: 8,
    en: [
      "A calmer place to think through the relationships that matter most.",
      "Product · How It Works · Meet Rara · Stories · FAQ",
      "Legal · Privacy Policy · Terms of Use · Contact",
      "© 2026 PT. LinkIT360. All rights reserved.",
      "Rara is not a crisis service. If you're in danger, contact emergency services immediately. In Indonesia: Into The Light, 119 ext. 8.",
    ],
    idText: [
      "Ruang yang lebih tenang untuk memikirkan hubungan yang paling berarti.",
      "Produk · Cara Kerja · Kenalan dengan Rara · Cerita · FAQ",
      "Legal · Kebijakan Privasi · Ketentuan Penggunaan · Kontak",
      "© 2026 PT. LinkIT360. Hak cipta dilindungi.",
      "Rara bukan layanan krisis. Jika kamu dalam bahaya, segera hubungi layanan darurat. Di Indonesia: Into The Light, 119 ext. 8.",
    ],
  },
];

export const initialSubscriptions: SubscriptionRow[] = [
  {
    id: "SUB-1042",
    user: "RR-48213",
    name: "Ayu",
    plan: "Premium Bulanan",
    status: "Aktif",
    next: "1 Nov 2026",
  },
  {
    id: "SUB-1041",
    user: "RR-48151",
    name: "Sari",
    plan: "Premium Bulanan",
    status: "Trial",
    next: "14 Okt 2026",
  },
  {
    id: "SUB-1039",
    user: "RR-48126",
    name: "Maya",
    plan: "Premium Tahunan",
    status: "Jatuh tempo",
    next: "7 Okt 2026",
  },
  {
    id: "SUB-1034",
    user: "RR-48190",
    name: "K.",
    plan: "Premium Bulanan",
    status: "Dibatalkan",
    next: "—",
  },
];

export const initialTransactions: TransactionRow[] = [
  {
    id: "TRX-9821",
    time: "7 Okt · 09:42",
    user: "RR-48213 · Ayu",
    amount: "Rp49.000",
    method: "QRIS",
    status: "Berhasil",
    note: "Pembayaran bulanan",
  },
  {
    id: "TRX-9820",
    time: "7 Okt · 09:18",
    user: "RR-48151 · Sari",
    amount: "Rp49.000",
    method: "GoPay",
    status: "Menunggu",
    note: "Menunggu konfirmasi gateway",
  },
  {
    id: "TRX-9818",
    time: "7 Okt · 08:51",
    user: "RR-48126 · Maya",
    amount: "Rp490.000",
    method: "OVO",
    status: "Gagal",
    note: "Saldo tidak cukup · retry otomatis 2/3 besok 09:00",
  },
  {
    id: "TRX-9814",
    time: "6 Okt · 21:10",
    user: "RR-48190 · K.",
    amount: "Rp49.000",
    method: "Virtual Account BCA",
    status: "Berhasil",
    note: "Pembayaran bulanan",
  },
];

export const initialVouchers: VoucherRow[] = [
  ["RASA30", "Diskon 30%", "128 / 500", "31 Des 2026", true],
  ["COBA7", "Trial 7 hari", "87 / 1.000", "30 Nov 2026", true],
  ["MAAF50", "Kompensasi 50%", "14 / 100", "31 Okt 2026", false],
];

export const initialNotificationTemplates: NotificationTemplate[] = [
  {
    id: "welcome",
    name: "Sambutan",
    status: "Disetujui",
    idText:
      "Hai {nama}, aku Rara. Aku di sini untuk dengerin ceritamu, tanpa menghakimi.",
    enText:
      "Hi {nama}, I'm Rara. I'm here to listen to your story, without judgement.",
  },
  {
    id: "reminder",
    name: "Pengingat",
    status: "Menunggu",
    idText: "Hai {nama}, Rara masih ada kalau kamu ingin melanjutkan cerita.",
    enText:
      "Hi {nama}, Rara is still here if you'd like to continue your story.",
  },
  {
    id: "followup",
    name: "Follow-up setelah sesi",
    status: "Disetujui",
    idText:
      "Terima kasih sudah bercerita, {nama}. Semoga harimu terasa sedikit lebih ringan.",
    enText:
      "Thank you for sharing, {nama}. We hope your day feels a little lighter.",
  },
  {
    id: "renewal",
    name: "Perpanjangan plan",
    status: "Draft",
    idText: "Plan {plan} akan diperpanjang pada {tanggal} seharga {harga}.",
    enText: "Your {plan} plan renews on {tanggal} for {harga}.",
  },
  {
    id: "failed",
    name: "Pembayaran gagal",
    status: "Ditolak",
    idText: "Pembayaran {plan} belum berhasil. Periksa kembali melalui {link}.",
    enText: "Your {plan} payment was unsuccessful. Review it at {link}.",
  },
  {
    id: "price",
    name: "Perubahan harga",
    status: "Draft",
    idText:
      "Ada perubahan harga {plan} menjadi {harga}. Lihat detail sebelum menyetujui: {link}",
    enText:
      "The price of {plan} is changing to {harga}. Review the details before accepting: {link}",
  },
];

export const initialNotificationRules: NotificationRule[] = [
  {
    name: "Pengingat",
    trigger: "Tidak aktif selama 5 hari",
    delay: 120,
    frequency: "1× / 7 hari",
    active: true,
  },
  {
    name: "Follow-up setelah sesi",
    trigger: "Sesi selesai",
    delay: 2,
    frequency: "1× / sesi",
    active: true,
  },
  {
    name: "Perpanjangan plan",
    trigger: "3 hari sebelum tagihan",
    delay: 0,
    frequency: "1× / bulan",
    active: false,
  },
  {
    name: "Perubahan harga",
    trigger: "Harga atau plan berbayar diubah",
    delay: 0,
    frequency: "1× / perubahan",
    active: true,
  },
];

export const initialNotificationAlerts: NotificationAlert[] = [
  {
    event: "Sesi krisis terdeteksi",
    severity: "Kritis",
    channels: [true, true, true, true],
    roles: ["Super Admin", "Safety Reviewer"],
  },
  {
    event: "Lonjakan flag safety",
    severity: "Tinggi",
    channels: [true, true, true, false],
    roles: ["Super Admin", "Product/Ops", "Safety Reviewer"],
  },
  {
    event: "Template ditolak WhatsApp",
    severity: "Sedang",
    channels: [true, true, false, false],
    roles: ["Product/Ops", "Content Editor"],
  },
  {
    event: "Pembayaran bermasalah",
    severity: "Sedang",
    channels: [true, true, false, false],
    roles: ["Super Admin", "Finance/Billing"],
  },
  {
    event: "Error sistem",
    severity: "Tinggi",
    channels: [true, true, true, false],
    roles: ["Super Admin", "Product/Ops"],
  },
];

export const notificationVariables = [
  "{nama}",
  "{plan}",
  "{tanggal}",
  "{harga}",
  "{link}",
];

export const notificationLogs = [
  [
    "7 Okt · 10:42",
    "Sambutan",
    "RR-48213 · +62 812-****-3421",
    "Bahasa Indonesia",
    "Dibaca",
    "Dibaca 10:44",
  ],
  [
    "7 Okt · 10:18",
    "Follow-up setelah sesi",
    "RR-48207 · +62 857-****-9902",
    "Bahasa Indonesia",
    "Terkirim",
    "Menunggu dibaca",
  ],
  [
    "7 Okt · 09:51",
    "Pengingat",
    "RR-48190 · +62 813-****-1175",
    "Jaksel mix",
    "Gagal",
    "Nomor tidak terdaftar di WhatsApp",
  ],
  [
    "7 Okt · 09:20",
    "Sambutan",
    "RR-48176 · +62 821-****-6630",
    "English",
    "Dibaca",
    "Dibaca 09:23",
  ],
  [
    "7 Okt · 08:44",
    "Pembayaran gagal",
    "RR-48151 · +62 878-****-2048",
    "Bahasa Indonesia",
    "Terkirim",
    "Menunggu dibaca",
  ],
];

export const initialRaraChat: Array<[string, string]> = [
  ["user", "gila sih dia tiba2 block aku tanpa bilang apa2"],
  [
    "rara",
    "aduh parah banget, tiba-tiba di-block gitu tanpa penjelasan — itu nyakitin banget, wajar kamu bingung. udah lama kalian deket?",
  ],
];

export const initialTeam: TeamMember[] = [
  {
    name: "Dina",
    email: "dina@ruangrasa.id",
    role: "Product/Ops",
    mfa: true,
    lastLogin: "7 Okt 2026 · 10:42",
  },
  {
    name: "Raka",
    email: "raka@ruangrasa.id",
    role: "Super Admin",
    mfa: true,
    lastLogin: "7 Okt 2026 · 09:31",
  },
  {
    name: "Maya",
    email: "maya@ruangrasa.id",
    role: "Safety Reviewer",
    mfa: true,
    lastLogin: "7 Okt 2026 · 08:18",
  },
  {
    name: "Eko",
    email: "eko@ruangrasa.id",
    role: "Content Editor",
    mfa: false,
    lastLogin: "6 Okt 2026 · 16:04",
  },
  {
    name: "Nadia",
    email: "nadia@ruangrasa.id",
    role: "Analyst",
    mfa: true,
    lastLogin: "6 Okt 2026 · 13:22",
  },
  {
    name: "Sari K.",
    email: "sari.k@ruangrasa.id",
    role: "Finance/Billing",
    mfa: true,
    lastLogin: "5 Okt 2026 · 11:09",
  },
];

export const initialIntegrations: Integration[] = [
  {
    id: "whatsapp",
    icon: "chat",
    name: "WhatsApp Business",
    description: "Pesan Rara, template, dan status pengiriman.",
    descriptionEN: "Rara messages, templates, and delivery status.",
    status: "Terhubung",
    tone: "success",
  },
  {
    id: "payment",
    icon: "payments",
    name: "Payment gateway",
    description: "Gateway belum dipilih.",
    descriptionEN: "No gateway selected.",
    status: "Belum dihubungkan",
    tone: "neutral",
  },
  {
    id: "rara",
    icon: "auto_awesome",
    name: "Mesin Rara (AI)",
    description: "Model percakapan, guardrail, dan evaluasi.",
    descriptionEN: "Conversation model, guardrails, and evaluation.",
    status: "Terhubung",
    tone: "success",
  },
  {
    id: "email",
    icon: "mail",
    name: "Email",
    description: "Undangan admin dan peringatan operasional.",
    descriptionEN: "Admin invitations and operational alerts.",
    status: "Terhubung",
    tone: "success",
  },
  {
    id: "slack",
    icon: "tag",
    name: "Slack",
    description: "Peringatan Safety dan sistem internal.",
    descriptionEN: "Safety alerts and internal system notifications.",
    status: "Perlu otorisasi ulang",
    tone: "warning",
  },
  {
    id: "site",
    icon: "language",
    name: "Situs LP ruangrasa.id",
    nameEN: "Landing site ruangrasa.id",
    description: "Sinkronisasi konten landing dan disclaimer.",
    descriptionEN: "Landing content and disclaimer synchronisation.",
    status: "Terhubung",
    tone: "success",
  },
];

export const permissionMatrixRows: Array<[string, string, Access[]]> = [
  ["Overview", "Overview", ["F", "F", "R", "R", "R", "R"]],
  ["Pengguna", "Users", ["F", "F", "—", "M", "—", "M"]],
  ["Sesi (metadata)", "Sessions (metadata)", ["F", "R", "—", "R", "—", "—"]],
  [
    "Sesi (isi chat)",
    "Sessions (chat content)",
    ["F", "—", "—", "F", "—", "—"],
  ],
  ["Safety & Krisis", "Safety & Crisis", ["F", "R", "—", "F", "—", "—"]],
  ["Konfigurasi Rara", "Rara Configuration", ["F", "F", "R", "R", "—", "—"]],
  ["Plan & Langganan", "Plans & Subscriptions", ["F", "R", "—", "—", "—", "F"]],
  ["Notifikasi", "Notifications", ["F", "F", "F", "R", "—", "R"]],
  ["Analytics", "Analytics", ["F", "R", "R", "R", "R", "R"]],
  ["Konten Landing", "Landing Content", ["F", "R", "F", "—", "—", "—"]],
  ["Audit Log", "Audit Log", ["F", "R", "—", "—", "—", "—"]],
  ["Pengaturan", "Settings", ["F", "—", "—", "—", "—", "—"]],
];

export const landingTrustChecklist = [
  "No app download needed",
  "End-to-end encrypted",
  "English & Bahasa Indonesia",
  "Opens in WhatsApp instantly",
  "Free to start",
  "1-on-1 & group mediation",
];

export const initialHeroEN: LandingHeroContent = {
  eyebrow: "AI Relationship Companion",
  headline: "Someone to talk to. No judgment. Just help.",
  subheadline:
    "Rara listens, asks the right questions, and helps you see things more clearly — through WhatsApp, anytime you need it.",
  cta: "Start Talking",
  secondary: "Mediate Together",
  stat1: "24/7 — Always open",
  stat2: "Free — To start",
  stat3: "0 — Downloads",
  floating1: "Rara is listening",
  floating2: "No judgment · Open 24/7",
  phone: "+62 812-0000-3636",
  prefilled: "Hi Rara, I want to start talking.",
};

export const initialHeroID: LandingHeroContent = {
  eyebrow: "Teman Relasi AI",
  headline: "Seseorang untuk bicara. Tanpa menghakimi. Hanya membantu.",
  subheadline:
    "Rara mendengar, menanyakan hal yang tepat, dan membantumu berpikir jernih — lewat WhatsApp, kapan pun dibutuhkan.",
  cta: "Mulai Cerita",
  secondary: "Mediasi Bersama",
  stat1: "24/7 — Selalu terbuka",
  stat2: "Gratis — Untuk mulai",
  stat3: "0 — Unduhan",
  floating1: "Rara sedang mendengar",
  floating2: "Tanpa menghakimi · Buka 24/7",
  phone: "+62 812-0000-3636",
  prefilled: "Hai Rara, aku ingin mulai cerita.",
};
