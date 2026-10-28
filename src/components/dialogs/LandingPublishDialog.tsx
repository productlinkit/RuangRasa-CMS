import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language } from "../../types/index";

export function LandingPublishDialog({
  language,
  onClose,
  onConfirm,
}: {
  language: Language;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [checked, setChecked] = useState(false);
  const [reason, setReason] = useState("");
  useEscape(onClose);
  return (
    <div className="modal-backdrop">
      <div
        className="price-dialog landing-publish-dialog"
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>publish</Icon>
        </div>
        <h2>
          {message(language, "components.dialogs.LandingPublishDialog.001")}
        </h2>
        <p>
          {message(language, "components.dialogs.LandingPublishDialog.002")}
        </p>
        <div className="publish-summary">
          <div>
            <span>
              {message(language, "components.dialogs.LandingPublishDialog.003")}
            </span>
            <b>v24 → v25</b>
          </div>
          <div>
            <span>
              {message(language, "components.dialogs.LandingPublishDialog.004")}
            </span>
            <b>English · Bahasa Indonesia</b>
          </div>
          <div>
            <span>
              {message(language, "components.dialogs.LandingPublishDialog.005")}
            </span>
            <b>Hero · SEO · Footer</b>
          </div>
          <div>
            <span>Approval</span>
            <b>Content · Legal · Safety</b>
          </div>
        </div>
        <label className="reason-field">
          <span>
            {message(language, "components.dialogs.LandingPublishDialog.006")}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={message(
              language,
              "components.dialogs.LandingPublishDialog.007",
            )}
          />
        </label>
        <label className="billing-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          <span>
            <Icon>{checked ? "check_box" : "check_box_outline_blank"}</Icon>
            {message(language, "components.dialogs.LandingPublishDialog.008")}
          </span>
        </label>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.LandingPublishDialog.009")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.LandingPublishDialog.010")}
          </Button>
          <Button
            kind="primary"
            disabled={!checked || !reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            {message(language, "components.dialogs.LandingPublishDialog.011")}
          </Button>
        </div>
      </div>
    </div>
  );
}
