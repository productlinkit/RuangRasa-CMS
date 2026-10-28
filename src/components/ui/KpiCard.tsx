import { Icon } from "./Icon";

export function KpiCard({
  value,
  label,
  detail,
  danger = false,
  neutral = false,
}: {
  value: string;
  label: string;
  detail: string;
  danger?: boolean;
  neutral?: boolean;
}) {
  return (
    <article className={`card kpi-card ${danger ? "kpi-card--danger" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div
        className={`kpi-detail ${danger ? "is-danger" : neutral ? "is-neutral" : ""}`}
      >
        {!danger && !neutral && <Icon>arrow_upward</Icon>}
        {detail}
      </div>
    </article>
  );
}
