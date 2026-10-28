export function PageTitle({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  accent: string;
}) {
  return (
    <div className="page-title">
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h1>
        {title} <em>{accent}</em>
      </h1>
    </div>
  );
}
