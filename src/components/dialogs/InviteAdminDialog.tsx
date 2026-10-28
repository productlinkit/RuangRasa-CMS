import { message } from "../../locales";
import { useState } from "react";
import { Button, Icon } from "../ui";
import { roles } from "../../data/mock/index";
import { useEscape } from "../../hooks/useEscape";
import { Language, Role } from "../../types/index";

export function InviteAdminDialog({
  language,
  onClose,
  onInvite,
}: {
  language: Language;
  onClose: () => void;
  onInvite: (email: string, role: Role) => void;
}) {
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Product/Ops");
  useEscape(onClose);
  const valid = email.includes("@") && email.includes(".");
  return (
    <div className="modal-backdrop">
      <div
        className="reason-dialog invite-dialog"
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose}>
          <Icon>close</Icon>
        </button>
        <div className="dialog-icon">
          <Icon>person_add</Icon>
        </div>
        <h2>{message(language, "components.dialogs.InviteAdminDialog.001")}</h2>
        <p>{message(language, "components.dialogs.InviteAdminDialog.002")}</p>
        <label className="field">
          <span>
            {message(language, "components.dialogs.InviteAdminDialog.003")}
          </span>
          <div className="input-wrap">
            <Icon>mail</Icon>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@ruangrasa.id"
            />
          </div>
        </label>
        <label className="invite-role">
          <span>Role</span>
          <select
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as Role)}
          >
            {roles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Icon>expand_more</Icon>
        </label>
        <div className="invite-mfa-note">
          <Icon>verified_user</Icon>
          <span>
            {message(language, "components.dialogs.InviteAdminDialog.004")}
          </span>
        </div>
        <div className="audit-warning">
          <Icon>history</Icon>
          {message(language, "components.dialogs.InviteAdminDialog.005")}
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose}>
            {message(language, "components.dialogs.InviteAdminDialog.006")}
          </Button>
          <Button
            kind="primary"
            disabled={!valid}
            onClick={() => onInvite(email, inviteRole)}
          >
            {message(language, "components.dialogs.InviteAdminDialog.007")}
          </Button>
        </div>
      </div>
    </div>
  );
}
