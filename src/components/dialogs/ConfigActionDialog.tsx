import { message } from "../../locales";
import { localized } from "../../i18n";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language } from "../../types/index";

export function ConfigActionDialog({
  action,
  language,
  onClose,
  onConfirm,
}: {
  action: "publish" | "rollback";
  language: Language;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEscape(onClose);
  const publishing = action === "publish";
  const chips = localized(
    language,
    publishing
      ? ["Pembaruan guardrail", "Perbaikan gaya bahasa", "Pembaruan consent"]
      : ["Regresi respons", "Temuan safety", "Perlu pemulihan cepat"],
    publishing
      ? ["Guardrail update", "Language style improvements", "Consent update"]
      : ["Response regression", "Safety finding", "Quick recovery needed"],
  );
  return (
    <div className="modal-backdrop">
      <div className="reason-dialog" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>{publishing ? "publish" : "restore"}</Icon>
        </div>
        <h2>
          {localized(
            language,
            publishing ? "Publish konfigurasi v13." : "Rollback versi Rara.",
            publishing
              ? "Publish configuration v13."
              : "Rollback Rara version.",
          )}
        </h2>
        <p>{message(language, "components.dialogs.ConfigActionDialog.001")}</p>
        <div className="reason-chips">
          {chips.map((chip) => (
            <button
              key={chip}
              className={reason === chip ? "is-active" : ""}
              onClick={() => setReason(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
        <label className="reason-field">
          <span>
            {message(language, "components.dialogs.ConfigActionDialog.002")}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.ConfigActionDialog.003")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.ConfigActionDialog.004")}
          </Button>
          <Button
            kind="primary"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {localized(
              language,
              publishing ? "Publish v13" : "Rollback",
              publishing ? "Publish v13" : "Rollback",
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
