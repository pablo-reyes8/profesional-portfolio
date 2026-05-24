import { useState } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

interface EducationItem {
  institution: string;
  program: string;
  period: string;
  summary: string;
  details: string[];
  focus: string[];
  credentials: CertificateLink[];
  logo?: string;
  mark: string;
  tone: "red" | "gold" | "blue" | "ink";
}

interface CertificateLink {
  label: string;
  href: string;
}

interface CertificateGroup {
  provider: string;
  title: string;
  summary: string;
  links: CertificateLink[];
}

const education: EducationItem[] = [
  {
    institution: "Universidad Externado de Colombia",
    program: "B.A. in Economics",
    period: "2021–2025",
    summary: "Highest GPA in the Economics cohort, with a concentration in quantitative methods and artificial intelligence applied to economics.",
    details: [
      "Interdisciplinary economics training across macroeconomics, microeconomics, econometrics, finance, political science, law, administration, history, and philosophy.",
      "Strong emphasis on quantitative analysis, applied economic research, and data-driven reasoning for social and economic systems.",
      "Graduated with the highest GPA in the Economics cohort."
    ],
    focus: ["Economics", "Econometrics", "Quant Methods", "Applied AI", "Research"],
    credentials: [{ label: "Economics Degree Act", href: "/certifications/economia/economics-degree-acta.pdf" }],
    logo: "/logos/logo-uec.png",
    mark: "UE",
    tone: "red"
  },
  {
    institution: "Universidad Externado de Colombia",
    program: "M.Sc. in Business Intelligence",
    period: "2024–Present",
    summary: "Graduate work focused on advanced analytics, machine learning, statistical modeling, and data management.",
    details: [
      "Graduate training in advanced analytics, machine learning, statistical modeling, and data management.",
      "Focus on organizing and using information systems to support strategic decision-making.",
      "Connects analytical methods with business intelligence systems in economic, financial, and administrative contexts."
    ],
    focus: ["Business Intelligence", "Analytics", "Machine Learning", "Data Management", "Strategy"],
    credentials: [],
    logo: "/logos/logo-uec.png",
    mark: "BI",
    tone: "red"
  },
  {
    institution: "Universidad Externado de Colombia",
    program: "Undergraduate Track in Data Science",
    period: "2023–Present",
    summary: "Formal training in programming, data science, machine learning, statistical modeling, and computational methods.",
    details: [
      "Formal complement to economics training in programming, data science, machine learning, and statistical modeling.",
      "Strengthens reproducible quantitative workflows for empirical research and model development.",
      "Provides the technical layer for data-driven products and computational research pipelines."
    ],
    focus: ["Data Science", "Python", "Machine Learning", "Statistical Modeling", "Reproducible Workflows"],
    credentials: [],
    logo: "/logos/logo-uec.png",
    mark: "DS",
    tone: "red"
  },
  {
    institution: "Massachusetts Institute of Technology — MITx",
    program: "MicroMasters Program in Statistics and Data Science",
    period: "2025–Present",
    summary: "Rigorous training in probability, statistics, data analysis, and machine learning through the MITx MicroMasters sequence.",
    details: [
      "Mathematically rigorous MITx sequence around probability, statistics, data analysis, and machine learning.",
      "Built for statistical reasoning, computational inference, and modern data science methods.",
      "Part of the MITx MicroMasters structure developed with IDSS.",
      "Current coursework includes Probability and Fundamentals of Statistics, with emphasis on proof-based reasoning and applied inference."
    ],
    focus: ["Probability", "Statistics", "Machine Learning"],
    credentials: [
      { label: "Probability", href: "/certifications/mitx/probability.pdf" },
      { label: "Fundamentals of Statistics", href: "/certifications/mitx/fundamentals-of-statistics.pdf" }
    ],
    logo: "/logos/logo-mit.png",
    mark: "MITx",
    tone: "ink"
  },
  {
    institution: "National University of Colombia",
    program: "Diploma in Advanced Machine Learning and Data Science",
    period: "Aug 2025–Dec 2025",
    summary: "Applied training in machine learning, NLP, 3D computer vision, MLOps, and end-to-end machine learning projects.",
    details: [
      "192-hour applied program from Universidad Nacional de Colombia focused on practical and advanced machine learning methods.",
      "Covers deep learning, NLP, MLOps, 3D computer vision, and applied project workflows.",
      "Designed around end-to-end machine learning systems and modern data science practice."
    ],
    focus: ["Advanced ML", "NLP", "MLOps"],
    credentials: [
      { label: "General Certificate", href: "/certifications/diplomado/advanced-machine-learning-data-science.pdf" },
      { label: "Deep Learning", href: "/certifications/diplomado/deep-learning.pdf" },
      { label: "MLOps", href: "/certifications/diplomado/mlops.pdf" },
      { label: "NLP", href: "/certifications/diplomado/nlp.pdf" }
    ],
    logo: "/logos/logo-unal.png",
    mark: "UN",
    tone: "gold"
  }
];

