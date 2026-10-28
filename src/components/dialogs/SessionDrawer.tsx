import { message } from "../../locales";
import { Badge, Button, Icon, localizeStatus } from "../ui";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useEscape } from "../../hooks/useEscape";
import { Language, Role, SessionData } from "../../types/index";

export function SessionDrawer({
  session,
  language,
  role,
  onClose,
  onOpen,
}: {
  session: SessionData;
  language: Language;
  role: Role;
  onClose: () => void;
  onOpen: () => void;
}) {
  const breakpoint = useBreakpoint();
  const canOpen = role === "Super Admin" || role === "Safety Reviewer";
  const isGroup = session.mode === "Group mediation";
  useEscape(onClose);
  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside className="session-drawer">
        <div className="session-drawer__header">
          <div>
            <span>{session.id}</span>
            <h2>{session.name}</h2>
            <div>
              <Badge
                tone={
                  session.status === "Krisis"
                    ? "danger"
                    : session.status === "Abuse"
                      ? "warning"
                      : session.status === "Aktif"
                        ? "whatsapp"
                        : "neutral"
                }
              >
                {localizeStatus(language, session.status)}
              </Badge>
              <Badge>
                <Icon>schedule</Icon>
                {session.duration}
              </Badge>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon>{breakpoint === "mobile" ? "arrow_back" : "close"}</Icon>
          </button>
        </div>
        <div className="session-drawer__body">
          <section className="drawer-section">
            <h3>{message(language, "components.dialogs.SessionDrawer.001")}</h3>
            <dl className="session-info">
              <div>
                <dt>
                  {message(language, "components.dialogs.SessionDrawer.002")}
                </dt>
                <dd>{session.phone}</dd>
              </div>
              <div>
                <dt>
                  {message(language, "components.dialogs.SessionDrawer.003")}
                </dt>
                <dd>{session.name}</dd>
              </div>
              <div>
                <dt>
                  {message(language, "components.dialogs.SessionDrawer.004")}
                </dt>
                <dd>{session.context}</dd>
              </div>
              <div>
                <dt>Mode</dt>
                <dd>{session.mode}</dd>
              </div>
              <div>
                <dt>
                  {message(language, "components.dialogs.SessionDrawer.005")}
                </dt>
                <dd>{session.language}</dd>
              </div>
            </dl>
          </section>
          <div className="consent-card">
            <Icon>verified_user</Icon>
            <div>
              <strong>Consent</strong>
              <span>
                {message(language, "components.dialogs.SessionDrawer.006")}
              </span>
            </div>
          </div>
          {isGroup && (
            <section className="drawer-section">
              <h3>
                {message(language, "components.dialogs.SessionDrawer.007")}
              </h3>
              <div className="mediation-participants">
                <div>
                  <span>Pihak A</span>
                  <Badge tone="success">
                    <Icon>check</Icon>Consent
                  </Badge>
                </div>
                <div>
                  <span>Pihak B</span>
                  <Badge tone="success">
                    <Icon>check</Icon>Consent
                  </Badge>
                </div>
              </div>
              <p className="section-note">
                <Icon>balance</Icon>
                {message(language, "components.dialogs.SessionDrawer.008")}
              </p>
            </section>
          )}
          {canOpen ? (
            <section className="transcript-access">
              <Icon>chat_lock</Icon>
              <h3>
                {message(language, "components.dialogs.SessionDrawer.009")}
              </h3>
              <p>{message(language, "components.dialogs.SessionDrawer.010")}</p>
              <Button kind="primary" onClick={onOpen}>
                <Icon>lock_open</Icon>
                {message(language, "components.dialogs.SessionDrawer.011")}
              </Button>
            </section>
          ) : (
            <div className="locked-note">
              <Icon>lock</Icon>
              <div>
                <strong>
                  {message(language, "components.dialogs.SessionDrawer.012")}
                </strong>
                <p>
                  {message(language, "components.dialogs.SessionDrawer.013")}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
