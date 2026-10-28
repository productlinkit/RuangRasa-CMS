import { message } from "../locales";
import { useUsers } from "../hooks/useUsers";
import { useState } from "react";

import { UserDrawer } from "../components/dialogs";

import {
  AccessBanner,
  Badge,
  Button,
  Icon,
  PageTitle,
  localizeStatus,
} from "../components/ui";

import { RELATIONSHIP_CONTEXTS, copy } from "../data/mock/index";

import { useEscape } from "../hooks/useEscape";

import { Access, Language, Role, UserData } from "../types/index";

export function UsersPage({
  language,
  role,
  access,
  onAudit,
  onOpenAudit,
}: {
  language: Language;
  role: Role;
  access: Access;
  onAudit: (action: string, object: string, reason: string) => void;
  onOpenAudit: () => void;
}) {
  const { users, loading, error, updateUser: saveUser } = useUsers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [userLanguage, setUserLanguage] = useState("");
  const [context, setContext] = useState("");
  const [joined, setJoined] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEscape(() => setFiltersOpen(false), filtersOpen);
  const t = message(language, "pages.UsersPage.001");
  const filtered = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${user.id} ${user.name} ${user.phone}`
          .toLowerCase()
          .includes(query)) &&
      (!plan ||
        (plan === "Premium" ? user.simulatedPremium : user.plan === plan)) &&
      (!userLanguage || user.language === userLanguage) &&
      (!context || user.context === context) &&
      (!joined || user.joinedDays <= Number(joined)) &&
      (!status || user.status === status)
    );
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const visible = filtered.slice((page - 1) * 6, page * 6);
  const selected = users.find((user) => user.id === selectedId);
  function setFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }
  function updateUser(next: UserData) {
    return saveUser(next);
  }
  function showToast(message: string, isError = false) {
    setToast(message);
    setToastError(isError);
    window.setTimeout(() => setToast(""), 3200);
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="users-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.UsersPage.002")}
            title={message(language, "pages.UsersPage.003")}
            accent={message(language, "pages.UsersPage.004")}
          />
          <p>{t.subtitle}</p>
        </div>
        <Badge>{copy[language].sample}</Badge>
      </section>
      <section className="user-kpis">
        {[
          [t.total, "10.482", "group"],
          [t.active, "3.116", "bolt"],
          [t.premium, "1.204", "workspace_premium"],
          [t.blocked, "17", "block"],
        ].map(([label, value, icon], index) => (
          <article
            className={`card user-kpi ${index === 3 ? "user-kpi--danger" : ""}`}
            key={label}
          >
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
              {index === 2 && (
                <Badge>{message(language, "pages.UsersPage.005")}</Badge>
              )}
            </div>
            <Icon>{icon}</Icon>
          </article>
        ))}
      </section>
      <section className="card users-card">
        <div className="user-toolbar">
          <label className="user-search">
            <Icon>search</Icon>
            <input
              value={search}
              onChange={(event) => setFilter(setSearch, event.target.value)}
              placeholder={t.search}
            />
          </label>
          <button
            className="mobile-filter-button"
            onClick={() => setFiltersOpen(true)}
          >
            <Icon>filter_list</Icon>
            {message(language, "pages.UsersPage.006")}
          </button>
          {[
            [t.plan, plan, setPlan, ["Free", "Premium"]],
            [
              t.language,
              userLanguage,
              setUserLanguage,
              ["Bahasa Indonesia", "Jaksel mix", "English"],
            ],
            [t.context, context, setContext, RELATIONSHIP_CONTEXTS],
            [
              t.joined,
              joined,
              setJoined,
              [
                ["7", "7 hari"],
                ["30", "30 hari"],
                ["90", "90 hari"],
              ],
            ],
            [
              t.status,
              status,
              setStatus,
              ["Aktif", "Diblokir", "Data dihapus"],
            ],
          ].map(([label, value, setter, options]) => (
            <label className="filter-pill" key={label as string}>
              <select
                value={value as string}
                onChange={(event) =>
                  setFilter(
                    setter as (value: string) => void,
                    event.target.value,
                  )
                }
              >
                <option value="">{label as string}</option>
                {(options as ReadonlyArray<string | readonly string[]>).map(
                  (option) => {
                    const optionValue = Array.isArray(option)
                      ? option[0]
                      : option;
                    const optionLabel = Array.isArray(option)
                      ? option[1]
                      : label === t.status
                        ? localizeStatus(language, option as string)
                        : label === t.plan && option === "Premium"
                          ? message(language, "pages.UsersPage.007")
                          : option;
                    return (
                      <option
                        key={optionValue as string}
                        value={optionValue as string}
                      >
                        {optionLabel}
                      </option>
                    );
                  },
                )}
              </select>
              <Icon>expand_more</Icon>
            </label>
          ))}
        </div>
        <div className="users-info">
          <Icon>visibility_off</Icon>
          <span>{t.privacy}</span>
        </div>
        {(loading || error) && (
          <div className="empty-state" role={error ? "alert" : "status"}>
            {loading ? "Memuat data pengguna dari API lokal…" : error}
          </div>
        )}
        <div className="table-wrap user-table-wrap responsive-table-desktop">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t.nickname}</th>
                <th>{t.phone}</th>
                <th>{t.language.toUpperCase()}</th>
                <th>{t.context.toUpperCase()}</th>
                <th>{t.joined.toUpperCase()}</th>
                <th>{t.activity}</th>
                <th>{t.status.toUpperCase()}</th>
                <th>PLAN</th>
                <th>{t.sessions}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id} onClick={() => setSelectedId(user.id)}>
                  <td>
                    <strong>{user.id}</strong>
                  </td>
                  <td>
                    <div className="table-name">
                      <span>{user.name.charAt(0)}</span>
                      <b>{user.name}</b>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.language}</td>
                  <td>
                    <span className="context-cell">{user.context}</span>
                  </td>
                  <td>{user.joined}</td>
                  <td>{user.activity}</td>
                  <td>
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
                  </td>
                  <td>
                    {user.simulatedPremium ? (
                      <Badge tone="warning">
                        {message(language, "pages.UsersPage.008")}
                      </Badge>
                    ) : (
                      <Badge>Free</Badge>
                    )}
                  </td>
                  <td className="session-count">{user.sessions}</td>
                  <td>
                    <Icon>chevron_right</Icon>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="empty-state">
              <Icon>search_off</Icon>
              {t.empty}
            </div>
          )}
        </div>
        <div className="mobile-card-list">
          {visible.map((user) => (
            <button
              className="mobile-data-card"
              key={user.id}
              onClick={() => setSelectedId(user.id)}
            >
              <div className="mobile-card-top">
                <span>{user.id}</span>
                <Icon>chevron_right</Icon>
              </div>
              <div className="mobile-card-title">
                <span>{user.name.charAt(0)}</span>
                <strong>{user.name}</strong>
              </div>
              <div className="mobile-card-badges">
                {user.simulatedPremium ? (
                  <Badge tone="warning">
                    {message(language, "pages.UsersPage.009")}
                  </Badge>
                ) : (
                  <Badge>Free</Badge>
                )}
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
              </div>
              <dl>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>{user.phone}</dd>
                </div>
                <div>
                  <dt>{t.context}</dt>
                  <dd>{user.context}</dd>
                </div>
              </dl>
            </button>
          ))}
        </div>
        <div className="users-pagination">
          <span>{filtered.length} user</span>
          <div>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              <Icon>chevron_left</Icon>
            </button>
            <b>
              {t.page} {page} / {pageCount}
            </b>
            <button
              disabled={page === pageCount}
              onClick={() => setPage(page + 1)}
            >
              <Icon>chevron_right</Icon>
            </button>
          </div>
        </div>
      </section>
      {filtersOpen && (
        <div
          className="bottom-sheet-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setFiltersOpen(false)
          }
        >
          <section className="filter-sheet">
            <div className="sheet-handle" />
            <div className="sheet-heading">
              <h2>{message(language, "pages.UsersPage.010")}</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <Icon>close</Icon>
              </button>
            </div>
            {[
              [t.plan, plan, setPlan, ["Free", "Premium"]],
              [
                t.status,
                status,
                setStatus,
                ["Aktif", "Diblokir", "Data dihapus"],
              ],
              [t.context, context, setContext, RELATIONSHIP_CONTEXTS],
            ].map(([label, value, setter, options]) => (
              <label className="sheet-select" key={label as string}>
                <span>{label as string}</span>
                <select
                  value={value as string}
                  onChange={(event) =>
                    setFilter(
                      setter as (value: string) => void,
                      event.target.value,
                    )
                  }
                >
                  <option value="">—</option>
                  {(options as readonly string[]).map((option) => (
                    <option key={option} value={option}>
                      {label === t.status
                        ? localizeStatus(language, option)
                        : label === t.plan && option === "Premium"
                          ? message(language, "pages.UsersPage.011")
                          : option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <Button kind="primary" onClick={() => setFiltersOpen(false)}>
              {message(language, "pages.UsersPage.012")}
            </Button>
          </section>
        </div>
      )}
      {selected && (
        <UserDrawer
          user={selected}
          language={language}
          role={role}
          access={access}
          onClose={() => setSelectedId(null)}
          onUpdate={updateUser}
          onAudit={onAudit}
          onToast={showToast}
          onOpenAudit={onOpenAudit}
        />
      )}
      {toast && (
        <div className="toast" role={toastError ? "alert" : "status"}>
          <Icon>{toastError ? "error" : "check_circle"}</Icon>
          {toast}
        </div>
      )}
    </>
  );
}

export default UsersPage;
