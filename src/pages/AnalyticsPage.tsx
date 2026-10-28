import { message } from "../locales";
import { useState } from "react";

import { BillingActionDialog } from "../components/dialogs";

import { AccessBanner, Badge, Button, Icon, PageTitle } from "../components/ui";

import { CONTEXT_METRICS, copy } from "../data/mock/index";

import { Access, Language, Role } from "../types/index";

export function AnalyticsPage({
  language,
  role,
  access,
  onAudit,
}: {
  language: Language;
  role: Role;
  access: Access;
  onAudit: (action: string, object: string, reason: string) => void;
}) {
  const [range, setRange] = useState("30");
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const t = message(language, "pages.AnalyticsPage.001");
  const funnel = message(language, "pages.AnalyticsPage.002");
  function exportCsv(reason: string) {
    const csv =
      "metric,value\n7_day_retention,34%\naverage_duration,26m\ngroup_mode,18%\npost_session_rating,4.6\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `ruangrasa-analytics-${range}-hari.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onAudit("Mengekspor Analytics CSV", `${range} hari`, reason);
    setExportOpen(false);
    setToast(message(language, "pages.AnalyticsPage.003"));
    window.setTimeout(() => setToast(""), 3200);
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="analytics-heading">
        <div>
          <PageTitle
            eyebrow="ANALYTICS"
            title="Analytics &"
            accent="Insight."
          />
          <p>{t.subtitle}</p>
        </div>
        <div>
          <label className="date-range">
            <Icon>calendar_today</Icon>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="7">
                {message(language, "pages.AnalyticsPage.004")}
              </option>
              <option value="30">
                {message(language, "pages.AnalyticsPage.005")}
              </option>
              <option value="90">
                {message(language, "pages.AnalyticsPage.006")}
              </option>
            </select>
            <Icon>expand_more</Icon>
          </label>
          <Button disabled={access !== "F"} onClick={() => setExportOpen(true)}>
            <Icon>download</Icon>
            {t.export}
          </Button>
        </div>
      </section>
      <section className="analytics-kpis">
        {[
          [t.retention, "34%", "repeat"],
          [t.duration, "26m", "schedule"],
          [t.group, "18%", "diversity_3"],
          [t.rating, "4,6", "star"],
        ].map(([label, value, icon]) => (
          <article className="card analytics-kpi" key={label}>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
            <Icon>{icon}</Icon>
          </article>
        ))}
      </section>
      <section className="analytics-grid">
        <article className="card analytics-card analytics-trend">
          <div className="analytics-card__heading">
            <div>
              <h2>{t.daily}</h2>
              <p>{message(language, "pages.AnalyticsPage.007")}</p>
            </div>
            <Badge>{copy[language].sample}</Badge>
          </div>
          <div className="trend-legend">
            <span>
              <i className="is-session" />
              {t.sessions}
            </span>
            <span>
              <i className="is-new" />
              {t.newUsers}
            </span>
            <span>
              <i className="is-active" />
              {t.activeUsers}
            </span>
          </div>
          <div className="grouped-chart">
            {["S", "S", "R", "K", "J", "S", "M"].map((day, index) => (
              <div
                className={`grouped-day grouped-day--${index + 1}`}
                key={`${day}-${index}`}
              >
                <div>
                  <i />
                  <i />
                  <i />
                </div>
                <span>{day}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="card analytics-card analytics-funnel">
          <div className="analytics-card__heading">
            <div>
              <h2>{t.activation}</h2>
              <p>{message(language, "pages.AnalyticsPage.008")}</p>
            </div>
          </div>
          <ol>
            {funnel.map(([label, value], index) => (
              <li key={label}>
                <div>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
                <i
                  className={`activation-fill activation-fill--${index + 1}`}
                />
              </li>
            ))}
          </ol>
        </article>
        <article className="card analytics-card">
          <div className="analytics-card__heading">
            <h2>{t.language}</h2>
          </div>
          <div className="analytics-bars">
            {[
              ["Bahasa Indonesia", "48%", "bar-value--48"],
              ["Jaksel mix", "36%", "bar-value--36"],
              ["English", "16%", "bar-value--16"],
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
        <article className="card analytics-card">
          <div className="analytics-card__heading">
            <h2>{t.contexts}</h2>
          </div>
          <div className="context-metrics">
            {CONTEXT_METRICS.map(([label, value, className]) => (
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
        <article className="card analytics-card">
          <div className="analytics-card__heading">
            <h2>{t.modes}</h2>
          </div>
          <div className="mode-ratio">
            <div className="mode-donut">
              <svg viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.9" />
                <circle className="mode-segment-one" cx="21" cy="21" r="15.9" />
                <circle className="mode-segment-two" cx="21" cy="21" r="15.9" />
              </svg>
              <strong>82%</strong>
            </div>
            <div>
              <p>
                <i className="is-one" />
                <span>1-on-1</span>
                <b>82%</b>
              </p>
              <p>
                <i className="is-group" />
                <span>Group mediation</span>
                <b>18%</b>
              </p>
            </div>
          </div>
        </article>
        <article className="card analytics-card safety-analytics">
          <div className="analytics-card__heading">
            <h2>{t.safety}</h2>
          </div>
          <div className="safety-metric-row">
            <div>
              <span>{message(language, "pages.AnalyticsPage.009")}</span>
              <strong>0,7%</strong>
              <small>−0,1 pts</small>
            </div>
            <div>
              <span>{message(language, "pages.AnalyticsPage.010")}</span>
              <strong>9m</strong>
              <small>−2m</small>
            </div>
          </div>
          <div className="severity-bars">
            <div>
              <span>Kritis</span>
              <i>
                <u className="severity-critical" />
              </i>
              <b>8%</b>
            </div>
            <div>
              <span>Tinggi</span>
              <i>
                <u className="severity-high" />
              </i>
              <b>31%</b>
            </div>
            <div>
              <span>Sedang</span>
              <i>
                <u className="severity-medium" />
              </i>
              <b>61%</b>
            </div>
          </div>
        </article>
        <article className="card analytics-card subscription-analytics">
          <div className="analytics-card__heading">
            <h2>{t.subscriptions}</h2>
            <Badge>{message(language, "pages.AnalyticsPage.011")}</Badge>
          </div>
          <div>
            {[
              [t.conversion, "8,4%", "+1,2 pts"],
              [t.churn, "2,1%", "−0,4 pts"],
              [t.revenue, "Rp49,2 jt", "+6,8%"],
            ].map(([label, value, delta]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{delta}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="card analytics-card topics-card">
          <div className="analytics-card__heading">
            <div>
              <h2>{t.topics}</h2>
              <p>{message(language, "pages.AnalyticsPage.012")}</p>
            </div>
            <Badge>
              <Icon>privacy_tip</Icon>
              {t.threshold}
            </Badge>
          </div>
          <div className="topic-list">
            {[
              ["Komunikasi terputus", "24%", "topic-fill--24"],
              ["Kecemburuan/kepercayaan", "18%", "topic-fill--18"],
              ["Ekspektasi keluarga", "15%", "topic-fill--15"],
              ["Batasan di tempat kerja", "11%", "topic-fill--11"],
            ].map(([label, value, className], index) => (
              <div key={label}>
                <span className="topic-rank">0{index + 1}</span>
                <b>{label}</b>
                <i>
                  <u className={className} />
                </i>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
      <div className="privacy-card analytics-privacy">
        <Icon>lock</Icon>
        <p>{message(language, "pages.AnalyticsPage.013")}</p>
        <Badge>
          <Icon>verified_user</Icon>
          {message(language, "pages.AnalyticsPage.014")}
        </Badge>
      </div>
      {exportOpen && (
        <BillingActionDialog
          title={message(language, "pages.AnalyticsPage.015")}
          object={`${range} ${message(language, "pages.AnalyticsPage.016")}`}
          language={language}
          onClose={() => setExportOpen(false)}
          onConfirm={exportCsv}
        />
      )}
      {toast && (
        <div className="toast">
          <Icon>check_circle</Icon>
          {toast}
        </div>
      )}
    </>
  );
}

export default AnalyticsPage;
