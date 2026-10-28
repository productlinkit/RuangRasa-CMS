import { message } from "../locales";
import { useState } from "react";

import { BillingActionDialog } from "../components/dialogs";

import { AccessBanner, Badge, Button, Icon, PageTitle } from "../components/ui";

import { useEscape } from "../hooks/useEscape";

import { Access, AuditEntry, Language, Role } from "../types/index";

export function AuditLogPage({
  language,
  role,
  access,
  entries,
  onAudit,
}: {
  language: Language;
  role: Role;
  access: Access;
  entries: AuditEntry[];
  onAudit: (action: string, object: string, reason: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [range, setRange] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEscape(() => setFiltersOpen(false), filtersOpen);
  const filtered = entries.filter((entry) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${entry.action} ${entry.object} ${entry.reason}`
          .toLowerCase()
          .includes(query)) &&
      (!admin || entry.actor === admin) &&
      (!roleFilter || entry.role === roleFilter) &&
      (!range || entry.ageHours <= Number(range))
    );
  });
  const admins = [...new Set(entries.map((entry) => entry.actor))];
  const auditRoles = [...new Set(entries.map((entry) => entry.role))];
  function exportLog(reason: string) {
    const rows = [
      ["Waktu", "Admin", "Role", "Aksi", "Objek", "Alasan", "Status"],
      ...filtered.map((entry) => [
        entry.time,
        entry.actor,
        entry.role,
        entry.action,
        entry.object,
        entry.reason,
        "Tercatat",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ruangrasa-audit-log.csv";
    link.click();
    URL.revokeObjectURL(url);
    onAudit("Mengekspor Audit Log", `${filtered.length} entri`, reason);
    setExportOpen(false);
    setToast(message(language, "pages.AuditLogPage.001"));
    window.setTimeout(() => setToast(""), 3200);
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="audit-heading">
        <div>
          <PageTitle eyebrow="AUDIT" title="Audit" accent="Log." />
          <p>{message(language, "pages.AuditLogPage.002")}</p>
        </div>
        {role === "Super Admin" && (
          <Button onClick={() => setExportOpen(true)}>
            <Icon>download</Icon>
            {message(language, "pages.AuditLogPage.003")}
          </Button>
        )}
      </section>
      <div className="audit-integrity">
        <div>
          <Icon>lock</Icon>
          <span>
            <strong>Immutable</strong>
            {message(language, "pages.AuditLogPage.004")}
          </span>
        </div>
        <Badge tone="success">
          <Icon>verified</Icon>
          {message(language, "pages.AuditLogPage.005")}
        </Badge>
      </div>
      <section className="card audit-card">
        <div className="audit-toolbar">
          <label className="user-search">
            <Icon>search</Icon>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={message(language, "pages.AuditLogPage.006")}
            />
          </label>
          <button
            className="mobile-filter-button"
            onClick={() => setFiltersOpen(true)}
          >
            <Icon>filter_list</Icon>
            {message(language, "pages.AuditLogPage.007")}
          </button>
          <label className="filter-pill">
            <select
              value={admin}
              onChange={(event) => setAdmin(event.target.value)}
            >
              <option value="">
                {message(language, "pages.AuditLogPage.008")}
              </option>
              {admins.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon>expand_more</Icon>
          </label>
          <label className="filter-pill">
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="">Role</option>
              {auditRoles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon>expand_more</Icon>
          </label>
          <label className="filter-pill">
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="">
                {message(language, "pages.AuditLogPage.009")}
              </option>
              <option value="24">
                {message(language, "pages.AuditLogPage.010")}
              </option>
              <option value="168">
                {message(language, "pages.AuditLogPage.011")}
              </option>
              <option value="720">
                {message(language, "pages.AuditLogPage.012")}
              </option>
            </select>
            <Icon>expand_more</Icon>
          </label>
        </div>
        <div className="audit-table-meta">
          <span>
            {filtered.length} {message(language, "pages.AuditLogPage.013")}
          </span>
          <Badge>
            <Icon>lock</Icon>immutable
          </Badge>
        </div>
        <div className="table-wrap responsive-table-desktop">
          <table className="audit-table">
            <thead>
              <tr>
                <th>{message(language, "pages.AuditLogPage.014")}</th>
                <th>ADMIN</th>
                <th>{message(language, "pages.AuditLogPage.015")}</th>
                <th>{message(language, "pages.AuditLogPage.016")}</th>
                <th>{message(language, "pages.AuditLogPage.017")}</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className={entry.fresh ? "is-fresh" : ""}>
                  <td>
                    <span className="audit-time">{entry.time}</span>
                  </td>
                  <td>
                    <div className="audit-admin">
                      <span>{entry.actor.charAt(0)}</span>
                      <div>
                        <strong>{entry.actor}</strong>
                        <small>{entry.role}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{entry.action}</strong>
                    {entry.fresh && (
                      <Badge tone="warning">
                        {message(language, "pages.AuditLogPage.018")}
                      </Badge>
                    )}
                  </td>
                  <td>
                    <span className="audit-object">{entry.object}</span>
                  </td>
                  <td>{entry.reason}</td>
                  <td>
                    <Badge tone="success">
                      <Icon>check_circle</Icon>
                      {message(language, "pages.AuditLogPage.019")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mobile-card-list audit-mobile-list">
          {filtered.map((entry) => (
            <article
              className={`mobile-data-card ${entry.fresh ? "is-fresh" : ""}`}
              key={entry.id}
            >
              <div className="mobile-card-top">
                <span>{entry.time}</span>
                <Badge tone="success">
                  {message(language, "pages.AuditLogPage.020")}
                </Badge>
              </div>
              <div className="audit-admin">
                <span>{entry.actor.charAt(0)}</span>
                <div>
                  <strong>{entry.actor}</strong>
                  <small>{entry.role}</small>
                </div>
              </div>
              <h3>{entry.action}</h3>
              <dl>
                <div>
                  <dt>{message(language, "pages.AuditLogPage.021")}</dt>
                  <dd>{entry.object}</dd>
                </div>
                <div>
                  <dt>{message(language, "pages.AuditLogPage.022")}</dt>
                  <dd>{entry.reason}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Icon>search_off</Icon>
            {message(language, "pages.AuditLogPage.023")}
          </div>
        )}
        <div className="audit-footer">
          <Icon>shield_lock</Icon>
          <span>{message(language, "pages.AuditLogPage.024")}</span>
        </div>
      </section>
      {filtersOpen && (
        <div
          className="bottom-sheet-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setFiltersOpen(false)
          }
        >
          <section className="filter-sheet">
            <div className="sheet-handle" />
            <div className="sheet-heading">
              <h2>{message(language, "pages.AuditLogPage.025")}</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <Icon>close</Icon>
              </button>
            </div>
            <label className="sheet-select">
              <span>Admin</span>
              <select
                value={admin}
                onChange={(event) => setAdmin(event.target.value)}
              >
                <option value="">—</option>
                {admins.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="sheet-select">
              <span>Role</span>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="">—</option>
                {auditRoles.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="sheet-select">
              <span>{message(language, "pages.AuditLogPage.026")}</span>
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
              >
                <option value="">—</option>
                <option value="24">24h</option>
                <option value="168">7d</option>
                <option value="720">30d</option>
              </select>
            </label>
            <Button kind="primary" onClick={() => setFiltersOpen(false)}>
              {message(language, "pages.AuditLogPage.027")}
            </Button>
          </section>
        </div>
      )}
      {exportOpen && (
        <BillingActionDialog
          title={message(language, "pages.AuditLogPage.028")}
          object={`${filtered.length} ${message(language, "pages.AuditLogPage.029")}`}
          language={language}
          onClose={() => setExportOpen(false)}
          onConfirm={exportLog}
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

export default AuditLogPage;