const certificateGroups: CertificateGroup[] = [
  {
    provider: "Coursera · DeepLearning.AI",
    title: "Deep Learning Specialization",
    summary: "Five-course sequence covering neural networks, optimization, ML project strategy, convolutional networks, and sequence models.",
    links: [
      { label: "Full Specialization", href: "/certifications/coursera/deep-learning/full-specialization.pdf" },
      { label: "Neural Networks and Deep Learning", href: "/certifications/coursera/deep-learning/neural-networks-deep-learning.pdf" },
      { label: "Improving Deep Neural Networks", href: "/certifications/coursera/deep-learning/improving-deep-neural-networks.pdf" },
      { label: "Structuring Machine Learning Projects", href: "/certifications/coursera/deep-learning/structuring-machine-learning-projects.pdf" },
      { label: "Convolutional Neural Networks", href: "/certifications/coursera/deep-learning/convolutional-neural-networks.pdf" },
      { label: "Sequence Models", href: "/certifications/coursera/deep-learning/sequence-models.pdf" }
    ]
  },
  {
    provider: "Coursera · DeepLearning.AI / Stanford",
    title: "Machine Learning Specialization",
    summary: "Andrew Ng's three-course sequence on supervised learning, advanced learning algorithms, unsupervised learning, recommenders, and reinforcement learning.",
    links: [
      { label: "Full Specialization", href: "/certifications/coursera/machine-learning/full-specialization.pdf" },
      { label: "Supervised Machine Learning", href: "/certifications/coursera/machine-learning/supervised-machine-learning.pdf" },
      { label: "Advanced Learning Algorithms", href: "/certifications/coursera/machine-learning/advanced-learning-algorithms.pdf" },
      { label: "Unsupervised, Recommenders, Reinforcement Learning", href: "/certifications/coursera/machine-learning/unsupervised-recommenders-reinforcement-learning.pdf" }
    ]
  },
  {
    provider: "Platzy",
    title: "Applied data and tooling certificates",
    summary: "Focused short-form courses in PyTorch, SQL, NLP, Power BI, data visualization, and machine learning demos.",
    links: [
      { label: "PyTorch", href: "/certifications/platzy/pytorch.pdf" },
      { label: "SQL and MySQL", href: "/certifications/platzy/sql-mysql.pdf" },
      { label: "NLP", href: "/certifications/platzy/nlp.pdf" },
      { label: "Power BI", href: "/certifications/platzy/power-bi.pdf" },
      { label: "Data Visualization for BI", href: "/certifications/platzy/data-visualization-bi.pdf" },
      { label: "Machine Learning Demos", href: "/certifications/platzy/machine-learning-demos.pdf" }
    ]
  }
];

