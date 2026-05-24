import AntigravityParticleField from "./AntigravityParticleField";
import { useLanguage } from "../i18n";

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <AntigravityParticleField
        className="hero-particles"
        density={220}
        particlesScale={0.72}
        ringWidth={0.15}
        ringWidth2={0.05}
        ringDisplacement={0.26}
      />
      <div className="hero-content">
        <p className="hero-eyebrow">
          <span className="hero-name">Pablo Reyes</span>
          <span className="hero-role">{t("Economist & Data Scientist")}</span>
        </p>
        <h1 className="hero-title">
          {t("Learning from data to understand complex systems.")}
        </h1>
        <p className="hero-subtitle">
          {t("Explore my work across machine learning, data science, computer vision, and applied economic research.")}
        </p>
        <div className="hero-actions" aria-label={t("Portfolio actions")}>
          <a className="hero-button primary" href="#projects">
            {t("View Projects")}
          </a>
          <a className="hero-button secondary" href="#contact">
            {t("Contact")}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
