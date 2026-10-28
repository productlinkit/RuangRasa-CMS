import { message } from "../locales";
import { usePersistentState } from "../hooks/usePersistentState";
import { localized } from "../i18n";
import { useState } from "react";

import { BillingActionDialog, PlanDrawer } from "../components/dialogs";

import {
  AccessBanner,
  Badge,
  Button,
  Icon,
  PageTitle,
  Toggle,
  localizeStatus,
} from "../components/ui";

import {
  copy,
  initialPlans,
  initialSubscriptions,
  initialTransactions,
  initialVouchers,
} from "../data/mock/index";

import { Access, Language, PlanData, Role } from "../types/index";

export function BillingPage({
  language,
  role,
  access,
  onAudit,
}: {
  language: Language;
  role: Role;
  access: Access;
  onAudit: (action: string, object: string, reason: string) => void;
}) {
  const editable =
    (role === "Super Admin" || role === "Finance/Billing") && access === "F";
  const [tab, setTab] = useState<
    "plans" | "subscriptions" | "transactions" | "vouchers"
  >("plans");
  const [plans, setPlans] = usePersistentState(
    "ruangrasa.billing.plans",
    initialPlans,
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [subscriptions, setSubscriptions] = usePersistentState(
    "ruangrasa.billing.subscriptions",
    initialSubscriptions,
  );
  const [transactions, setTransactions] = usePersistentState(
    "ruangrasa.billing.transactions",
    initialTransactions,
  );
  const [vouchers, setVouchers] = usePersistentState(
    "ruangrasa.billing.vouchers",
    initialVouchers,
  );
  const [action, setAction] = useState<{ kind: string; id: string } | null>(
    null,
  );
  const [toast, setToast] = useState("");
  const tabs = message(language, "pages.BillingPage.001");
  const simulation = message(language, "pages.BillingPage.002");
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  function confirmAction(reason: string) {
    if (!action) return;
    onAudit(`Billing: ${action.kind}`, action.id, reason);
    if (
      action.kind === "upgrade" ||
      action.kind === "downgrade" ||
      action.kind === "extend" ||
      action.kind === "cancel"
    )
      setSubscriptions((rows) =>
        rows.map((row) =>
          row.id !== action.id
            ? row
            : action.kind === "upgrade"
              ? { ...row, plan: "Premium Bulanan", status: "Aktif" }
              : action.kind === "downgrade"
                ? { ...row, plan: "Free", status: "Aktif" }
                : action.kind === "extend"
                  ? { ...row, next: "1 Des 2026", status: "Aktif" }
                  : { ...row, status: "Dibatalkan", next: "—" },
        ),
      );
    if (action.kind === "refund")
      setTransactions((rows) =>
        rows.map((row) =>
          row.id === action.id
            ? { ...row, status: "Refund", note: "Refund diproses oleh admin" }
            : row,
        ),
      );
    setAction(null);
    showToast(message(language, "pages.BillingPage.003"));
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="billing-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.BillingPage.004")}
            title={message(language, "pages.BillingPage.005")}
            accent={message(language, "pages.BillingPage.006")}
          />
          <p>{message(language, "pages.BillingPage.007")}</p>
        </div>
        <Badge>{copy[language].sample}</Badge>
      </section>
      <section className="billing-kpis">
        {[
          [
            "subscriptions",
            message(language, "pages.BillingPage.008"),
            "1.004",
          ],
          ["hourglass", "Trial", "87"],
          ["warning", message(language, "pages.BillingPage.009"), "23"],
          [
            "payments",
            message(language, "pages.BillingPage.010"),
            "Rp 49,2 jt",
          ],
        ].map(([icon, label, value], index) => (
          <article
            className={`card billing-kpi ${index === 2 ? "is-warning" : ""}`}
            key={label}
          >
            <Icon>{icon}</Icon>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
              <Badge>{message(language, "pages.BillingPage.011")}</Badge>
              {index === 2 && (
                <small>{message(language, "pages.BillingPage.012")}</small>
              )}
            </div>
          </article>
        ))}
      </section>
      <div className="billing-tabs">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            className={tab === value ? "is-active" : ""}
            onClick={() => setTab(value as typeof tab)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "plans" && (
        <>
          <div className="users-info plan-info">
            <Icon>info</Icon>
            <span>
              {message(language, "pages.BillingPage.013")}
              <b>
                {" "}
                “Free to start. Premium may come later, with notice first.”
              </b>
            </span>
          </div>
          <section className="plan-grid">
            {plans.map((plan) => (
              <article className="card plan-card" key={plan.id}>
                <div className="plan-card__top">
                  <div>
                    <h2>{plan.name}</h2>
                    {plan.paid && (
                      <span>{message(language, "pages.BillingPage.014")}</span>
                    )}
                  </div>
                  <Badge tone={plan.status === "Aktif" ? "success" : "warning"}>
                    {plan.status === "Draft"
                      ? "DRAFT"
                      : localizeStatus(language, plan.status)}
                  </Badge>
                </div>
                <div className="plan-price">
                  {plan.price === 0
                    ? "Rp 0"
                    : `Rp ${plan.price.toLocaleString("id-ID")}`}
                  <span>
                    /
                    {plan.cycle === "Bulanan"
                      ? message(language, "pages.BillingPage.015")
                      : message(language, "pages.BillingPage.016")}
                  </span>
                </div>
                {!plan.paid && (
                  <p className="free-copy">
                    Free to start · {message(language, "pages.BillingPage.017")}
                  </p>
                )}
                <ul>
                  <li>
                    <Icon>check</Icon>
                    {plan.sessions} {message(language, "pages.BillingPage.018")}
                  </li>
                  <li>
                    <Icon>check</Icon>
                    {localized(
                      language,
                      `Maks. ${plan.duration} menit/sesi`,
                      `Max ${plan.duration} minutes/session`,
                    )}
                  </li>
                  <li className={!plan.group ? "is-disabled" : ""}>
                    <Icon>{plan.group ? "check" : "close"}</Icon>
                    {message(language, "pages.BillingPage.019")}
                  </li>
                </ul>
                <footer>
                  <span>
                    {plan.subscribers.toLocaleString("id-ID")}{" "}
                    {message(language, "pages.BillingPage.020")} · v
                    {plan.version}
                  </span>
                  <Button onClick={() => setSelectedPlan(plan)}>
                    {editable
                      ? message(language, "pages.BillingPage.021")
                      : message(language, "pages.BillingPage.022")}
                  </Button>
                </footer>
              </article>
            ))}
            <button
              className="add-plan-card"
              disabled={!editable}
              onClick={() =>
                setSelectedPlan({
                  id: `new-${plans.length}`,
                  name: "Plan baru",
                  price: 0,
                  cycle: "Bulanan",
                  status: "Draft",
                  sessions: 5,
                  duration: 20,
                  group: false,
                  subscribers: 0,
                  version: 0,
                  paid: true,
                })
              }
            >
              <Icon>add</Icon>
              <span>{message(language, "pages.BillingPage.023")}</span>
            </button>
          </section>
        </>
      )}
      {tab !== "plans" && (
        <div className="simulation-banner">
          <Icon>science</Icon>
          {simulation}
        </div>
      )}
      {tab === "subscriptions" && (
        <section className="card billing-table-card">
          <div className="billing-table-tools">
            <h2>{message(language, "pages.BillingPage.024")}</h2>
            <label className="filter-pill">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">
                  {message(language, "pages.BillingPage.025")}
                </option>
                {["Aktif", "Trial", "Jatuh tempo", "Dibatalkan"].map((item) => (
                  <option key={item} value={item}>
                    {localizeStatus(language, item)}
                  </option>
                ))}
              </select>
              <Icon>expand_more</Icon>
            </label>
          </div>
          <div className="table-wrap responsive-table-desktop">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>PLAN</th>
                  <th>STATUS</th>
                  <th>{message(language, "pages.BillingPage.026")}</th>
                  <th>{message(language, "pages.BillingPage.027")}</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions
                  .filter((row) => !statusFilter || row.status === statusFilter)
                  .map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.id}</strong>
                      </td>
                      <td>
                        <b>{row.user}</b>
                        <span>{row.name}</span>
                      </td>
                      <td>{row.plan}</td>
                      <td>
                        <Badge
                          tone={
                            row.status === "Aktif"
                              ? "success"
                              : row.status === "Jatuh tempo"
                                ? "warning"
                                : row.status === "Dibatalkan"
                                  ? "danger"
                                  : "neutral"
                          }
                        >
                          {localizeStatus(language, row.status)}
                        </Badge>
                      </td>
                      <td>{row.next}</td>
                      <td>
                        <div className="billing-row-actions">
                          {[
                            ["upgrade", "upgrade"],
                            ["downgrade", "download"],
                            ["extend", "event_repeat"],
                            ["cancel", "cancel"],
                          ].map(([kind, icon]) => (
                            <button
                              key={kind}
                              disabled={!editable}
                              title={kind}
                              onClick={() => setAction({ kind, id: row.id })}
                            >
                              <Icon>{icon}</Icon>
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-card-list">
            {subscriptions
              .filter((row) => !statusFilter || row.status === statusFilter)
              .map((row) => (
                <article className="mobile-data-card" key={row.id}>
                  <div className="mobile-card-top">
                    <span>{row.id}</span>
                    <Badge
                      tone={
                        row.status === "Aktif"
                          ? "success"
                          : row.status === "Jatuh tempo"
                            ? "warning"
                            : row.status === "Dibatalkan"
                              ? "danger"
                              : "neutral"
                      }
                    >
                      {localizeStatus(language, row.status)}
                    </Badge>
                  </div>
                  <h3>
                    {row.name} · {row.user}
                  </h3>
                  <p>{row.plan}</p>
                  <dl>
                    <div>
                      <dt>{message(language, "pages.BillingPage.028")}</dt>
                      <dd>{row.next}</dd>
                    </div>
                  </dl>
                  <div className="billing-row-actions">
                    {[
                      ["upgrade", "upgrade"],
                      ["downgrade", "download"],
                      ["extend", "event_repeat"],
                      ["cancel", "cancel"],
                    ].map(([kind, icon]) => (
                      <button
                        key={kind}
                        disabled={!editable}
                        title={kind}
                        onClick={() => setAction({ kind, id: row.id })}
                      >
                        <Icon>{icon}</Icon>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}
      {tab === "transactions" && (
        <>
          <div className="gateway-strip">
            <span>
              <Icon>account_balance_wallet</Icon>
              <b>Payment gateway</b> · QRIS, e-wallet, virtual account ·{" "}
              {message(language, "pages.BillingPage.029")}
            </span>
            <Badge tone="warning">
              {message(language, "pages.BillingPage.030")}
            </Badge>
          </div>
          <section className="card billing-table-card">
            <div className="table-wrap responsive-table-desktop">
              <table className="billing-table transaction-table">
                <thead>
                  <tr>
                    <th>ID TRX</th>
                    <th>{message(language, "pages.BillingPage.031")}</th>
                    <th>USER</th>
                    <th>{message(language, "pages.BillingPage.032")}</th>
                    <th>{message(language, "pages.BillingPage.033")}</th>
                    <th>STATUS</th>
                    <th>{message(language, "pages.BillingPage.034")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.id}</strong>
                      </td>
                      <td>{row.time}</td>
                      <td>{row.user}</td>
                      <td>
                        <b>{row.amount}</b>
                      </td>
                      <td>{row.method}</td>
                      <td>
                        <Badge
                          tone={
                            row.status === "Berhasil"
                              ? "success"
                              : row.status === "Gagal"
                                ? "danger"
                                : row.status === "Menunggu"
                                  ? "warning"
                                  : "neutral"
                          }
                        >
                          {localizeStatus(language, row.status)}
                        </Badge>
                      </td>
                      <td>{row.note}</td>
                      <td>
                        {row.status === "Berhasil" && (
                          <Button
                            disabled={!editable}
                            onClick={() =>
                              setAction({ kind: "refund", id: row.id })
                            }
                          >
                            Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-card-list">
              {transactions.map((row) => (
                <article className="mobile-data-card" key={row.id}>
                  <div className="mobile-card-top">
                    <span>{row.id}</span>
                    <Badge
                      tone={
                        row.status === "Berhasil"
                          ? "success"
                          : row.status === "Gagal"
                            ? "danger"
                            : row.status === "Menunggu"
                              ? "warning"
                              : "neutral"
                      }
                    >
                      {localizeStatus(language, row.status)}
                    </Badge>
                  </div>
                  <h3>{row.user}</h3>
                  <div className="mobile-card-badges">
                    <Badge>{row.method}</Badge>
                    <strong>{row.amount}</strong>
                  </div>
                  <p>{row.note}</p>
                  <small>{row.time}</small>
                  {row.status === "Berhasil" && (
                    <Button
                      disabled={!editable}
                      onClick={() => setAction({ kind: "refund", id: row.id })}
                    >
                      Refund
                    </Button>
                  )}
                </article>
              ))}
            </div>
          </section>
        </>
      )}
      {tab === "vouchers" && (
        <section className="card voucher-card">
          <div className="billing-table-tools">
            <div>
              <h2>Voucher & trial</h2>
              <p>{message(language, "pages.BillingPage.035")}</p>
            </div>
            <Button
              kind="primary"
              disabled={!editable}
              onClick={() => {
                setVouchers([
                  ...vouchers,
                  ["BARU10", "Diskon 10%", "0 / 100", "31 Jan 2027", false],
                ]);
                onAudit("Membuat voucher", "BARU10", "Voucher contoh baru");
                showToast(message(language, "pages.BillingPage.036"));
              }}
            >
              <Icon>add</Icon>
              {message(language, "pages.BillingPage.037")}
            </Button>
          </div>
          <div className="voucher-list">
            {vouchers.map((voucher, index) => (
              <div key={`${voucher[0]}-${index}`}>
                <div className="voucher-code">
                  <Icon>confirmation_number</Icon>
                  <div>
                    <strong>{voucher[0]}</strong>
                    <span>{voucher[1]}</span>
                  </div>
                </div>
                <div>
                  <span>{message(language, "pages.BillingPage.038")}</span>
                  <b>{voucher[2]}</b>
                </div>
                <div>
                  <span>{message(language, "pages.BillingPage.039")}</span>
                  <b>{voucher[3]}</b>
                </div>
                <Toggle
                  checked={voucher[4]}
                  disabled={!editable}
                  label={voucher[0]}
                  onChange={() => {
                    const next = [...vouchers];
                    next[index] = [
                      ...voucher.slice(0, 4),
                      !voucher[4],
                    ] as typeof voucher;
                    setVouchers(next);
                    onAudit(
                      "Mengubah status voucher",
                      voucher[0],
                      !voucher[4] ? "Diaktifkan" : "Dinonaktifkan",
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
      {selectedPlan && (
        <PlanDrawer
          plan={selectedPlan}
          editable={editable}
          language={language}
          onClose={() => setSelectedPlan(null)}
          onAudit={onAudit}
          onSave={(next) => {
            setPlans((current) =>
              current.some((item) => item.id === next.id)
                ? current.map((item) => (item.id === next.id ? next : item))
                : [...current, next],
            );
            showToast(message(language, "pages.BillingPage.040"));
          }}
        />
      )}
      {action && (
        <BillingActionDialog
          title={message(language, "pages.BillingPage.041")}
          object={`${action.kind} · ${action.id}`}
          language={language}
          onClose={() => setAction(null)}
          onConfirm={confirmAction}
        />
      )}
      {toast && (
        <div className="toast">
          <Icon>check_circle</Icon>
          {toast}
        </div>
      )}
    </>
  );
}

export default BillingPage;
