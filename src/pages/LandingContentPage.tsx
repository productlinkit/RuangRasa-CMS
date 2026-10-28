import { message } from "../locales";
import { usePersistentState } from "../hooks/usePersistentState";
import { localized } from "../i18n";
import { useState } from "react";

import { HeroMiniPreview, LandingPublishDialog } from "../components/dialogs";

import { AccessBanner, Badge, Button, Icon, PageTitle } from "../components/ui";

import {
  heroPhoto,
  initialHeroEN,
  initialHeroID,
  landingSectionDefs,
  landingTrustChecklist,
} from "../data/mock/index";

import { Access, Language, Role } from "../types/index";

export function LandingContentPage({
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
    access === "F" && (role === "Super Admin" || role === "Content Editor");
  const [selected, setSelected] = useState("hero");
  const [contentLanguage, setContentLanguage] = useState<Language>("EN");
  const [publishOpen, setPublishOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [accentMarked, setAccentMarked] = useState(true);
  const [landingView, setLandingView] = useState<"edit" | "preview">("edit");
  const [previewWidth, setPreviewWidth] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [toast, setToast] = useState("");
  const [scheduled, setScheduled] = usePersistentState(
    "ruangrasa.landingcontent.scheduled",
    "12 Okt 2026 · 09:00 WIB",
  );
  const [sectionContent, setSectionContent] = useState<
    Record<string, { en: string[]; id: string[] }>
  >(() =>
    Object.fromEntries(
      landingSectionDefs.map((item) => [
        item.id,
        { en: [...item.en], id: [...item.idText] },
      ]),
    ),
  );
  const [heroEN, setHeroEN] = usePersistentState(
    "ruangrasa.landingcontent.heroEN",
    initialHeroEN,
  );
  const [heroID, setHeroID] = usePersistentState(
    "ruangrasa.landingcontent.heroID",
    initialHeroID,
  );
  const activeDef = landingSectionDefs.find((item) => item.id === selected)!;
  const t = message(language, "pages.LandingContentPage.001");
  const checklist = landingTrustChecklist;
  function updateGeneric(lang: "en" | "id", index: number, value: string) {
    if (!editable) return;
    setSectionContent((current) => ({
      ...current,
      [selected]: {
        ...current[selected],
        [lang]: current[selected][lang].map((item, itemIndex) =>
          itemIndex === index ? value : item,
        ),
      },
    }));
  }
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }
  function publish(reason: string) {
    onAudit("Publish Konten Landing", "Landing Page v25", reason);
    setPublishOpen(false);
    showToast(message(language, "pages.LandingContentPage.002"));
  }
  return (
    <>
      <AccessBanner role={role} language={language} access={access} />
      <section className="landing-heading">
        <div>
          <PageTitle
            eyebrow={message(language, "pages.LandingContentPage.003")}
            title={message(language, "pages.LandingContentPage.004")}
            accent={message(language, "pages.LandingContentPage.005")}
          />
          <p>{t.subtitle}</p>
        </div>
        <div>
          <Button onClick={() => setPreviewOpen(true)}>
            <Icon>visibility</Icon>
            {t.preview}
          </Button>
          <Button
            kind="primary"
            disabled={!editable}
            onClick={() => setPublishOpen(true)}
          >
            <Icon>publish</Icon>
            {t.publish}
          </Button>
        </div>
      </section>
      <div className="landing-languagebar">
        <div className="language-toggle">
          {(["ID", "EN"] as Language[]).map((item) => (
            <button
              key={item}
              className={contentLanguage === item ? "is-active" : ""}
              onClick={() => setContentLanguage(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span>
          <Icon>language</Icon>
          {t.source}
        </span>
        <Badge tone="warning">
          <Icon>warning</Icon>
          {t.missing}
        </Badge>
      </div>
      <div className="landing-layout">
        <aside className="card landing-sections">
          <div className="landing-sections__heading">
            <h2>{message(language, "pages.LandingContentPage.006")}</h2>
            <Badge>13</Badge>
          </div>
          {landingSectionDefs.map((section, index) => (
            <button
              key={section.id}
              className={selected === section.id ? "is-active" : ""}
              onClick={() => setSelected(section.id)}
            >
              <span className="section-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon>{section.icon}</Icon>
              <div>
                <strong>{section.name}</strong>
                <small>
                  {section.count}{" "}
                  {message(language, "pages.LandingContentPage.007")}
                </small>
              </div>
              <Icon>chevron_right</Icon>
            </button>
          ))}
        </aside>
        <main className="landing-editor-column">
          <div className="landing-view-tabs">
            <button
              className={landingView === "edit" ? "is-active" : ""}
              onClick={() => setLandingView("edit")}
            >
              {message(language, "pages.LandingContentPage.008")}
            </button>
            <button
              className={landingView === "preview" ? "is-active" : ""}
              onClick={() => setLandingView("preview")}
            >
              {message(language, "pages.LandingContentPage.009")}
            </button>
          </div>
          <article
            className={`card landing-editor ${landingView !== "edit" ? "is-responsive-hidden" : ""}`}
          >
            <div className="landing-editor__heading">
              <div>
                <span>{t.editor}</span>
                <h2>{activeDef.name}</h2>
              </div>
              <Badge>{contentLanguage}</Badge>
            </div>
            {selected === "hero" ? (
              <div className="hero-editor">
                <div className="bilingual-head">
                  <span>
                    EN · {message(language, "pages.LandingContentPage.010")}
                  </span>
                  <span>
                    ID · {message(language, "pages.LandingContentPage.011")}
                  </span>
                </div>
                {(
                  [
                    ["eyebrow", "Eyebrow"],
                    ["headline", "Headline"],
                    ["subheadline", "Subheadline"],
                    ["cta", "CTA utama"],
                    ["secondary", "CTA kedua"],
                    ["stat1", "Stat strip 1"],
                    ["stat2", "Stat strip 2"],
                    ["stat3", "Stat strip 3"],
                    ["floating1", "Floating card title"],
                    ["floating2", "Floating card detail"],
                    ["phone", "WhatsApp tujuan"],
                    ["prefilled", "Pesan prefilled"],
                  ] as Array<[keyof typeof heroEN, string]>
                ).map(([key, label]) => (
                  <div className="bilingual-field" key={key}>
                    <label>
                      <span>{label}</span>
                      {key === "subheadline" || key === "prefilled" ? (
                        <textarea
                          disabled={!editable}
                          value={heroEN[key]}
                          onChange={(event) =>
                            setHeroEN({ ...heroEN, [key]: event.target.value })
                          }
                        />
                      ) : (
                        <input
                          disabled={!editable}
                          value={heroEN[key]}
                          onChange={(event) =>
                            setHeroEN({ ...heroEN, [key]: event.target.value })
                          }
                        />
                      )}
                    </label>
                    <label>
                      <span>{label} · ID</span>
                      {key === "subheadline" || key === "prefilled" ? (
                        <textarea
                          disabled={!editable}
                          value={heroID[key]}
                          onChange={(event) =>
                            setHeroID({ ...heroID, [key]: event.target.value })
                          }
                        />
                      ) : (
                        <input
                          disabled={!editable}
                          value={heroID[key]}
                          onChange={(event) =>
                            setHeroID({ ...heroID, [key]: event.target.value })
                          }
                        />
                      )}
                    </label>
                    {key === "headline" && (
                      <button
                        className={`accent-marker ${accentMarked ? "is-active" : ""}`}
                        disabled={!editable}
                        onClick={() => setAccentMarked(!accentMarked)}
                      >
                        <Icon>format_italic</Icon>
                        {t.accent}: “Just help.”
                      </button>
                    )}
                  </div>
                ))}
                <div className="hero-assets">
                  <div>
                    <span>
                      {message(language, "pages.LandingContentPage.012")}
                    </span>
                    <div>
                      {checklist.map((item) => (
                        <Badge key={item}>
                          <Icon>check</Icon>
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="hero-image-field">
                    <img
                      src={heroPhoto}
                      alt="Two friends sitting close and talking"
                    />
                    <div>
                      <strong>
                        {message(language, "pages.LandingContentPage.013")}
                      </strong>
                      <span>Two friends sitting close · Unsplash</span>
                      <Button
                        disabled={!editable}
                        onClick={() =>
                          showToast(
                            message(language, "pages.LandingContentPage.014"),
                          )
                        }
                      >
                        <Icon>image</Icon>
                        {message(language, "pages.LandingContentPage.015")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="generic-section-editor">
                <div className="bilingual-head">
                  <span>
                    EN · {message(language, "pages.LandingContentPage.016")}
                  </span>
                  <span>
                    ID · {message(language, "pages.LandingContentPage.017")}
                  </span>
                </div>
                {sectionContent[selected].en.map((line, index) => (
                  <div className="bilingual-field" key={index}>
                    <label>
                      <span>Item {index + 1} · EN</span>
                      <textarea
                        disabled={!editable}
                        value={line}
                        onChange={(event) =>
                          updateGeneric("en", index, event.target.value)
                        }
                      />
                    </label>
                    <label>
                      <span>Item {index + 1} · ID</span>
                      <textarea
                        disabled={!editable}
                        value={sectionContent[selected].id[index] ?? ""}
                        onChange={(event) =>
                          updateGeneric("id", index, event.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
                {selected === "stories" && (
                  <div className="testimonial-compliance">
                    <Icon>verified_user</Icon>
                    <div>
                      <strong>
                        {message(language, "pages.LandingContentPage.018")}
                      </strong>
                      <span>
                        {message(language, "pages.LandingContentPage.019")}
                      </span>
                    </div>
                    <Badge tone="success">Consent 3/3</Badge>
                  </div>
                )}
                {(selected === "problem" ||
                  selected === "faq" ||
                  selected === "footer") && (
                  <div className="sensitive-content">
                    <Icon>policy</Icon>
                    <div>
                      <strong>
                        {message(language, "pages.LandingContentPage.020")}
                      </strong>
                      <span>
                        {selected === "problem"
                          ? "28/54/72 · Source: RuangRasa Research Panel · 2 Okt 2026"
                          : selected === "faq"
                            ? "FAQ privacy · sinkronkan dengan kebijakan retensi"
                            : "Disclaimer krisis · approval Legal"}
                      </span>
                    </div>
                    <Badge tone="warning">
                      {message(language, "pages.LandingContentPage.021")}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </article>
          <article
            className={`card landing-preview-card ${landingView !== "preview" ? "is-responsive-hidden" : ""}`}
          >
            <div className="dashboard-card__heading">
              <div>
                <h2>Preview</h2>
                <p>{message(language, "pages.LandingContentPage.022")}</p>
              </div>
              <Badge>{contentLanguage}</Badge>
            </div>
            <div className="preview-width-picker">
              {(["desktop", "tablet", "mobile"] as const).map((item) => (
                <button
                  key={item}
                  className={previewWidth === item ? "is-active" : ""}
                  onClick={() => setPreviewWidth(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            <div className={`landing-preview-viewport is-${previewWidth}`}>
              <HeroMiniPreview
                hero={contentLanguage === "EN" ? heroEN : heroID}
                accentMarked={accentMarked}
              />
            </div>
          </article>
          <section className="landing-cms-grid">
            <article className="card cms-card">
              <div className="config-card__heading">
                <div>
                  <Icon>history</Icon>
                  <h2>{message(language, "pages.LandingContentPage.023")}</h2>
                </div>
              </div>
              {[
                ["v24", "Live · Dina · 4 Okt 2026"],
                ["v23", "Arsip · Nadia · 18 Sep 2026"],
                ["v22", "Arsip · Nadia · 1 Sep 2026"],
              ].map((item, index) => (
                <div className="cms-version" key={item[0]}>
                  <b>{item[0]}</b>
                  <span>{item[1]}</span>
                  {index > 0 && (
                    <Button
                      disabled={!editable}
                      onClick={() => {
                        onAudit(
                          "Rollback Konten Landing",
                          item[0],
                          "Pemulihan versi landing",
                        );
                        showToast(
                          localized(
                            language,
                            `Rollback ${item[0]} diajukan.`,
                            `${item[0]} rollback submitted.`,
                          ),
                        );
                      }}
                    >
                      <Icon>restore</Icon>Rollback
                    </Button>
                  )}
                </div>
              ))}
            </article>
            <article className="card cms-card schedule-card">
              <div className="config-card__heading">
                <div>
                  <Icon>event</Icon>
                  <h2>{message(language, "pages.LandingContentPage.024")}</h2>
                </div>
              </div>
              <label>
                <span>{message(language, "pages.LandingContentPage.025")}</span>
                <input
                  disabled={!editable}
                  value={scheduled}
                  onChange={(event) => setScheduled(event.target.value)}
                />
              </label>
              <Button
                disabled={!editable}
                onClick={() => {
                  onAudit(
                    "Menjadwalkan Konten Landing",
                    "Landing Page",
                    scheduled,
                  );
                  showToast(message(language, "pages.LandingContentPage.026"));
                }}
              >
                {message(language, "pages.LandingContentPage.027")}
              </Button>
            </article>
            <article className="card cms-card seo-card">
              <div className="config-card__heading">
                <div>
                  <Icon>search</Icon>
                  <h2>Metadata SEO</h2>
                </div>
                <Badge tone="success">Complete</Badge>
              </div>
              <label>
                <span>Title</span>
                <input
                  disabled={!editable}
                  defaultValue="RuangRasa — Someone to talk to. Just help."
                />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  disabled={!editable}
                  defaultValue="Rara listens, asks the right questions, and helps you think clearly over WhatsApp."
                />
              </label>
              <label>
                <span>og:image</span>
                <input
                  disabled={!editable}
                  defaultValue="hero-og.jpg · 1200×630"
                />
              </label>
              <label>
                <span>Canonical</span>
                <input
                  disabled={!editable}
                  defaultValue="https://ruangrasa.id/"
                />
              </label>
            </article>
            <article className="card cms-card legal-card">
              <div className="config-card__heading">
                <div>
                  <Icon>gavel</Icon>
                  <h2>{message(language, "pages.LandingContentPage.028")}</h2>
                </div>
                <Badge tone="warning">Placeholder</Badge>
              </div>
              {["Privacy Policy", "Terms of Use", "Contact"].map((item) => (
                <div key={item}>
                  <span>{item}</span>
                  <Badge>
                    {message(language, "pages.LandingContentPage.029")}
                  </Badge>
                  <Button disabled={!editable}>
                    {message(language, "pages.LandingContentPage.030")}
                  </Button>
                </div>
              ))}
            </article>
          </section>
          <div className="privacy-card landing-note">
            <Icon>policy</Icon>
            <p>
              Statistik wajib punya sumber &amp; tanggal. Testimoni wajib
              consent + anonimisasi. Disclaimer krisis perlu approval Legal.
              Janji privasi di FAQ harus sama dengan kebijakan retensi di
              Pengaturan.
            </p>
          </div>
        </main>
      </div>
      {publishOpen && (
        <LandingPublishDialog
          language={language}
          onClose={() => setPublishOpen(false)}
          onConfirm={publish}
        />
      )}
      {previewOpen && (
        <div className="landing-preview-modal">
          <div className="landing-preview-shell">
            <button
              className="modal-close"
              onClick={() => setPreviewOpen(false)}
            >
              <Icon>close</Icon>
            </button>
            <HeroMiniPreview
              hero={contentLanguage === "EN" ? heroEN : heroID}
              accentMarked={accentMarked}
            />
          </div>
        </div>
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

export default LandingContentPage;
