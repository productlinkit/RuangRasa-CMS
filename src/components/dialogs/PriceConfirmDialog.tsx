import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language, PlanData } from "../../types/index";

export function PriceConfirmDialog({
  original,
  draft,
  language,
  onClose,
  onConfirm,
}: {
  original: PlanData;
  draft: PlanData;
  language: Language;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [accepted, setAccepted] = useState(false);
  useEscape(onClose);
  const rupiah = (value: number) =>
    value === 0 ? "Rp0" : `Rp ${value.toLocaleString("id-ID")}`;
  return (
    <div className="modal-backdrop">
      <div className="price-dialog" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>campaign</Icon>
        </div>
        <h2>
          {message(language, "components.dialogs.PriceConfirmDialog.001")}
        </h2>
        <p>{message(language, "components.dialogs.PriceConfirmDialog.002")}</p>
        <div className="price-summary">
          <div>
            <span>Plan</span>
            <strong>{draft.name}</strong>
          </div>
          <div>
            <span>
              {message(language, "components.dialogs.PriceConfirmDialog.003")}
            </span>
            <strong>
              <del>{rupiah(original.price)}</del> <Icon>arrow_forward</Icon>{" "}
              {rupiah(draft.price)}
            </strong>
          </div>
          <div>
            <span>
              {message(language, "components.dialogs.PriceConfirmDialog.004")}
            </span>
            <strong>
              {draft.subscribers.toLocaleString("id-ID")}{" "}
              {message(language, "components.dialogs.PriceConfirmDialog.005")}
            </strong>
          </div>
          <div>
            <span>Template</span>
            <strong>“Perubahan harga”</strong>
          </div>
        </div>
        <label className="billing-checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>
            <Icon>{accepted ? "check_box" : "check_box_outline_blank"}</Icon>
            {message(language, "components.dialogs.PriceConfirmDialog.006")}
          </span>
        </label>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.PriceConfirmDialog.007")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.PriceConfirmDialog.008")}
          </Button>
          <Button kind="primary" disabled={!accepted} onClick={onConfirm}>
            {message(language, "components.dialogs.PriceConfirmDialog.009")}
          </Button>
        </div>
      </div>
    </div>
  );
}
