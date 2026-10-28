import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { useEscape } from "../../hooks/useEscape";
import { Language, SensitiveAction, UserData } from "../../types/index";

export function ReasonDialog({
  action,
  language,
  user,
  onClose,
  onConfirm,
}: {
  action: SensitiveAction;
  language: Language;
  user: UserData;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");
  useEscape(onClose);
  const destructive = action === "delete";
  const labels: Record<SensitiveAction, [string, string]> = {
    reveal: ["Tampilkan nomor penuh", "Reveal full number"],
    plan: ["Ubah plan pengguna", "Change user plan"],
    export: ["Ekspor data pengguna", "Export user data"],
    block: [
      user.status === "Diblokir" ? "Buka blokir pengguna" : "Blokir pengguna",
      user.status === "Diblokir" ? "Unblock user" : "Block user",
    ],
    delete: ["Hapus data pengguna", "Delete user data"],
  };
  const descriptions: Record<SensitiveAction, [string, string]> = {
    reveal: [
      "Jelaskan mengapa nomor lengkap diperlukan untuk pekerjaan ini.",
      "Explain why the full number is needed for this task.",
    ],
    plan: [
      "Plan aktual tetap Free. Opsi Premium hanya data uji karena belum diluncurkan.",
      "The current plan remains Free. Premium is test data only because it has not launched.",
    ],
    export: [
      "Ekspor hanya data yang memang dibutuhkan.",
      "Export only the data that is genuinely needed.",
    ],
    block: [
      "Berikan konteks agar keputusan ini dapat ditinjau dengan adil.",
      "Add context so this decision can be reviewed fairly.",
    ],
    delete: [
      "Tindakan ini permanen. Ketik HAPUS untuk melanjutkan.",
      "This action is permanent. Type HAPUS to continue.",
    ],
  };
  const chips = message(language, "components.dialogs.ReasonDialog.001");
  const valid =
    reason.trim().length > 0 && (!destructive || confirmation === "HAPUS");
  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className={`reason-dialog ${destructive ? "reason-dialog--danger" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>{destructive ? "delete_forever" : "verified_user"}</Icon>
        </div>
        <h2>
          {
            labels[action][
              message(language, "components.dialogs.ReasonDialog.002")
            ]
          }
        </h2>
        <p>
          {
            descriptions[action][
              message(language, "components.dialogs.ReasonDialog.003")
            ]
          }
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
            {message(language, "components.dialogs.ReasonDialog.004")}
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={message(
              language,
              "components.dialogs.ReasonDialog.005",
            )}
          />
        </label>
        {destructive && (
          <label className="field">
            <span>
              {message(language, "components.dialogs.ReasonDialog.006")}
            </span>
            <div className="input-wrap">
              <Icon>warning</Icon>
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="HAPUS"
              />
            </div>
          </label>
        )}
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.ReasonDialog.007")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.ReasonDialog.008")}
          </Button>
          <Button
            kind={destructive ? "danger" : "primary"}
            disabled={!valid}
            onClick={() => onConfirm(reason)}
          >
            {
              labels[action][
                message(language, "components.dialogs.ReasonDialog.009")
              ]
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
