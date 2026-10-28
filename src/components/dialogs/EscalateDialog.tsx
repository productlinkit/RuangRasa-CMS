import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language, SafetyFlag } from "../../types/index";

export function EscalateDialog({
  flag,
  language,
  onClose,
  onConfirm,
}: {
  flag: SafetyFlag;
  language: Language;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEscape(onClose);
  const chips = message(language, "components.dialogs.EscalateDialog.001");
  return (
    <div className="modal-backdrop">
      <div className="reason-dialog" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>north_east</Icon>
        </div>
        <h2>{message(language, "components.dialogs.EscalateDialog.002")}</h2>
        <p>
          {flag.id} · {flag.title}
        </p>
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
            {message(language, "components.dialogs.EscalateDialog.003")}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.EscalateDialog.004")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.EscalateDialog.005")}
          </Button>
          <Button
            kind="primary"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {message(language, "components.dialogs.EscalateDialog.006")}
          </Button>
        </div>
      </div>
    </div>
  );
}
