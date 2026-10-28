import { message } from "../../locales";
import { localized } from "../../i18n";
import { PriceConfirmDialog } from "./PriceConfirmDialog";
import { useState } from "react";
import { Badge, Button, Icon, Toggle, localizeStatus } from "../ui";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useEscape } from "../../hooks/useEscape";
import { Language, PlanData } from "../../types/index";

export function PlanDrawer({
  plan,
  editable,
  language,
  onClose,
  onSave,
  onAudit,
}: {
  plan: PlanData;
  editable: boolean;
  language: Language;
  onClose: () => void;
  onSave: (plan: PlanData) => void;
  onAudit: (action: string, object: string, reason: string) => void;
}) {
  const breakpoint = useBreakpoint();
  const [draft, setDraft] = useState(plan);
  const [confirming, setConfirming] = useState(false);
  const noticeNeeded =
    (draft.price !== plan.price && plan.subscribers > 0) ||
    (plan.paid && plan.status !== "Aktif" && draft.status === "Aktif");
  useEscape(onClose);
  function save() {
    if (noticeNeeded) {
      setConfirming(true);
      return;
    }
    onAudit("Mengubah plan", plan.name, "Perubahan konfigurasi plan");
    onSave({ ...draft, version: plan.version + 1 });
    onClose();
  }
  function confirmedSave() {
    onAudit(
      "Mengubah harga/aktivasi plan dan mengirim pemberitahuan",
      plan.name,
      `Harga ${plan.price} menjadi ${draft.price}; ${draft.subscribers} penerima`,
    );
    onSave({ ...draft, version: plan.version + 1 });
    setConfirming(false);
    onClose();
  }
  return (
    <>
      <div
        className="drawer-backdrop"
        onMouseDown={(event) =>
          event.target === event.currentTarget && onClose()
        }
      >
        <aside className="plan-drawer">
          <div className="session-drawer__header">
            <div>
              <span>
                {message(language, "components.dialogs.PlanDrawer.001")}
              </span>
              <h2>{plan.name}</h2>
              <Badge tone={draft.status === "Aktif" ? "success" : "warning"}>
                {localizeStatus(language, draft.status)}
              </Badge>
            </div>
            <button className="modal-close" onClick={onClose}>
              <Icon>{breakpoint === "mobile" ? "arrow_back" : "close"}</Icon>
            </button>
          </div>
          <div className="plan-drawer__body">
            <section className="drawer-section plan-form">
              <h3>{message(language, "components.dialogs.PlanDrawer.002")}</h3>
              <label>
                <span>
                  {message(language, "components.dialogs.PlanDrawer.003")}
                </span>
                <input
                  disabled={!editable}
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <div className="plan-form-grid">
                <label>
                  <span>
                    {message(language, "components.dialogs.PlanDrawer.004")}
                  </span>
                  <input
                    disabled={!editable}
                    type="number"
                    value={draft.price}
                    onChange={(event) =>
                      setDraft({ ...draft, price: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  <span>
                    {message(language, "components.dialogs.PlanDrawer.005")}
                  </span>
                  <select
                    disabled={!editable}
                    value={draft.cycle}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        cycle: event.target.value as PlanData["cycle"],
                      })
                    }
                  >
                    <option value="Bulanan">
                      {message(language, "components.dialogs.PlanDrawer.006")}
                    </option>
                    <option value="Tahunan">
                      {message(language, "components.dialogs.PlanDrawer.007")}
                    </option>
                  </select>
                </label>
              </div>
              <label>
                <span>Status</span>
                <select
                  disabled={!editable}
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      status: event.target.value as PlanData["status"],
                    })
                  }
                >
                  {["Aktif", "Draft", "Diarsipkan"].map((item) => (
                    <option key={item} value={item}>
                      {localizeStatus(language, item)}
                    </option>
                  ))}
                </select>
              </label>
            </section>
            <section className="drawer-section plan-form">
              <h3>{message(language, "components.dialogs.PlanDrawer.008")}</h3>
              <div className="plan-form-grid">
                <label>
                  <span>
                    {message(language, "components.dialogs.PlanDrawer.009")}
                  </span>
                  <input
                    disabled={!editable}
                    type="number"
                    value={draft.sessions}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        sessions: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  <span>
                    {message(language, "components.dialogs.PlanDrawer.010")}
                  </span>
                  <input
                    disabled={!editable}
                    type="number"
                    value={draft.duration}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        duration: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>
              <div className="plan-toggle-row">
                <div>
                  <strong>
                    {message(language, "components.dialogs.PlanDrawer.011")}
                  </strong>
                  <p>
                    {message(language, "components.dialogs.PlanDrawer.012")}
                  </p>
                </div>
                <Toggle
                  checked={draft.group}
                  disabled={!editable}
                  label="Group mediation"
                  onChange={() => setDraft({ ...draft, group: !draft.group })}
                />
              </div>
            </section>
            <section className="drawer-section">
              <h3>{message(language, "components.dialogs.PlanDrawer.013")}</h3>
              <div className="price-history">
                <div>
                  <b>v{plan.version}</b>
                  <span>Rp {plan.price.toLocaleString("id-ID")}</span>
                  <small>2 Okt 2026 · Dina</small>
                </div>
                <div>
                  <b>v{Math.max(1, plan.version - 1)}</b>
                  <span>
                    {message(language, "components.dialogs.PlanDrawer.014")}
                  </span>
                  <small>12 Sep 2026 · System</small>
                </div>
              </div>
            </section>
            {noticeNeeded && (
              <div className="billing-warning">
                <Icon>campaign</Icon>
                <span>
                  {localized(
                    language,
                    `Perubahan harga akan mengirim template 'Perubahan harga' ke ${draft.subscribers.toLocaleString("id-ID")} pelanggan.`,
                    `The price change will send the 'Price change' template to ${draft.subscribers.toLocaleString("id-ID")} subscribers.`,
                  )}
                </span>
              </div>
            )}
            {editable && (
              <Button kind="primary" onClick={save}>
                {noticeNeeded
                  ? message(language, "components.dialogs.PlanDrawer.015")
                  : message(language, "components.dialogs.PlanDrawer.016")}
              </Button>
            )}
          </div>
        </aside>
      </div>
      {confirming && (
        <PriceConfirmDialog
          original={plan}
          draft={draft}
          language={language}
          onClose={() => setConfirming(false)}
          onConfirm={confirmedSave}
        />
      )}
    </>
  );
}
