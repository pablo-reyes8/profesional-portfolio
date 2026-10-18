import { useMemo, useRef, useState, type CSSProperties } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

interface EducationItem {
  id: string;
  institution: string;
  shortInstitution: string;
  program: string;
  period: string;
  /** Decimal years, e.g. 2025.58 is early August 2025. `null` end means in progress. */
  start: number;
  end: number | null;
  summary: string;
  highlight?: string;
  details: string[];
  focus: string[];
  credentials: CertificateLink[];
  logo: string;
  logoCrop?: boolean;
  logoOnInk?: boolean;
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
    id: "ba-economics",
    institution: "Universidad Externado de Colombia",
    shortInstitution: "Externado",
    program: "B.A. in Economics",
    period: "2021–2025",
    start: 2021,
    end: 2025.95,
    summary: "Highest GPA in the Economics cohort, with a concentration in quantitative methods and artificial intelligence applied to economics.",
    highlight: "Highest GPA in the Economics cohort",
    details: [
      "Interdisciplinary economics training across macroeconomics, microeconomics, econometrics, finance, political science, law, administration, history, and philosophy.",
      "Strong emphasis on quantitative analysis, applied economic research, and data-driven reasoning for social and economic systems."
    ],
    focus: ["Economics", "Econometrics", "Quant Methods", "Applied AI", "Research"],
    credentials: [{ label: "Economics Degree Act", href: "/certifications/economia/economics-degree-acta.pdf" }],
    logo: "/logos/logo-externado.jpg",
    logoCrop: true
  },
  {
    id: "ds-track",
    institution: "Universidad Externado de Colombia",
    shortInstitution: "Externado",
    program: "Undergraduate Track in Data Science",
    period: "2023–2025",
    start: 2023,
    end: 2025.95,
    summary: "Formal training in programming, data science, machine learning, statistical modeling, and computational methods.",
    details: [
      "Formal complement to economics training in programming, data science, machine learning, and statistical modeling.",
      "Strengthens reproducible quantitative workflows for empirical research and model development.",
      "Provides the technical layer for data-driven products and computational research pipelines."
    ],
    focus: ["Data Science", "Python", "Machine Learning", "Statistical Modeling", "Reproducible Workflows"],
    credentials: [],
    logo: "/logos/logo-externado.jpg",
    logoCrop: true
  },
  {
    id: "msc-bi",
    institution: "Universidad Externado de Colombia",
    shortInstitution: "Externado",
    program: "M.Sc. in Business Intelligence",
    period: "2024–Present",
    start: 2024,
    end: null,
    summary: "Graduate work focused on advanced analytics, machine learning, statistical modeling, and data management.",
    details: [
      "Graduate training in advanced analytics, machine learning, statistical modeling, and data management.",
      "Focus on organizing and using information systems to support strategic decision-making.",
      "Connects analytical methods with business intelligence systems in economic, financial, and administrative contexts."
    ],
    focus: ["Business Intelligence", "Analytics", "Machine Learning", "Data Management", "Strategy"],
    credentials: [],
    logo: "/logos/logo-externado.jpg",
    logoCrop: true
  },
  {
    id: "mitx",
    institution: "Massachusetts Institute of Technology — MITx",
    shortInstitution: "MITx",
    program: "MicroMasters Program in Statistics and Data Science",
    period: "2026–Present",
    start: 2026,
    end: null,
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
    logoOnInk: true
  },
  {
    id: "unal-diploma",
    institution: "National University of Colombia",
    shortInstitution: "UNAL",
    program: "Diploma in Advanced Machine Learning and Data Science",
    period: "Aug 2025–Dec 2025",
    start: 2025.58,
    end: 2025.95,
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
    logo: "/logos/logo-unal.png"
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

const timelineStart = 2021;

function currentDecimalYear(): number {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1).getTime();
  return now.getFullYear() + (now.getTime() - yearStart) / (yearEnd - yearStart);
}

