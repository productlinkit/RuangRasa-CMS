import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language } from "../../types/index";

export function TestSendDialog({
  language,
  onClose,
  onSend,
}: {
  language: Language;
  onClose: () => void;
  onSend: () => void;
}) {
  const [phone, setPhone] = useState("");
  useEscape(onClose);
  return (
    <div className="modal-backdrop">
      <div
        className="reason-dialog test-send-dialog"
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon whatsapp-dialog-icon">
          <Icon>chat</Icon>
        </div>
        <h2>{message(language, "components.dialogs.TestSendDialog.001")}</h2>
        <p>{message(language, "components.dialogs.TestSendDialog.002")}</p>
        <label className="field">
          <span>
            {message(language, "components.dialogs.TestSendDialog.003")}
          </span>
          <div className="input-wrap">
            <Icon>phone</Icon>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+62 812-0000-0000"
            />
          </div>
        </label>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.TestSendDialog.004")}
          </Button>
          <button
            className="whatsapp-button"
            disabled={phone.trim().length < 8}
            onClick={onSend}
          >
            <Icon>send</Icon>
            {message(language, "components.dialogs.TestSendDialog.005")}
          </button>
        </div>
      </div>
    </div>
  );
}
