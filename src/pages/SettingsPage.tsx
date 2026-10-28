import { message } from "../locales";
import { usePersistentState } from "../hooks/usePersistentState";
import { localized } from "../i18n";
import { useState } from "react";

import { InviteAdminDialog } from "../components/dialogs";

import { Badge, Button, Icon, PageTitle, Toggle } from "../components/ui";

import {
  initialIntegrations,
  initialTeam,
  permissionMatrixRows,
} from "../data/mock/index";

import { Language, Role } from "../types/index";

export function SettingsPage({
  language,
  role,
  onAudit,
}: {
  language: Language;
  role: Role;
  onAudit: (action: string, object: string, reason: string) => void;
}) {
  const [tab, setTab] = useState<"team" | "security" | "integrations">("team");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [team, setTeam] = usePersistentState(
    "ruangrasa.settings.team",
    initialTeam,
  );
  const [integrations, setIntegrations] = usePersistentState(
    "ruangrasa.settings.integrations",
    initialIntegrations,
  );
  const [mfaRequired, setMfaRequired] = usePersistentState(
    "ruangrasa.settings.mfaRequired",
    true,
  );
  const [sessionExpiry, setSessionExpiry] = usePersistentState(
    "ruangrasa.settings.sessionExpiry",
    "30",
  );
  const [ipAllowlist, setIpAllowlist] = usePersistentState(
    "ruangrasa.settings.ipAllowlist",
    false,
  );
  const [ips, setIps] = usePersistentState(
    "ruangrasa.settings.ips",
    "103.12.44.0/24\n36.88.120.14",
  );
  const [transcriptRetention, setTranscriptRetention] = usePersistentState(
    "ruangrasa.settings.transcriptRetention",
    "90",
  );
  const [metadataRetention, setMetadataRetention] = usePersistentState(
    "ruangrasa.settings.metadataRetention",
    "12",
  );
  const [deletionWindow, setDeletionWindow] = usePersistentState(
    "ruangrasa.settings.deletionWindow",
    "14",
  );
  const [toast, setToast] = useState("");
  const matrixRows = permissionMatrixRows;
  const tabs = message(language, "pages.SettingsPage.001");
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  function invite(email: string, inviteRole: Role) {
    const name = email
      .split("@")[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    setTeam([
      ...team,
      {
        name,
        email,
        role: inviteRole,
        mfa: false,
        lastLogin: message(language, "pages.SettingsPage.002"),
      },
    ]);
    onAudit(
      "Mengundang admin",
      email,
      `Role ${inviteRole}; MFA wajib pada login pertama`,
    );
    setInviteOpen(false);
    showToast(message(language, "pages.SettingsPage.003"));
  }
  function manageIntegration(id: string, name: string, status: string) {
    if (status !== "Terhubung")
      setIntegrations((items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, status: "Terhubung", tone: "success" as const }
            : item,
        ),
      );
    onAudit(
      status === "Terhubung"
        ? "Membuka pengelolaan integrasi"
        : "Menghubungkan integrasi",
      name,
      "Tindakan Super Admin",
    );
    showToast(
      status === "Terhubung"
        ? localized(
            language,
            `${name} siap dikelola.`,
            `${name} is ready to manage.`,
          )
        : localized(
            language,
            `${name} berhasil dihubungkan.`,
            `${name} connected.`,
          ),
    );
  }
  if (role !== "Super Admin") return null;
  return (
    <>
      <section className="settings-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.SettingsPage.004")}
            title={message(language, "pages.SettingsPage.005")}
            accent={message(language, "pages.SettingsPage.006")}
          />
          <p>{message(language, "pages.SettingsPage.007")}</p>
        </div>
        {tab === "team" && (
          <Button kind="primary" onClick={() => setInviteOpen(true)}>
            <Icon>person_add</Icon>
            {message(language, "pages.SettingsPage.008")}
          </Button>
        )}
      </section>
      <div className="settings-tabs">
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
      {tab === "team" && (
        <>
          <section className="card team-card">
            <div className="table-wrap responsive-table-desktop">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>ADMIN</th>
                    <th>ROLE</th>
                    <th>MFA</th>
                    <th>{message(language, "pages.SettingsPage.009")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr key={member.email}>
                      <td>
                        <div className="team-admin">
                          <span>{member.name.charAt(0)}</span>
                          <div>
                            <strong>{member.name}</strong>
                            <small>{member.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge>{member.role}</Badge>
                      </td>
                      <td>
                        <Badge tone={member.mfa ? "success" : "warning"}>
                          <Icon>
                            {member.mfa ? "verified_user" : "warning"}
                          </Icon>
                          {member.mfa
                            ? message(language, "pages.SettingsPage.010")
                            : message(language, "pages.SettingsPage.011")}
                        </Badge>
                      </td>
                      <td>{member.lastLogin}</td>
                      <td>
                        <button
                          className="row-action"
                          onClick={() =>
                            showToast(
                              localized(
                                language,
                                `Menu ${member.name} dibuka.`,
                                `${member.name} menu opened.`,
                              ),
                            )
                          }
                        >
                          <Icon>more_horiz</Icon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-card-list team-mobile-list">
              {team.map((member) => (
                <article className="mobile-data-card" key={member.email}>
                  <div className="team-admin">
                    <span>{member.name.charAt(0)}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <small>{member.email}</small>
                    </div>
                  </div>
                  <div className="mobile-card-badges">
                    <Badge>{member.role}</Badge>
                    <Badge tone={member.mfa ? "success" : "warning"}>
                      {member.mfa ? "MFA aktif" : "MFA belum aktif"}
                    </Badge>
                  </div>
                  <dl>
                    <div>
                      <dt>{message(language, "pages.SettingsPage.012")}</dt>
                      <dd>{member.lastLogin}</dd>
                    </div>
                  </dl>
                  <button
                    className="row-action"
                    onClick={() =>
                      showToast(
                        localized(
                          language,
                          `Menu ${member.name} dibuka.`,
                          `${member.name} menu opened.`,
                        ),
                      )
                    }
                  >
                    <Icon>more_horiz</Icon>
                  </button>
                </article>
              ))}
            </div>
          </section>
          <section className="card access-matrix-card">
            <div className="matrix-heading">
              <div>
                <h2>{message(language, "pages.SettingsPage.013")}</h2>
                <p>{message(language, "pages.SettingsPage.014")}</p>
              </div>
              <div className="matrix-legend">
                {[
                  ["F", "Penuh"],
                  ["R", "Lihat"],
                  ["M", "Metadata"],
                  ["—", "Tidak ada"],
                ].map(([value, label]) => (
                  <span key={value}>
                    <i
                      className={`access-pill access-pill--${value === "—" ? "none" : value.toLowerCase()}`}
                    >
                      {value}
                    </i>
                    {localized(
                      language,
                      label,
                      value === "F"
                        ? "Full"
                        : value === "R"
                          ? "Read"
                          : value === "M"
                            ? "Metadata"
                            : "None",
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="table-wrap">
              <table className="access-matrix">
                <thead>
                  <tr>
                    <th>{message(language, "pages.SettingsPage.015")}</th>
                    {[
                      "SA",
                      "Ops",
                      "Content",
                      "Safety",
                      "Analyst",
                      "Finance",
                    ].map((item) => (
                      <th key={item}>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map(([moduleID, moduleEN, values]) => (
                    <tr key={moduleID}>
                      <td>
                        <strong>
                          {localized(language, moduleID, moduleEN)}
                        </strong>
                      </td>
                      {values.map((value, index) => (
                        <td key={`${moduleID}-${index}`}>
                          <span
                            className={`access-pill access-pill--${value === "—" ? "none" : value.toLowerCase()}`}
                          >
                            {value}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="matrix-note">
              <Icon>info</Icon>
              {message(language, "pages.SettingsPage.016")}
            </div>
          </section>
        </>
      )}
      {tab === "security" && (
        <>
          <section className="security-grid">
            <article className="card settings-card">
              <div className="config-card__heading">
                <div>
                  <Icon>security</Icon>
                  <h2>{message(language, "pages.SettingsPage.017")}</h2>
                </div>
              </div>
              <div className="settings-row">
                <div>
                  <strong>{message(language, "pages.SettingsPage.018")}</strong>
                  <p>{message(language, "pages.SettingsPage.019")}</p>
                </div>
                <Toggle
                  checked={mfaRequired}
                  label="Require MFA"
                  onChange={() => setMfaRequired(!mfaRequired)}
                />
              </div>
              <label className="settings-select">
                <span>{message(language, "pages.SettingsPage.020")}</span>
                <select
                  value={sessionExpiry}
                  onChange={(event) => setSessionExpiry(event.target.value)}
                >
                  {["15", "30", "60"].map((item) => (
                    <option key={item} value={item}>
                      {item} {message(language, "pages.SettingsPage.021")}
                    </option>
                  ))}
                </select>
                <Icon>expand_more</Icon>
              </label>
              <div className="settings-row">
                <div>
                  <strong>IP allowlist</strong>
                  <p>{message(language, "pages.SettingsPage.022")}</p>
                </div>
                <Toggle
                  checked={ipAllowlist}
                  label="IP allowlist"
                  onChange={() => setIpAllowlist(!ipAllowlist)}
                />
              </div>
              <label className="settings-textarea">
                <span>IP / CIDR</span>
                <textarea
                  disabled={!ipAllowlist}
                  value={ips}
                  onChange={(event) => setIps(event.target.value)}
                />
              </label>
            </article>
            <article className="card settings-card">
              <div className="config-card__heading">
                <div>
                  <Icon>database</Icon>
                  <h2>{message(language, "pages.SettingsPage.023")}</h2>
                </div>
              </div>
              <label className="settings-select">
                <span>{message(language, "pages.SettingsPage.024")}</span>
                <select
                  value={transcriptRetention}
                  onChange={(event) =>
                    setTranscriptRetention(event.target.value)
                  }
                >
                  {["30", "90", "180"].map((item) => (
                    <option key={item}>
                      {item} {message(language, "pages.SettingsPage.025")}
                    </option>
                  ))}
                </select>
                <Icon>expand_more</Icon>
              </label>
              <label className="settings-select">
                <span>{message(language, "pages.SettingsPage.026")}</span>
                <select
                  value={metadataRetention}
                  onChange={(event) => setMetadataRetention(event.target.value)}
                >
                  {["6", "12", "24"].map((item) => (
                    <option key={item}>
                      {item} {message(language, "pages.SettingsPage.027")}
                    </option>
                  ))}
                </select>
                <Icon>expand_more</Icon>
              </label>
              <label className="settings-select">
                <span>{message(language, "pages.SettingsPage.028")}</span>
                <select
                  value={deletionWindow}
                  onChange={(event) => setDeletionWindow(event.target.value)}
                >
                  {["7", "14", "30"].map((item) => (
                    <option key={item}>
                      {item} {message(language, "pages.SettingsPage.029")}
                    </option>
                  ))}
                </select>
                <Icon>expand_more</Icon>
              </label>
              <div className="retention-note">
                <Icon>gavel</Icon>
                {message(language, "pages.SettingsPage.030")}
              </div>
            </article>
          </section>
          <div className="notification-savebar">
            <span>
              <Icon>policy</Icon>
              {message(language, "pages.SettingsPage.031")}
            </span>
            <Button
              kind="primary"
              onClick={() => {
                onAudit(
                  "Mengubah keamanan & retensi",
                  "Pengaturan Admin",
                  `MFA ${mfaRequired}; sesi ${sessionExpiry}m; transkrip ${transcriptRetention} hari`,
                );
                showToast(message(language, "pages.SettingsPage.032"));
              }}
            >
              {message(language, "pages.SettingsPage.033")}
            </Button>
          </div>
        </>
      )}
      {tab === "integrations" && (
        <section className="card integrations-card">
          {integrations.map((integration) => (
            <div className="integration-row" key={integration.id}>
              <span
                className={`integration-icon ${integration.id === "whatsapp" ? "is-whatsapp" : ""}`}
              >
                <Icon>{integration.icon}</Icon>
              </span>
              <div>
                <strong>
                  {localized(
                    language,
                    integration.name,
                    integration.nameEN ?? integration.name,
                  )}
                </strong>
                <p>
                  {localized(
                    language,
                    integration.description,
                    integration.descriptionEN,
                  )}
                </p>
              </div>
              <Badge tone={integration.tone}>
                <i />
                {localized(
                  language,
                  integration.status,
                  integration.status === "Terhubung"
                    ? "Connected"
                    : integration.status === "Belum dihubungkan"
                      ? "Not connected"
                      : "Reauthorisation required",
                )}
              </Badge>
              <Button
                onClick={() =>
                  manageIntegration(
                    integration.id,
                    integration.name,
                    integration.status,
                  )
                }
              >
                {integration.status === "Terhubung"
                  ? message(language, "pages.SettingsPage.034")
                  : message(language, "pages.SettingsPage.035")}
              </Button>
            </div>
          ))}
        </section>
      )}
      {inviteOpen && (
        <InviteAdminDialog
          language={language}
          onClose={() => setInviteOpen(false)}
          onInvite={invite}
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

export default SettingsPage;
