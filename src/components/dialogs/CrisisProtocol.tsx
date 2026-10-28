import { message } from "../../locales";
import { localized } from "../../i18n";
import { useState } from "react";
import { AccessBanner, Badge, Button, Icon, PageTitle } from "../ui";
import { Access, Language, Role } from "../../types/index";

export function CrisisProtocol({
  language,
  role,
  access,
  onBack,
  onAudit,
  onToast,
}: {
  language: Language;
  role: Role;
  access: Access;
  onBack: () => void;
  onAudit: (action: string, object: string, reason: string) => void;
  onToast: (message: string) => void;
}) {
  const standardText =
    "Rara is not a crisis service. If you're in danger, contact emergency services immediately. In Indonesia: Into The Light, 119 ext. 8.";
  const [text, setText] = useState(standardText);
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="protocol-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "components.dialogs.CrisisProtocol.001")}
            title={message(language, "components.dialogs.CrisisProtocol.002")}
            accent={message(language, "components.dialogs.CrisisProtocol.003")}
          />
          <p>{message(language, "components.dialogs.CrisisProtocol.004")}</p>
        </div>
        <Button onClick={onBack}>
          <Icon>arrow_back</Icon>
          {message(language, "components.dialogs.CrisisProtocol.005")}
        </Button>
      </section>
      <div className="protocol-layout">
        <article className="card protocol-editor">
          <div className="dashboard-card__heading">
            <div>
              <h2>
                {message(language, "components.dialogs.CrisisProtocol.006")}
              </h2>
              <p>
                {message(language, "components.dialogs.CrisisProtocol.007")}
              </p>
            </div>
            <Badge tone="warning">
              <Icon>pending_actions</Icon>
              {message(language, "components.dialogs.CrisisProtocol.008")}
            </Badge>
          </div>
          <label>
            <span>
              {message(language, "components.dialogs.CrisisProtocol.009")}
            </span>
            <textarea
              value={text}
              disabled={access !== "F"}
              onChange={(event) => setText(event.target.value)}
            />
          </label>
          <div className="protocol-actions">
            <p>
              <Icon>verified_user</Icon>
              {message(language, "components.dialogs.CrisisProtocol.010")}
            </p>
            <Button
              kind="primary"
              disabled={
                access !== "F" || text.trim() === standardText || !text.trim()
              }
              onClick={() => {
                onAudit(
                  "Mengajukan perubahan protokol krisis",
                  "Protokol krisis",
                  "Perubahan teks rujukan",
                );
                onToast(
                  message(language, "components.dialogs.CrisisProtocol.011"),
                );
              }}
            >
              {message(language, "components.dialogs.CrisisProtocol.012")}
            </Button>
          </div>
        </article>
        <aside className="card sync-card">
          <div className="sync-icon">
            <Icon>sync</Icon>
          </div>
          <h2>{message(language, "components.dialogs.CrisisProtocol.013")}</h2>
          <div>
            <Badge>
              <Icon>help</Icon>FAQ #4
            </Badge>
            <Badge>
              <Icon>web</Icon>Footer disclaimer
            </Badge>
          </div>
          <p>{message(language, "components.dialogs.CrisisProtocol.014")}</p>
        </aside>
      </div>
      <div className="privacy-card protocol-note">
        <Icon>lock</Icon>
        <p>
          {localized(
            language,
            `Terakhir diperbarui oleh ${role}. Seluruh revisi dan approval tersimpan di Audit Log.`,
            `Last updated by ${role}. All revisions and approvals are stored in the Audit Log.`,
          )}
        </p>
      </div>
    </>
  );
}
