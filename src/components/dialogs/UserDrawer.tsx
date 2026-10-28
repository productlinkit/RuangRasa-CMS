import { message } from "../../locales";
import { localized } from "../../i18n";
import { ReasonDialog } from "./ReasonDialog";
import { useState } from "react";
import { Badge, Button, Icon, localizeStatus } from "../ui";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useEscape } from "../../hooks/useEscape";
import {
  Access,
  Language,
  Role,
  SensitiveAction,
  UserData,
} from "../../types/index";

export function UserDrawer({
  user,
  language,
  role,
  access,
  onClose,
  onUpdate,
  onAudit,
  onToast,
  onOpenAudit,
}: {
  user: UserData;
  language: Language;
  role: Role;
  access: Access;
  onClose: () => void;
  onUpdate: (user: UserData) => void | Promise<void>;
  onAudit: (
    action: string,
    object: string,
    reason: string,
  ) => void | Promise<void>;
  onToast: (message: string, isError?: boolean) => void;
  onOpenAudit: () => void;
}) {
  const [action, setAction] = useState<SensitiveAction | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    "Follow-up consent selesai · Dina · 2 Okt 2026",
  ]);
  const breakpoint = useBreakpoint();
  useEscape(onClose);
  const metadataOnly = access === "M";
  const canReveal = role === "Super Admin" || role === "Product/Ops";
  const tx = localized(
    language,
    {
      profile: "Profil ringkas",
      show: "Tampilkan",
      hide: "Sembunyikan",
      language: "Bahasa",
      context: "Konteks",
      joined: "Bergabung",
      activity: "Aktivitas terakhir",
      consent: "Consent aktif",
      history: "Riwayat sesi",
      meta: "Hanya metadata. Isi percakapan dibuka dari menu Sesi oleh role yang berwenang.",
      payment: "Riwayat plan & pembayaran",
      success: "Berhasil",
      plan: "Plan aktual",
      testPlan: "Premium — Simulasi, belum diluncurkan",
      audit: "Buka entri Audit Log",
      notes: "Catatan internal",
      add: "Tambah catatan…",
      save: "Simpan",
      notChat: "Bukan isi chat.",
      actions: "Tindakan",
      changePlan: "Ubah plan",
      export: "Ekspor data user",
      block: user.status === "Diblokir" ? "Buka blokir" : "Blokir user",
      delete: "Hapus data user",
      locked:
        role === "Finance/Billing"
          ? "Profil metadata saja. Riwayat sesi dan catatan tidak tersedia untuk role ini."
          : "Hanya metadata. Riwayat detail dan catatan dikunci untuk role ini.",
    },
    {
      profile: "Profile summary",
      show: "Reveal",
      hide: "Hide",
      language: "Language",
      context: "Context",
      joined: "Joined",
      activity: "Last activity",
      consent: "Active consent",
      history: "Session history",
      meta: "Metadata only. Conversation content can only be opened from Sessions by an authorised role.",
      payment: "Plan & payment history",
      success: "Successful",
      plan: "Current plan",
      testPlan: "Premium — Simulation, not launched",
      audit: "Open Audit Log entry",
      notes: "Internal notes",
      add: "Add note…",
      save: "Save",
      notChat: "Not chat content.",
      actions: "Actions",
      changePlan: "Change plan",
      export: "Export user data",
      block: user.status === "Diblokir" ? "Unblock" : "Block user",
      delete: "Delete user data",
      locked:
        role === "Finance/Billing"
          ? "Profile metadata only. Session history and notes are unavailable to this role."
          : "Metadata only. Detailed history and notes are locked for this role.",
    },
  );
  async function confirm(reason: string) {
    if (!action) return;
    const auditNames: Record<SensitiveAction, string> = {
      reveal: "Membuka nomor WhatsApp penuh",
      plan: "Mengubah plan pengguna",
      export: "Mengekspor data pengguna",
      block:
        user.status === "Diblokir"
          ? "Membuka blokir pengguna"
          : "Memblokir pengguna",
      delete: "Menghapus data pengguna",
    };
    try {
      if (action === "plan") {
        await onUpdate({
          ...user,
          plan: "Free",
          simulatedPremium: !user.simulatedPremium,
        });
      }
      if (action === "block") {
        await onUpdate({
          ...user,
          status: user.status === "Diblokir" ? "Aktif" : "Diblokir",
        });
      }
      if (action === "delete") {
        await onUpdate({ ...user, status: "Data dihapus", sessions: 0 });
      }
      await onAudit(auditNames[action], user.id, reason);
      if (action === "reveal") setRevealed(true);
      onToast(message(language, "components.dialogs.UserDrawer.001"));
      setAction(null);
    } catch (error) {
      onToast(
        error instanceof Error ? error.message : "Unable to save this action.",
        true,
      );
    }
  }
  return (
    <>
      <div
        className="drawer-backdrop"
        onMouseDown={(event) =>
          event.target === event.currentTarget && onClose()
        }
      >
        <aside className="user-drawer" aria-label={user.name}>
          <div className="drawer-header">
            <div className="drawer-avatar">{user.name.charAt(0)}</div>
            <div>
              <span>{user.id}</span>
              <h2>{user.name}</h2>
              <div>
                <Badge
                  tone={
                    user.status === "Aktif"
                      ? "success"
                      : user.status === "Diblokir"
                        ? "danger"
                        : "neutral"
                  }
                >
                  {localizeStatus(language, user.status)}
                </Badge>
                <Badge>{user.plan}</Badge>
                {user.simulatedPremium && (
                  <Badge tone="warning">
                    {message(language, "components.dialogs.UserDrawer.002")}
                  </Badge>
                )}
              </div>
            </div>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label={message(
                language,
                "components.dialogs.UserDrawer.003",
              )}
            >
              <Icon>{breakpoint === "mobile" ? "arrow_back" : "close"}</Icon>
            </button>
          </div>
          <div className="drawer-body">
            <section className="drawer-section">
              <h3>{tx.profile}</h3>
              <dl className="profile-grid">
                <div>
                  <dt>
                    {message(language, "components.dialogs.UserDrawer.004")}
                  </dt>
                  <dd>{user.name}</dd>
                </div>
                <div className="phone-detail">
                  <dt>WhatsApp</dt>
                  <dd>
                    {revealed ? user.fullPhone : user.phone}
                    {canReveal && !metadataOnly && (
                      <button
                        onClick={() =>
                          revealed ? setRevealed(false) : setAction("reveal")
                        }
                      >
                        {revealed ? tx.hide : tx.show}
                      </button>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{tx.language}</dt>
                  <dd>{user.language}</dd>
                </div>
                <div>
                  <dt>{tx.context}</dt>
                  <dd>{user.context}</dd>
                </div>
                <div>
                  <dt>{tx.joined}</dt>
                  <dd>{user.joined}</dd>
                </div>
                <div>
                  <dt>{tx.activity}</dt>
                  <dd>{user.activity}</dd>
                </div>
                <div className="profile-plan">
                  <dt>{tx.plan}</dt>
                  <dd>
                    <select
                      value="Free"
                      disabled={metadataOnly}
                      onChange={(event) =>
                        event.target.value === "Premium" && setAction("plan")
                      }
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">{tx.testPlan}</option>
                    </select>
                  </dd>
                </div>
              </dl>
            </section>
            <div className="consent-card">
              <Icon>verified_user</Icon>
              <div>
                <strong>{tx.consent}</strong>
                <span>v2.1 · 12 Sep 2026 14:08</span>
              </div>
            </div>
            {metadataOnly ? (
              <div className="locked-note">
                <Icon>lock</Icon>
                <div>
                  <strong>
                    {message(language, "components.dialogs.UserDrawer.005")}
                  </strong>
                  <p>{tx.locked}</p>
                </div>
              </div>
            ) : (
              <>
                <section className="drawer-section">
                  <h3>{tx.history}</h3>
                  <div className="session-history">
                    {[
                      ["SES-7A92", "7 Okt 2026", "1-on-1", "38 min"],
                      ["SES-63D1", "4 Okt 2026", "Group mediation", "52 min"],
                      ["SES-218F", "29 Sep 2026", "1-on-1", "24 min"],
                    ].map((row) => (
                      <div key={row[0]}>
                        {row.map((value) => (
                          <span key={value}>{value}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className="section-note">
                    <Icon>lock</Icon>
                    {tx.meta}
                  </p>
                  {user.id === "RR-48190" && (
                    <Button onClick={onOpenAudit}>
                      <Icon>history</Icon>
                      {tx.audit} · AUD-1008
                    </Button>
                  )}
                </section>
                <section className="drawer-section">
                  <h3>{tx.payment}</h3>
                  {user.simulatedPremium ? (
                    <div className="payment-row">
                      <div>
                        <strong>RR-PAY-9281</strong>
                        <span>
                          {message(
                            language,
                            "components.dialogs.UserDrawer.006",
                          )}
                        </span>
                      </div>
                      <b>Rp49.000</b>
                      <Badge tone="warning">
                        {message(language, "components.dialogs.UserDrawer.007")}
                      </Badge>
                    </div>
                  ) : (
                    <p>
                      {message(language, "components.dialogs.UserDrawer.008")}
                    </p>
                  )}
                </section>
                <section className="drawer-section">
                  <h3>{tx.notes}</h3>
                  <div className="note-list">
                    {notes.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                  <div className="note-input">
                    <input
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder={tx.add}
                    />
                    <Button
                      disabled={!note.trim()}
                      onClick={() => {
                        setNotes([...notes, note]);
                        setNote("");
                      }}
                    >
                      {tx.save}
                    </Button>
                  </div>
                  <small>{tx.notChat}</small>
                </section>
                <section className="drawer-section action-section">
                  <h3>{tx.actions}</h3>
                  <div className="action-grid">
                    <Button onClick={() => setAction("plan")}>
                      <Icon>loyalty</Icon>
                      {tx.changePlan}
                    </Button>
                    <Button onClick={() => setAction("export")}>
                      <Icon>download</Icon>
                      {tx.export}
                    </Button>
                    <Button onClick={() => setAction("block")}>
                      <Icon>block</Icon>
                      {tx.block}
                    </Button>
                    <Button
                      kind="danger-outline"
                      onClick={() => setAction("delete")}
                    >
                      <Icon>delete</Icon>
                      {tx.delete}
                    </Button>
                  </div>
                </section>
              </>
            )}
          </div>
        </aside>
      </div>
      {action && (
        <ReasonDialog
          action={action}
          language={language}
          user={user}
          onClose={() => setAction(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
