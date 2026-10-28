import { copy } from "../../data/mock/index";
import { Access, Language, Role } from "../../types/index";
import { Badge } from "./Badge";
import { Icon } from "./Icon";

export function AccessBanner({
  role,
  language,
  access,
}: {
  role: Role;
  language: Language;
  access: Access;
}) {
  if (access === "F") return null;
  return (
    <div className="access-banner">
      <Icon>visibility</Icon>
      <span>{copy[language].access.replace("{role}", role)}</span>
      <Badge>{access === "M" ? "Metadata" : "Read only"}</Badge>
    </div>
  );
}
