import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language } from "../../types/index";

export function BillingActionDialog({
  title,
  object,
  language,
  onClose,
  onConfirm,
}: {
  title: string;
  object: string;
  language: Language;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEscape(onClose);
  const chips = message(language, "components.dialogs.BillingActionDialog.001");
  return (
    <div className="modal-backdrop">
      <div className="reason-dialog" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>receipt_long</Icon>
        </div>
        <h2>{title}</h2>
        <p>{object}</p>
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
            {message(language, "components.dialogs.BillingActionDialog.002")}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.BillingActionDialog.003")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.BillingActionDialog.004")}
          </Button>
          <Button
            kind="primary"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {message(language, "components.dialogs.BillingActionDialog.005")}
          </Button>
        </div>
      </div>
    </div>
  );
}
