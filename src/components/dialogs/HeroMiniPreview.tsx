import { Icon } from "../ui";
import { heroPhoto } from "../../data/mock/index";

export function HeroMiniPreview({
  hero,
  accentMarked = true,
}: {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    cta: string;
    secondary: string;
  };
  accentMarked?: boolean;
}) {
  const accent = hero.headline.includes("Just help.")
    ? "Just help."
    : "Hanya membantu.";
  const parts = hero.headline.split(accent);
  return (
    <div className="hero-mini">
      <div className="hero-mini__copy">
        <span>{hero.eyebrow}</span>
        <h3>
          {parts[0]}
          {accentMarked ? <em>{accent}</em> : accent}
        </h3>
        <p>{hero.subheadline}</p>
        <div>
          <button>
            <Icon>chat</Icon>
            {hero.cta}
          </button>
          <a>
            {hero.secondary}
            <Icon>arrow_forward</Icon>
          </a>
        </div>
      </div>
      <div className="hero-mini__photo">
        <img src={heroPhoto} alt="Two friends sitting close and talking" />
        <div>
          <span className="rara-dot">R</span>
          <p>
            <b>Rara is listening</b>
            <small>No judgment · Open 24/7</small>
          </p>
        </div>
      </div>
    </div>
  );
}
