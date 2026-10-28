import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language } from "../../types/index";

export function SessionReasonDialog({
  language,
  onClose,
  onConfirm,
}: {
  language: Language;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEscape(onClose);
  const chips = message(language, "components.dialogs.SessionReasonDialog.001");
  return (
    <div className="modal-backdrop">
      <div className="reason-dialog" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>chat_lock</Icon>
        </div>
        <h2>
          {message(language, "components.dialogs.SessionReasonDialog.002")}
        </h2>
        <p>{message(language, "components.dialogs.SessionReasonDialog.003")}</p>
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
            {message(language, "components.dialogs.SessionReasonDialog.004")}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.SessionReasonDialog.005")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.SessionReasonDialog.006")}
          </Button>
          <Button
            kind="primary"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {message(language, "components.dialogs.SessionReasonDialog.007")}
          </Button>
        </div>
      </div>
    </div>
  );
}