function ArrowIcon() {
  return (
    <svg className="edu-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Formation() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState(education[0].id);
  const detailRef = useRef<HTMLDivElement>(null);

  const { now, timelineEnd, years } = useMemo(() => {
    const current = currentDecimalYear();
    const end = Math.max(timelineStart + 6, Math.ceil(current + 0.15));
    return {
      now: current,
      timelineEnd: end,
      years: Array.from({ length: end - timelineStart }, (_, index) => timelineStart + index)
    };
  }, []);

  const toPercent = (value: number): number => ((value - timelineStart) / (timelineEnd - timelineStart)) * 100;
  const selected = education.find((item) => item.id === selectedId) ?? education[0];
  const certificateCount = certificateGroups.reduce((total, group) => total + group.links.length, 0);
  const selectedIsOngoing = selected.end === null;

  const handleSelect = (id: string): void => {
    setSelectedId(id);

    if (!window.matchMedia("(max-width: 760px)").matches) {
      return;
    }

    window.requestAnimationFrame(() => {
      const panel = detailRef.current;
      if (!panel) {
        return;
      }

      const navbarHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")
      ) || 64;

      window.dispatchEvent(
        new CustomEvent("portfolio:smooth-scroll-to", {
          detail: { top: panel.getBoundingClientRect().top + window.scrollY - navbarHeight - 16 }
        })
      );
    });
  };

  return (
    <section id="formation" className="formation-section">
      <AmbientParticleBackground variant="formation" />

      <div className="formation-container">
        <header className="section-head" data-reveal style={{ "--reveal-i": 0 } as CSSProperties}>
          <h2 className="section-title">
            {t("Education")}
            <sup className="section-count">{education.length}</sup>
          </h2>
          <p className="section-lead">
            {t("Economics, statistics, and machine learning, studied in parallel since 2021.")}
          </p>
        </header>

        <div
          className="edu-chart"
          role="group"
          aria-label={t("Academic formation")}
          data-reveal
          style={{ "--reveal-i": 1, "--today": `${toPercent(now)}%` } as CSSProperties}
        >
          <div className="edu-axis" aria-hidden="true">
            <span className="edu-axis-label">{t("Program")}</span>
            <div className="edu-axis-track">
              {years.map((year) => (
                <span key={year} className="edu-year" style={{ left: `${toPercent(year)}%` }}>
                  <span className="edu-year-full">{year}</span>
                  <span className="edu-year-short">’{String(year).slice(2)}</span>
                </span>
              ))}
              <span className="edu-today-label">{t("Today")}</span>
            </div>
          </div>

          <div className="edu-rows">
            <div className="edu-bands" aria-hidden="true">
              {years.map((year) => (
                <span
                  key={year}
                  className="edu-band"
                  style={{ left: `${toPercent(year)}%`, width: `${toPercent(year + 1) - toPercent(year)}%` }}
                />
              ))}
              <span className="edu-today" />
            </div>

            {education.map((item, index) => {
              const isSelected = item.id === selected.id;
              const isOngoing = item.end === null;
              const left = toPercent(item.start);
              const width = toPercent(item.end ?? now) - left;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={["edu-row", isSelected ? "is-selected" : "", isOngoing ? "is-ongoing" : ""].filter(Boolean).join(" ")}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(item.id)}
                  style={{ "--row-i": index } as CSSProperties}
                >
                  <span className="edu-row-label">
                    <span className={`edu-logo ${item.logoCrop ? "is-cropped" : ""} ${item.logoOnInk ? "is-ink" : ""}`} aria-hidden="true">
                      <img src={item.logo} alt="" loading="lazy" />
                    </span>
                    <span className="edu-row-text">
                      <span className="edu-row-program">{t(item.program)}</span>
                      <span className="edu-row-meta">
                        {item.shortInstitution} · {t(item.period)}
                      </span>
                    </span>
                  </span>

                  <span className="edu-row-track" aria-hidden="true">
                    <span className="edu-bar" style={{ left: `${left}%`, width: `${width}%` }}>
                      {isOngoing ? <span className="edu-bar-edge" /> : null}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="edu-legend" aria-hidden="true">
            <span className="edu-key is-done">{t("Completed")}</span>
            <span className="edu-key is-ongoing">{t("In progress")}</span>
            <span className="edu-legend-hint">{t("Select a program to read its record")}</span>
          </p>
        </div>

        <div className="edu-record" ref={detailRef} aria-live="polite" data-reveal style={{ "--reveal-i": 2 } as CSSProperties}>
          <div className="edu-record-inner" key={selected.id}>
            <div className="edu-record-head">
              <p className="edu-record-institution">
                <span className={`edu-logo is-large ${selected.logoCrop ? "is-cropped" : ""} ${selected.logoOnInk ? "is-ink" : ""}`} aria-hidden="true">
                  <img src={selected.logo} alt="" loading="lazy" />
                </span>
                <span>{t(selected.institution)}</span>
              </p>
              <h3>{t(selected.program)}</h3>
              <p className="edu-record-period">
                <span className={`edu-status ${selectedIsOngoing ? "is-ongoing" : ""}`}>
                  {selectedIsOngoing ? t("In progress") : t("Completed")}
                </span>
                <span>{t(selected.period)}</span>
              </p>
              {selected.highlight ? <p className="edu-highlight">{t(selected.highlight)}</p> : null}
              <p className="edu-record-summary">{t(selected.summary)}</p>
            </div>

            <div className="edu-record-body">
              <ul className="edu-details">
                {selected.details.map((detail) => (
                  <li key={detail}>{t(detail)}</li>
                ))}
              </ul>

              <ul className="edu-focus" aria-label={t("Focus areas")}>
                {selected.focus.map((focus) => (
                  <li key={focus}>{t(focus)}</li>
                ))}
              </ul>

              {selected.credentials.length > 0 ? (
                <div className="edu-credentials">
                  <p className="edu-credentials-title">{t("Certificates")}</p>
                  {selected.credentials.map((credential) => (
                    <a key={credential.href} href={credential.href} target="_blank" rel="noreferrer">
                      <span>{t(credential.label)}</span>
                      <ArrowIcon />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="cert-strip" data-reveal style={{ "--reveal-i": 3 } as CSSProperties}>
          <div className="cert-strip-head">
            <h3>
              {t("Additional certificates")}
              <sup className="section-count">{certificateCount}</sup>
            </h3>
            <p>{t("Specializations and short courses that fill in the tooling around the degrees.")}</p>
          </div>

          <ul className="cert-rows">
            {certificateGroups.map((group) => (
              <li className="cert-row" key={group.title} title={t(group.summary)}>
                <p className="cert-row-title">
                  <strong>{t(group.title)}</strong>
                  <span>{t(group.provider)}</span>
                </p>
                <div className="cert-chips">
                  {group.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {t(link.label)}
                      <ArrowIcon />
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Formation;
