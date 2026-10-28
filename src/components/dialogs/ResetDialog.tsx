import { Button, Icon } from "../ui";
import { copy } from "../../data/mock/index";
import { useEscape } from "../../hooks/useEscape";
import { Language } from "../../types/index";

export function ResetDialog({
  language,
  onClose,
}: {
  language: Language;
  onClose: () => void;
}) {
  const t = copy[language];
  useEscape(onClose);
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="reset-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
      >
        <button className="modal-close" onClick={onClose} aria-label={t.cancel}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>lock_reset</Icon>
        </div>
        <h2 id="reset-title">{t.resetTitle}</h2>
        <p>{t.resetCopy}</p>
        <label className="field">
          <span>{t.workEmail}</span>
          <div className="input-wrap">
            <Icon>mail</Icon>
            <input
              type="email"
              placeholder="nama@ruangrasa.id"
              autoComplete="email"
            />
          </div>
        </label>
        <div className="dialog-actions">
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button kind="primary" onClick={onClose}>
            {t.resetSubmit}
          </Button>
        </div>
      </div>
    </div>
  );
}
