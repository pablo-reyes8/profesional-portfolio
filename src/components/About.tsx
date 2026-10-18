import type { CSSProperties } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

interface Skill {
  name: string;
  icon?: string;
  iconUrl?: string;
}

const skillGroups: { label: string; skills: Skill[] }[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", icon: "python" },
      { name: "R", icon: "r" },
      { name: "SQL", icon: "postgresql" },
      { name: "Stata", iconUrl: "/logos/file_type_stata_icon_130148.png" },
      {
        name: "MATLAB",
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg"
      },
      { name: "LaTeX", icon: "latex" }
    ]
  },
  {
    label: "Modeling",
    skills: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "OpenCV", icon: "opencv" }
    ]
  },
  {
    label: "Systems",
    skills: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Airflow", icon: "apacheairflow" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Power BI", iconUrl: "/logos/New_Power_BI_Logo.png" }
    ]
  }
];

function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about-section">
      <AmbientParticleBackground variant="about" />
      <div className="about-container">
        <header className="section-head" data-reveal style={{ "--reveal-i": 0 } as CSSProperties}>
          <h2 className="section-title">{t("About")}</h2>
          <p className="section-lead about-statement">
            {t("I am ")}<strong>Pablo Reyes</strong>
            {t(", an economist and data scientist working on computer vision, causal inference, Bayesian methods, and applied machine learning.")}
          </p>
        </header>

        <div className="about-grid">
          <dl className="about-facts" data-reveal style={{ "--reveal-i": 1 } as CSSProperties}>
            <div>
              <dt>{t("Currently")}</dt>
              <dd>{t("Researcher, Central Bank of Colombia")}</dd>
            </div>
            <div>
              <dt>{t("Research")}</dt>
              <dd>{t("Computer vision, causal inference, Bayesian methods")}</dd>
            </div>
            <div>
              <dt>{t("Studies")}</dt>
              <dd>{t("B.A. Economics, top of cohort · M.Sc. in progress")}</dd>
            </div>
            <div>
              <dt>{t("Based in")}</dt>
              <dd>{t("Bogotá, Colombia")}</dd>
            </div>
          </dl>

          <div className="about-copy" data-reveal style={{ "--reveal-i": 2 } as CSSProperties}>
            <p>
              {t("I work at the Central Bank of Colombia as a researcher in the team of Board Member ")}
              <a
                className="about-inline-link"
                href="https://scholar.google.com/citations?user=ISRsaiYAAAAJ&hl=en"
                target="_blank"
                rel="noreferrer"
              >
                Mauricio Villamizar
              </a>
              {t(", developing empirical research on")}{" "}
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
        </div>

        <div className="stack-panel" aria-label={t("Technical stack")} data-reveal style={{ "--reveal-i": 3 } as CSSProperties}>
          <div className="stack-intro">
            <h3 className="stack-title">{t("Tools I work with")}</h3>
            <p className="stack-total">
              <span>{skillGroups.reduce((total, group) => total + group.skills.length, 0)}</span>
              {t("tools across research, modeling, and deployment")}
            </p>
          </div>
          <div className="stack-groups">
            {skillGroups.map((group) => (
              <div className="stack-group" key={group.label}>
                <p className="stack-group-label">{t(group.label)}</p>
                <ul className="stack-list">
                  {group.skills.map((skill, index) => (
                    <li
                      className="skill-item"
                      key={skill.name}
                      style={{ "--item-i": index } as CSSProperties}
                    >
                      <img
                        alt=""
                        className="skill-icon"
                        loading="lazy"
                        src={skill.iconUrl ?? `https://cdn.simpleicons.org/${skill.icon}`}
                      />
                      <span>{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
