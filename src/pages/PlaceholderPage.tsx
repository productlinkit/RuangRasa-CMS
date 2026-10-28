import { message } from "../locales";

import { AccessBanner, Badge, Button, Icon, PageTitle } from "../components/ui";

import { copy, navigation } from "../data/mock/index";

import { Access, Language, Role } from "../types/index";

export function Placeholder({
  item,
  language,
  role,
  access,
  onBack,
}: {
  item: (typeof navigation)[number];
  language: Language;
  role: Role;
  access: Access;
  onBack: () => void;
}) {
  const t = copy[language];
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <PageTitle
        eyebrow={item.label[
          message(language, "pages.PlaceholderPage.001")
        ].toUpperCase()}
        title={item.title[message(language, "pages.PlaceholderPage.002")]}
        accent={item.accent[message(language, "pages.PlaceholderPage.003")]}
      />
      <article className="card placeholder-card">
        <div className="placeholder-icon">
          <Icon>{item.icon}</Icon>
        </div>
        <Badge>{t.sample}</Badge>
        <h2>{t.placeholder}</h2>
        <p>{t.placeholderCopy}</p>
        <Button kind="primary" onClick={onBack}>
          <Icon>arrow_back</Icon>
          {t.back}
        </Button>
      </article>
    </>
  );
}

export default Placeholder;
