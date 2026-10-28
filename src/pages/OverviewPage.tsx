import { message } from "../locales";
import { localized } from "../i18n";

import {
  AccessBanner,
  Badge,
  Button,
  Icon,
  KpiCard,
  PageTitle,
} from "../components/ui";

import { RELATIONSHIP_CONTEXTS, copy } from "../data/mock/index";

import { Access, Language, Role } from "../types/index";

export function Overview({
  language,
  role,
  access,
}: {
  language: Language;
  role: Role;
  access: Access;
}) {
  const currentDate = new Intl.DateTimeFormat(
    message(language, "pages.OverviewPage.001"),
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date());
  const t = localized(
    language,
    {
      title: "Selamat pagi,",
      accent: "tim RuangRasa.",
      subtitle: `Ringkasan hari ini, ${currentDate}.`,
      range: "30 hari terakhir",
      activeNow: "Sesi aktif sekarang",
      newToday: "Sesi baru hari ini",
      completion: "Rasio sesi selesai",
      openFlags: "Flag terbuka",
      groupSessions: "Sesi grup",
      criticalDetail: "1 Kritis · median review 9 menit",
      neutral: "dari seluruh sesi",
      sevenDays: "Sesi 7 hari",
      funnel: "Funnel",
      visits: "Kunjungan LP",
      startClick: "Klik “Mulai Cerita”",
      choose: "Pilih konteks",
      name: "Beri nama",
      whatsapp: "Buka WhatsApp",
      consent: "Sesi dimulai (consent)",
      completed: "Sesi selesai",
      contexts: "Konteks hubungan",
      languages: "Bahasa",
      waiting: "Safety menunggu penanganan",
      subscriptions: "Langganan",
      critical: "Kritis",
      high: "Tinggi",
      medium: "Sedang",
      active: "Aktif",
      trial: "Trial",
      overdue: "Jatuh tempo",
      system: "Status sistem",
      normal: "Normal",
      delayed: "Tertunda",
      queue: "Antrean pesan",
      model: "Model Rara",
      privacy:
        "Ringkasan ini hanya menampilkan data agregat. Nomor hanya digunakan untuk menemukan sesi dan tidak pernah ditampilkan penuh. Sesi disimpan terenkripsi, tidak dibagikan kepada pihak ketiga, dan consent diminta di awal setiap sesi.",
    },
    {
      title: "Good morning,",
      accent: "RuangRasa team.",
      subtitle: `Today's summary, ${currentDate}.`,
      range: "Last 30 days",
      activeNow: "Active sessions now",
      newToday: "New sessions today",
      completion: "Session completion rate",
      openFlags: "Open flags",
      groupSessions: "Group sessions",
      criticalDetail: "1 Critical · median review 9 minutes",
      neutral: "of all sessions",
      sevenDays: "7-day sessions",
      funnel: "Funnel",
      visits: "Landing visits",
      startClick: "Click “Start Talking”",
      choose: "Choose context",
      name: "Tell us a name",
      whatsapp: "Open WhatsApp",
      consent: "Session started (consent)",
      completed: "Session completed",
      contexts: "Relationship contexts",
      languages: "Languages",
      waiting: "Safety awaiting review",
      subscriptions: "Subscriptions",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      active: "Active",
      trial: "Trial",
      overdue: "Overdue",
      system: "System status",
      normal: "Normal",
      delayed: "Delayed",
      queue: "Message queue",
      model: "Rara model",
      privacy:
        "This summary only shows aggregate data. Your number is only used to find your sessions. It is never shown in full. Sessions are stored encrypted and never shared with third parties. Consent is requested at the start of every session.",
    },
  );
  const funnelValues = message(language, "pages.OverviewPage.002");
  const funnel = [
    t.visits,
    t.startClick,
    t.choose,
    t.name,
    t.whatsapp,
    t.consent,
    t.completed,
  ].map((label, index) => [label, funnelValues[index]]);
  const safety = [
    [
      t.critical,
      "crisis",
      message(language, "pages.OverviewPage.003"),
      "RR-48190",
      "SES-7A92",
      "4 min",
    ],
    [
      t.high,
      "high",
      message(language, "pages.OverviewPage.004"),
      "RR-48151",
      "SES-4F18",
      "11 min",
    ],
    [
      t.medium,
      "medium",
      message(language, "pages.OverviewPage.005"),
      "RR-48122",
      "SES-9C31",
      "18 min",
    ],
  ];
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="overview-heading">
        <div>
          <PageTitle eyebrow="OVERVIEW" title={t.title} accent={t.accent} />
          <p className="overview-subtitle">{t.subtitle}</p>
        </div>
        <Button>
          <Icon>calendar_today</Icon>
          {t.range}
          <Icon>expand_more</Icon>
        </Button>
      </section>

      <section className="kpi-grid kpi-grid--five">
        <KpiCard value="128" label={t.activeNow} detail="12%" />
        <KpiCard value="412" label={t.newToday} detail="8%" />
        <KpiCard value="71%" label={t.completion} detail="3 pts" />
        <KpiCard
          value="3"
          label={t.openFlags}
          detail={t.criticalDetail}
          danger
        />
        <KpiCard
          value="18%"
          label={t.groupSessions}
          detail={t.neutral}
          neutral
        />
      </section>

      <section className="dashboard-row dashboard-row--charts">
        <article className="card dashboard-card weekly-card">
          <div className="dashboard-card__heading">
            <h2>{t.sevenDays}</h2>
            <Badge>{copy[language].sample}</Badge>
          </div>
          <div className="bar-chart" aria-label={t.sevenDays}>
            {Array.from({ length: 7 }, (_, index) => (
              <div className="bar-column" key={index}>
                <span className={`bar bar--${index + 1}`}>
                  <i>{[318, 402, 356, 487, 421, 536, 449][index]}</i>
                </span>
                <b>{["S", "S", "R", "K", "J", "S", "M"][index]}</b>
              </div>
            ))}
          </div>
        </article>
        <article className="card dashboard-card funnel-card">
          <div className="dashboard-card__heading">
            <h2>{t.funnel}</h2>
            <Badge>{copy[language].sample}</Badge>
          </div>
          <ol className="funnel-list">
            {funnel.map(([label, value], index) => (
              <li key={label}>
                <span>
                  <b>{label}</b>
                  <strong>{value}</strong>
                </span>
                <i className={`funnel-fill funnel-fill--${index + 1}`} />
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="dashboard-row dashboard-row--split">
        <article className="card dashboard-card">
          <div className="dashboard-card__heading">
            <h2>{t.contexts}</h2>
            <Badge>{copy[language].sample}</Badge>
          </div>
          <div className="donut-layout">
            <div className="donut" aria-label="52%, 31%, 17%">
              <svg viewBox="0 0 42 42" role="img">
                <circle className="donut-track" cx="21" cy="21" r="15.9" />
                <circle
                  className="donut-segment donut-segment--one"
                  cx="21"
                  cy="21"
                  r="15.9"
                />
                <circle
                  className="donut-segment donut-segment--two"
                  cx="21"
                  cy="21"
                  r="15.9"
                />
                <circle
                  className="donut-segment donut-segment--three"
                  cx="21"
                  cy="21"
                  r="15.9"
                />
              </svg>
              <strong>100%</strong>
            </div>
            <ul className="legend-list">
              <li>
                <i className="legend-amber" />
                <span>{RELATIONSHIP_CONTEXTS[0]}</span>
                <b>52%</b>
              </li>
              <li>
                <i className="legend-brown" />
                <span>{RELATIONSHIP_CONTEXTS[1]}</span>
                <b>31%</b>
              </li>
              <li>
                <i className="legend-muted" />
                <span>{RELATIONSHIP_CONTEXTS[2]}</span>
                <b>17%</b>
              </li>
            </ul>
          </div>
        </article>
        <article className="card dashboard-card">
          <div className="dashboard-card__heading">
            <h2>{t.languages}</h2>
            <Badge>{copy[language].sample}</Badge>
          </div>
          <div className="language-bars">
            {[
              ["Bahasa Indonesia", "48%", "language-fill--one"],
              ["Jaksel mix", "36%", "language-fill--two"],
              ["English", "16%", "language-fill--three"],
            ].map(([label, value, className]) => (
              <div key={label}>
                <span>
                  <b>{label}</b>
                  <strong>{value}</strong>
                </span>
                <i>
                  <u className={className} />
                </i>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-row dashboard-row--safety">
        <article className="card dashboard-card">
          <div className="dashboard-card__heading">
            <h2>{t.waiting}</h2>
            <Badge tone="danger">
              <Icon>shield</Icon>3
            </Badge>
          </div>
          <div className="safety-list">
            {safety.map(([severity, tone, title, userId, sessionId, time]) => (
              <div className="safety-row" key={userId}>
                <Badge tone={tone === "crisis" ? "danger" : "warning"}>
                  {severity}
                </Badge>
                <div>
                  <strong>{title}</strong>
                  <span>
                    {userId}
                    <small>{sessionId}</small>
                  </span>
                </div>
                <time>{time}</time>
                <Icon>chevron_right</Icon>
              </div>
            ))}
          </div>
        </article>
        <article className="card dashboard-card">
          <div className="dashboard-card__heading">
            <h2>{t.subscriptions}</h2>
            <Badge>{copy[language].sample}</Badge>
          </div>
          <div className="subscription-total">
            <strong>1.114</strong>
            <span>{message(language, "pages.OverviewPage.006")}</span>
            <Badge>{message(language, "pages.OverviewPage.007")}</Badge>
          </div>
          <div className="subscription-bar">
            <i />
            <i />
            <i />
          </div>
          <div className="subscription-stats">
            <div>
              <i className="is-success" />
              <span>{t.active}</span>
              <b>1.004</b>
            </div>
            <div>
              <i className="is-amber" />
              <span>{t.trial}</span>
              <b>87</b>
            </div>
            <div>
              <i className="is-danger" />
              <span>{t.overdue}</span>
              <b>23</b>
            </div>
          </div>
        </article>
      </section>

      <section className="card dashboard-card system-card">
        <div className="dashboard-card__heading">
          <h2>{t.system}</h2>
          <span className="system-updated">
            {message(language, "pages.OverviewPage.008")}
          </span>
        </div>
        <div className="system-grid">
          <div>
            <span className="system-icon whatsapp-icon">
              <Icon>chat</Icon>
            </span>
            <b>WhatsApp API</b>
            <Badge tone="success">
              <i />
              {t.normal}
            </Badge>
          </div>
          <div>
            <span className="system-icon">
              <Icon>auto_awesome</Icon>
            </span>
            <b>{t.model}</b>
            <Badge tone="success">
              <i />
              {t.normal} · {message(language, "pages.OverviewPage.009")}
            </Badge>
          </div>
          <div>
            <span className="system-icon warning-icon">
              <Icon>schedule</Icon>
            </span>
            <b>{t.queue}</b>
            <Badge tone="warning">
              <Icon>warning</Icon>
              {t.delayed} 4
            </Badge>
          </div>
        </div>
      </section>

      <div className="privacy-card overview-privacy">
        <Icon>lock</Icon>
        <p>{t.privacy}</p>
        <Badge>
          <Icon>encrypted</Icon>
          {copy[language].encrypted}
        </Badge>
      </div>
    </>
  );
}

export default Overview;
