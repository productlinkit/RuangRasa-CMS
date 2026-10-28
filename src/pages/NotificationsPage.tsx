import { message } from "../locales";
import { usePersistentState } from "../hooks/usePersistentState";
import { localized } from "../i18n";
import { useState } from "react";

import { TestSendDialog } from "../components/dialogs";

import {
  AccessBanner,
  Badge,
  Button,
  Icon,
  PageTitle,
  Toggle,
  localizeStatus,
} from "../components/ui";

import {
  copy,
  initialNotificationAlerts,
  initialNotificationRules,
  initialNotificationTemplates,
  notificationLogs,
  notificationVariables,
  roles,
} from "../data/mock/index";

import { Access, Language, Role, TemplateStatus } from "../types/index";

export function NotificationsPage({
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
  const editable =
    access === "F" && role !== "Safety Reviewer" && role !== "Finance/Billing";
  const [tab, setTab] = useState<"templates" | "rules" | "logs" | "alerts">(
    "templates",
  );
  const [templateView, setTemplateView] = useState<
    "list" | "editor" | "preview"
  >("list");
  const [templates, setTemplates] = usePersistentState(
    "ruangrasa.notifications.templates",
    initialNotificationTemplates,
  );
  const [selectedId, setSelectedId] = useState("welcome");
  const [contentLanguage, setContentLanguage] = useState<Language>("ID");
  const [testOpen, setTestOpen] = useState(false);
  const [ruleRows, setRuleRows] = usePersistentState(
    "ruangrasa.notifications.ruleRows",
    initialNotificationRules,
  );
  const [quiet, setQuiet] = usePersistentState(
    "ruangrasa.notifications.quiet",
    true,
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [alerts, setAlerts] = usePersistentState(
    "ruangrasa.notifications.alerts",
    initialNotificationAlerts,
  );
  const [onCall, setOnCall] = usePersistentState(
    "ruangrasa.notifications.onCall",
    true,
  );
  const [toast, setToast] = useState("");
  const selected = templates.find((template) => template.id === selectedId)!;
  const variables = notificationVariables;
  const logs = notificationLogs;
  const tabs = message(language, "pages.NotificationsPage.001");
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  function updateTemplate(text: string) {
    if (!editable) return;
    setTemplates((items) =>
      items.map((item) =>
        item.id !== selected.id
          ? item
          : {
              ...item,
              status: item.status === "Disetujui" ? "Draft" : item.status,
              [contentLanguage === "ID" ? "idText" : "enText"]: text,
            },
      ),
    );
  }
  const currentText =
    contentLanguage === "ID" ? selected.idText : selected.enText;
  const preview = currentText
    .replace(/\{nama\}/g, "Ayu")
    .replace(/\{plan\}/g, "Premium Bulanan")
    .replace(/\{tanggal\}/g, "10 Okt 2026")
    .replace(/\{harga\}/g, "Rp49.000")
    .replace(/\{link\}/g, "ruangrasa.id/info");
  function tone(
    status: TemplateStatus,
  ): "success" | "warning" | "danger" | "neutral" {
    return status === "Disetujui"
      ? "success"
      : status === "Menunggu"
        ? "warning"
        : status === "Ditolak"
          ? "danger"
          : "neutral";
  }
  function toggleAlert(rowIndex: number, channelIndex: number) {
    if (!editable || (rowIndex === 0 && channelIndex === 0)) return;
    setAlerts((items) =>
      items.map((item, index) =>
        index !== rowIndex
          ? item
          : {
              ...item,
              channels: item.channels.map((value, channel) =>
                channel === channelIndex ? !value : value,
              ),
            },
      ),
    );
  }
  function toggleRole(rowIndex: number, recipient: Role) {
    if (!editable) return;
    setAlerts((items) =>
      items.map((item, index) => {
        if (index !== rowIndex) return item;
        const exists = item.roles.includes(recipient);
        if (rowIndex === 0 && exists && item.roles.length === 1) return item;
        return {
          ...item,
          roles: exists
            ? item.roles.filter((roleName) => roleName !== recipient)
            : [...item.roles, recipient],
        };
      }),
    );
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="notifications-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.NotificationsPage.002")}
            title={message(language, "pages.NotificationsPage.003")}
            accent={message(language, "pages.NotificationsPage.004")}
          />
          <p>{message(language, "pages.NotificationsPage.005")}</p>
        </div>
        <Badge>{copy[language].sample}</Badge>
      </section>
      <div className="notification-tabs">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            className={tab === value ? "is-active" : ""}
            onClick={() => setTab(value as typeof tab)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "templates" && (
        <>
          <div className="template-mobile-tabs">
            {[
              ["list", message(language, "pages.NotificationsPage.006")],
              ["editor", "Editor"],
              ["preview", message(language, "pages.NotificationsPage.007")],
            ].map(([value, label]) => (
              <button
                key={value}
                className={templateView === value ? "is-active" : ""}
                onClick={() => setTemplateView(value as typeof templateView)}
              >
                {label}
              </button>
            ))}
          </div>
          <section className={`template-layout template-view-${templateView}`}>
            <aside className="card template-list">
              <div className="template-list__heading">
                <h2>{message(language, "pages.NotificationsPage.008")}</h2>
                <span>{templates.length}</span>
              </div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  className={selectedId === template.id ? "is-active" : ""}
                  onClick={() => {
                    setSelectedId(template.id);
                    setTemplateView("editor");
                  }}
                >
                  <div>
                    <strong>{template.name}</strong>
                    <Badge tone={tone(template.status)}>
                      {localizeStatus(language, template.status)}
                    </Badge>
                  </div>
                  <Icon>chevron_right</Icon>
                  {template.status === "Ditolak" && (
                    <span className="rejection-note">
                      <Icon>error</Icon>
                      {message(language, "pages.NotificationsPage.009")}
                    </span>
                  )}
                </button>
              ))}
            </aside>
            <article className="card template-editor">
              <div className="template-editor__heading">
                <div>
                  <span>
                    {message(language, "pages.NotificationsPage.010")}
                  </span>
                  <h2>{selected.name}</h2>
                </div>
                <Badge tone={tone(selected.status)}>
                  {localizeStatus(language, selected.status)}
                </Badge>
              </div>
              {selected.status === "Ditolak" && (
                <div className="template-rejected">
                  <Icon>error</Icon>
                  <div>
                    <strong>
                      {message(language, "pages.NotificationsPage.011")}
                    </strong>
                    <span>
                      {message(language, "pages.NotificationsPage.012")}
                    </span>
                  </div>
                </div>
              )}
              <div className="template-controls">
                <div className="language-toggle">
                  {(["ID", "EN"] as Language[]).map((item) => (
                    <button
                      key={item}
                      className={contentLanguage === item ? "is-active" : ""}
                      onClick={() => setContentLanguage(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <Badge tone="success">
                  <Icon>check_circle</Icon>
                  {message(language, "pages.NotificationsPage.013")}
                </Badge>
              </div>
              <label className="template-field">
                <span>{message(language, "pages.NotificationsPage.014")}</span>
                <textarea
                  disabled={!editable}
                  value={currentText}
                  onChange={(event) => updateTemplate(event.target.value)}
                />
              </label>
              <div className="variable-row">
                <span>{message(language, "pages.NotificationsPage.015")}</span>
                <div>
                  {variables.map((variable) => (
                    <button
                      key={variable}
                      disabled={!editable}
                      onClick={() =>
                        updateTemplate(
                          `${currentText}${currentText.endsWith(" ") ? "" : " "}${variable}`,
                        )
                      }
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>
              <div className="whatsapp-preview">
                <span>{message(language, "pages.NotificationsPage.016")}</span>
                <div>
                  <p>{preview}</p>
                  <time>10:42 ✓✓</time>
                </div>
              </div>
              <footer className="template-actions">
                <Button disabled={!editable} onClick={() => setTestOpen(true)}>
                  <Icon>send</Icon>
                  {message(language, "pages.NotificationsPage.017")}
                </Button>
                <Button
                  disabled={!editable}
                  onClick={() => {
                    setTemplates((items) =>
                      items.map((item) =>
                        item.id === selected.id
                          ? { ...item, status: "Draft" }
                          : item,
                      ),
                    );
                    showToast(message(language, "pages.NotificationsPage.018"));
                  }}
                >
                  <Icon>save</Icon>
                  {message(language, "pages.NotificationsPage.019")}
                </Button>
                <button
                  className="whatsapp-button"
                  disabled={
                    !editable ||
                    selected.status === "Disetujui" ||
                    selected.status === "Menunggu"
                  }
                  onClick={() => {
                    setTemplates((items) =>
                      items.map((item) =>
                        item.id === selected.id
                          ? { ...item, status: "Menunggu" }
                          : item,
                      ),
                    );
                    onAudit(
                      "Mengajukan template ke WhatsApp",
                      selected.name,
                      "Pengajuan persetujuan template",
                    );
                    showToast(message(language, "pages.NotificationsPage.020"));
                  }}
                >
                  <Icon>chat</Icon>
                  {message(language, "pages.NotificationsPage.021")}
                </button>
              </footer>
            </article>
          </section>
        </>
      )}
      {tab === "rules" && (
        <>
          <section className="card rules-card">
            <div className="table-wrap">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>TEMPLATE</th>
                    <th>{message(language, "pages.NotificationsPage.022")}</th>
                    <th>{message(language, "pages.NotificationsPage.023")}</th>
                    <th>{message(language, "pages.NotificationsPage.024")}</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {ruleRows.map((rule, index) => (
                    <tr key={rule.name}>
                      <td>
                        <b>{rule.name}</b>
                      </td>
                      <td>{rule.trigger}</td>
                      <td>
                        <input
                          disabled={!editable}
                          type="number"
                          value={rule.delay}
                          onChange={(event) =>
                            setRuleRows(
                              ruleRows.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      delay: Number(event.target.value),
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </td>
                      <td>{rule.frequency}</td>
                      <td>
                        <Toggle
                          checked={rule.active}
                          disabled={!editable}
                          label={rule.name}
                          onChange={() =>
                            setRuleRows(
                              ruleRows.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, active: !item.active }
                                  : item,
                              ),
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="rule-settings">
            <article className="card quiet-card">
              <div className="rule-card-heading">
                <div>
                  <Icon>bedtime</Icon>
                  <div>
                    <h2>{message(language, "pages.NotificationsPage.025")}</h2>
                    <p>21:00–07:00 · WIB</p>
                  </div>
                </div>
                <Toggle
                  checked={quiet}
                  disabled={!editable}
                  label="Quiet hours"
                  onChange={() => setQuiet(!quiet)}
                />
              </div>
              <label>
                <span>{message(language, "pages.NotificationsPage.026")}</span>
                <input disabled={!editable} type="number" defaultValue={3} />
              </label>
            </article>
            <article className="card optout-card">
              <div className="rule-card-heading">
                <div>
                  <Icon>do_not_disturb_on</Icon>
                  <div>
                    <h2>Opt-out user</h2>
                    <p>312 user · 3,0%</p>
                  </div>
                </div>
                <Toggle
                  checked
                  disabled
                  label="Opt-out locked"
                  onChange={() => undefined}
                />
              </div>
              <div className="locked-note">
                <Icon>lock</Icon>
                <div>
                  <strong>
                    {message(language, "pages.NotificationsPage.027")}
                  </strong>
                  <p>{message(language, "pages.NotificationsPage.028")}</p>
                </div>
              </div>
            </article>
          </section>
          <div className="notification-savebar">
            <span>
              <Icon>schedule_send</Icon>
              {message(language, "pages.NotificationsPage.029")}
            </span>
            <Button
              kind="primary"
              disabled={!editable}
              onClick={() => {
                onAudit(
                  "Mengubah aturan notifikasi",
                  "Aturan pengiriman",
                  "Pembaruan jadwal dan frekuensi",
                );
                showToast(message(language, "pages.NotificationsPage.030"));
              }}
            >
              {message(language, "pages.NotificationsPage.031")}
            </Button>
          </div>
        </>
      )}
      {tab === "logs" && (
        <>
          <section className="notification-kpis">
            {[
              [
                "send",
                message(language, "pages.NotificationsPage.032"),
                "1.482",
              ],
              [
                "visibility",
                message(language, "pages.NotificationsPage.033"),
                "64%",
              ],
              ["error", message(language, "pages.NotificationsPage.034"), "28"],
              ["do_not_disturb_on", "Opt-out", "312"],
            ].map(([icon, label, value], index) => (
              <article
                className={`card notification-kpi ${index === 2 ? "is-danger" : ""}`}
                key={label}
              >
                <Icon>{icon}</Icon>
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              </article>
            ))}
          </section>
          <section className="card notification-log-card">
            <div className="billing-table-tools">
              <h2>{message(language, "pages.NotificationsPage.035")}</h2>
              <label className="filter-pill">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="">
                    {message(language, "pages.NotificationsPage.036")}
                  </option>
                  {["Dibaca", "Terkirim", "Gagal"].map((item) => (
                    <option key={item} value={item}>
                      {item === "Dibaca"
                        ? localized(language, item, "Read")
                        : item === "Terkirim"
                          ? localized(language, item, "Sent")
                          : localizeStatus(language, item)}
                    </option>
                  ))}
                </select>
                <Icon>expand_more</Icon>
              </label>
            </div>
            <div className="table-wrap">
              <table className="notification-log-table">
                <thead>
                  <tr>
                    <th>{message(language, "pages.NotificationsPage.037")}</th>
                    <th>TEMPLATE</th>
                    <th>{message(language, "pages.NotificationsPage.038")}</th>
                    <th>{message(language, "pages.NotificationsPage.039")}</th>
                    <th>STATUS</th>
                    <th>{message(language, "pages.NotificationsPage.040")}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs
                    .filter((row) => !statusFilter || row[4] === statusFilter)
                    .map((row) => (
                      <tr key={`${row[0]}-${row[1]}`}>
                        {row.map((cell, index) => (
                          <td key={index}>
                            {index === 4 ? (
                              <Badge
                                tone={
                                  cell === "Dibaca"
                                    ? "success"
                                    : cell === "Gagal"
                                      ? "danger"
                                      : "neutral"
                                }
                              >
                                {cell === "Dibaca"
                                  ? localized(language, cell, "Read")
                                  : cell === "Terkirim"
                                    ? localized(language, cell, "Sent")
                                    : localizeStatus(language, cell)}
                              </Badge>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      {tab === "logs" && (
        <section className="mobile-card-list standalone-mobile-list">
          <label className="sheet-select">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">
                {message(language, "pages.NotificationsPage.041")}
              </option>
              {["Dibaca", "Terkirim", "Gagal"].map((item) => (
                <option key={item} value={item}>
                  {item === "Dibaca"
                    ? localized(language, item, "Read")
                    : item === "Terkirim"
                      ? localized(language, item, "Sent")
                      : localizeStatus(language, item)}
                </option>
              ))}
            </select>
          </label>
          {logs
            .filter((row) => !statusFilter || row[4] === statusFilter)
            .map((row) => (
              <article
                className="mobile-data-card"
                key={`mobile-${row[0]}-${row[1]}`}
              >
                <div className="mobile-card-top">
                  <span>{row[0]}</span>
                  <Badge
                    tone={
                      row[4] === "Dibaca"
                        ? "success"
                        : row[4] === "Gagal"
                          ? "danger"
                          : "neutral"
                    }
                  >
                    {row[4] === "Dibaca"
                      ? localized(language, row[4], "Read")
                      : row[4] === "Terkirim"
                        ? localized(language, row[4], "Sent")
                        : localizeStatus(language, row[4])}
                  </Badge>
                </div>
                <h3>{row[1]}</h3>
                <dl>
                  <div>
                    <dt>{message(language, "pages.NotificationsPage.042")}</dt>
                    <dd>{row[2]}</dd>
                  </div>
                  <div>
                    <dt>{message(language, "pages.NotificationsPage.043")}</dt>
                    <dd>{row[3]}</dd>
                  </div>
                  <div>
                    <dt>{message(language, "pages.NotificationsPage.044")}</dt>
                    <dd>{row[5]}</dd>
                  </div>
                </dl>
              </article>
            ))}
        </section>
      )}
      {tab === "alerts" && (
        <>
          <section className="card alert-matrix">
            <div className="alert-matrix-head">
              <span>{message(language, "pages.NotificationsPage.045")}</span>
              {["Di CMS", "Email", "Slack", "WA internal"].map((channel) => (
                <span key={channel}>{channel}</span>
              ))}
            </div>
            {alerts.map((alert, rowIndex) => (
              <div
                className={`alert-matrix-row ${rowIndex === 0 ? "is-critical" : ""}`}
                key={alert.event}
              >
                <div>
                  <strong>{alert.event}</strong>
                  <Badge
                    tone={
                      alert.severity === "Kritis"
                        ? "danger"
                        : alert.severity === "Tinggi"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
                {alert.channels.map((checked, channelIndex) => (
                  <Toggle
                    key={channelIndex}
                    checked={checked}
                    disabled={
                      !editable || (rowIndex === 0 && channelIndex === 0)
                    }
                    label={`${alert.event} ${channelIndex}`}
                    onChange={() => toggleAlert(rowIndex, channelIndex)}
                  />
                ))}
                <div className="alert-recipients">
                  <span>
                    {message(language, "pages.NotificationsPage.046")}
                  </span>
                  {roles.map((recipient) => (
                    <button
                      key={recipient}
                      disabled={!editable}
                      className={
                        alert.roles.includes(recipient) ? "is-active" : ""
                      }
                      onClick={() => toggleRole(rowIndex, recipient)}
                    >
                      {recipient}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <section className="admin-alert-cards">
            <article className="card oncall-card">
              <div className="rule-card-heading">
                <div>
                  <Icon>health_and_safety</Icon>
                  <div>
                    <h2>{message(language, "pages.NotificationsPage.047")}</h2>
                    <p>{message(language, "pages.NotificationsPage.048")}</p>
                  </div>
                </div>
                <Toggle
                  checked={onCall}
                  disabled={!editable}
                  label="On call"
                  onChange={() => setOnCall(!onCall)}
                />
              </div>
              <div className="oncall-list">
                {[
                  ["Maya", "07:00–15:00"],
                  ["Reza", "15:00–23:00"],
                  ["Raka", "23:00–07:00"],
                ].map(([name, time]) => (
                  <div key={name}>
                    <span>{name}</span>
                    <b>{time}</b>
                    <small>WIB</small>
                  </div>
                ))}
              </div>
              <p className="escalation-copy">
                <Icon>north_east</Icon>
                {message(language, "pages.NotificationsPage.049")}
              </p>
            </article>
            <article className="card connected-card">
              <div className="config-card__heading">
                <div>
                  <Icon>hub</Icon>
                  <h2>{message(language, "pages.NotificationsPage.050")}</h2>
                </div>
              </div>
              {[
                ["mail", "Email"],
                ["tag", "Slack"],
                ["chat", "WhatsApp internal"],
              ].map(([icon, name]) => (
                <div className="connected-row" key={name}>
                  <Icon>{icon}</Icon>
                  <span>{name}</span>
                  <Badge tone="success">
                    <i />
                    {message(language, "pages.NotificationsPage.051")}
                  </Badge>
                  <Button
                    disabled={!editable}
                    onClick={() =>
                      showToast(
                        localized(
                          language,
                          `Peringatan uji dikirim ke ${name}.`,
                          `Test alert sent to ${name}.`,
                        ),
                      )
                    }
                  >
                    {message(language, "pages.NotificationsPage.052")}
                  </Button>
                </div>
              ))}
            </article>
          </section>
          <div className="notification-savebar critical-savebar">
            <span>
              <Icon>shield</Icon>
              {message(language, "pages.NotificationsPage.053")}
            </span>
            <Button
              kind="primary"
              disabled={!editable}
              onClick={() => {
                onAudit(
                  "Mengubah peringatan admin",
                  "Matriks peringatan",
                  "Pembaruan saluran dan penerima",
                );
                showToast(message(language, "pages.NotificationsPage.054"));
              }}
            >
              {message(language, "pages.NotificationsPage.055")}
            </Button>
          </div>
        </>
      )}
      {testOpen && (
        <TestSendDialog
          language={language}
          onClose={() => setTestOpen(false)}
          onSend={() => {
            setTestOpen(false);
            onAudit("Mengirim uji template", selected.name, "Uji internal");
            showToast(message(language, "pages.NotificationsPage.056"));
          }}
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

export default NotificationsPage;