function Formation() {
  const { t } = useLanguage();
  const [showCertifications, setShowCertifications] = useState(false);
  const [openGroup, setOpenGroup] = useState("Deep Learning Specialization");
  const [expandedEducation, setExpandedEducation] = useState("");

  return (
    <section id="formation" className="formation-section">
      <AmbientParticleBackground className="formation-particles" variant="formation" />

      <div className="formation-container">
        <p className="section-eyebrow">{t("Formation")}</p>

        <div className="formation-header">
          <h2>{t("Academic training in economics, statistics, and machine learning.")}</h2>
          <p>
            {t("A compact view of my formal education,  built around economic analysis, statistical modeling, and machine learning.")}
          </p>
        </div>

        <div className="formation-list" aria-label={t("Academic formation")}>
          {education.map((item) => {
            const id = item.program.toLowerCase().replaceAll(" ", "-");
            const isExpanded = expandedEducation === id;
            const visibleFocus = isExpanded ? item.focus : item.focus.slice(0, 2);
            const primaryCredential = item.credentials[0];
            const secondaryCredentials = item.credentials.slice(1);

            return (
            <article
              className={`formation-card ${item.credentials.length > 0 ? "has-credentials" : ""} ${isExpanded ? "is-expanded" : ""}`}
              key={`${item.program}-${item.period}`}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onClick={() => setExpandedEducation(isExpanded ? "" : id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExpandedEducation(isExpanded ? "" : id);
                }
              }}
            >
              <div className={`formation-mark is-${item.tone}`} aria-hidden="true">
                {item.logo ? <img src={item.logo} alt="" loading="lazy" /> : item.mark}
              </div>

              <div className="formation-card-main">
                <div className="formation-meta">
                  <span>{t(item.period)}</span>
                  <span>{t(item.institution)}</span>
                </div>
                <h3>{t(item.program)}</h3>
                <p>{t(item.summary)}</p>
                <div className="formation-details" aria-hidden={!isExpanded}>
                  <ul>
                    {item.details.map((detail) => (
                      <li key={detail}>{t(detail)}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="formation-focus" aria-label={t("Focus areas")}>
                {visibleFocus.map((focus) => (
                  <span key={focus}>
                    <i aria-hidden="true" />
                    {t(focus)}
                  </span>
                ))}
              </div>

              {secondaryCredentials.length > 0 && isExpanded ? (
                <div className="formation-extra-credentials" aria-label={t("Additional certificates")}>
                  {secondaryCredentials.map((credential) => (
                    <a
                      key={credential.href}
                      href={credential.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {t(credential.label)}
                    </a>
                  ))}
                </div>
              ) : null}

              {primaryCredential ? (
                <div className="formation-actions">
                  <a
                    className="formation-certificate-link"
                    href={primaryCredential.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span>{t(primaryCredential.label)}</span>
                    <strong>{t("Show Certification")}</strong>
                  </a>
                </div>
              ) : null}
            </article>
          );
          })}
        </div>

        <div className="certifications-panel">
          <button
            className="certifications-toggle"
            type="button"
            aria-expanded={showCertifications}
            onClick={() => setShowCertifications((current) => !current)}
          >
            {showCertifications ? t("Hide additional formation") : t("Show additional formation")}
          </button>

          {showCertifications ? (
            <div className="certification-groups">
              {certificateGroups.map((group) => {
                const isOpen = openGroup === group.title;

                return (
                  <article className={`certification-card ${isOpen ? "is-open" : ""}`} key={group.title}>
                    <button
                      type="button"
                      className="certification-card-header"
                      aria-expanded={isOpen}
                      onClick={() => setOpenGroup(isOpen ? "" : group.title)}
                    >
                      <span>{t(group.provider)}</span>
                      <strong>{t(group.title)}</strong>
                    </button>

                    <div className="certification-card-body" aria-hidden={!isOpen}>
                      <p>{t(group.summary)}</p>
                      <div className="certificate-links">
                        {group.links.map((link) => (
                          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                            <span>{t(link.label)}</span>
                            <strong>{t("Show Certification")}</strong>
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Formation;
