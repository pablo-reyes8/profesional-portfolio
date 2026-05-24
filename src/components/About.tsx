import type { CSSProperties } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

const skills = [
  { name: "Python", icon: "python" },
  { name: "R", icon: "r" },
  { name: "Stata", icon: "stata" },
  {
    name: "MATLAB",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg"
  },
  { name: "SQL", icon: "postgresql" },
  { name: "LaTeX", icon: "latex" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "scikit-learn", icon: "scikitlearn" },
  { name: "Hugging Face", icon: "huggingface" },
  { name: "OpenCV", icon: "opencv" },
  { name: "Pandas", icon: "pandas" },
  { name: "Docker", icon: "docker" },
  { name: "Git", icon: "git" },
  { name: "GitHub Actions", icon: "githubactions" },
  { name: "Power BI", iconUrl: "https://cdn.simpleicons.org/powerbi/F2C811" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "Airflow", icon: "apacheairflow" }
];

function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about-section">
      <AmbientParticleBackground className="section-particles" />
      <div className="about-container">
        <p className="section-eyebrow">{t("About Me")}</p>

        <div className="about-grid">
          <div className="about-copy">

            <p>
              {t("I am ")}<strong>Pablo Reyes</strong>{t(", an economist and data scientist focused")}
              {" "}{t("on ")}<strong>{t("computer vision")}</strong>,{" "}
              <strong>{t("causal inference")}</strong>, <strong>{t("Bayesian methods")}</strong>
              {t(", and applied machine learning. I")} {t("currently work at the Central Bank of Colombia as a researcher in the team")}{" "}
              {t("of Board Member Mauricio Villamizar, developing empirical research on")}{" "}
              {t("financial data, market behavior, and economic policy questions.")}
            </p>

            <p>
              {t("My work combines ")}<strong>{t("deep learning")}</strong>
              {t(" and rigorous empirical")} {t("methods to study real-world mechanisms. I am especially interested in")}{" "}
              <strong>{t("representation learning")}</strong>{t(", generative computer vision,")}{" "}
              {t("reproducible research pipelines, and models that are not only predictive,")}{" "}
              {t("but also interpretable and useful for understanding economic and social")} {t("dynamics.")}
            </p>
          </div>

          <div className="stack-panel" aria-label={t("Technical stack")}>
            <p className="stack-title">{t("Stack")}</p>
            <div className="stack-cloud">
              {skills.map((skill, index) => (
                <span
                  className="skill-bubble"
                  key={skill.name}
                  style={{ "--bubble-index": index } as CSSProperties}
                >
                  <img
                    alt=""
                    className="skill-icon"
                    src={skill.iconUrl ?? `https://cdn.simpleicons.org/${skill.icon}`}
                  />
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
