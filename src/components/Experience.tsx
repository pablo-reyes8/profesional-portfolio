import { useRef, useState } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  location: string;
  logo: string;
  logoSrc?: string;
  logoCrop?: boolean;
  tone: "red" | "blue" | "gold" | "ink";
  summary: string;
  detail: string;
  signals: string[];
  methods: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: "Professional Research Assistant",
    organization: "Central Bank of Colombia — Board of Directors",
    period: "2025–Present",
    location: "Bogotá, Colombia · Hybrid",
    logo: "BR",
    logoSrc: "/logos/logo-banrep-2.jpg",
    tone: "red",
    summary:
      "Empirical research on market behavior, credit risk, institutional dynamics, and large-scale financial data for policy-relevant questions.",
    detail:
      "I work on empirical research workflows that connect financial microdata, policy questions, and reproducible modeling. The role combines dataset construction, econometric design, risk modeling, and clear research outputs for decision-facing environments.",
    signals: [
      "Causal inference and survival analysis for household credit portfolios",
      "Hazard models for default selection and delinquency transitions",
      "Reproducible Python pipelines for regulatory and financial datasets"
    ],
    methods: ["Python", "Econometrics", "Causal Inference", "Financial Data"]
  },
  {
    role: "Junior Researcher",
    organization: "NeuroMinds Research Group, Universidad Externado de Colombia",
    period: "2025–Present",
    location: "Bogotá, Colombia · In person",
    logo: "NM",
    logoSrc: "/logos/logo-externado.jpg",
    logoCrop: true,
    tone: "blue",
    summary:
      "Computer vision and generative modeling research for socially relevant identification tasks in collaboration with Colombia's Missing Persons Search Unit.",
    detail:
      "The work focuses on visual representation learning under difficult data conditions: limited samples, identity-sensitive tasks, domain shift, and the need for controllable outputs that can support human-centered research workflows.",
    signals: [
      "Deep learning pipelines for facial aging and biometric synthesis",
      "Representation learning under limited-data and domain-shift settings",
      "Diffusion and transformer methods for controllable visual generation"
    ],
    methods: ["PyTorch", "Computer Vision", "Diffusion", "Representation Learning"]
  },
  {
    role: "Research Intern",
    organization: "Central Bank of Colombia — Board of Directors",
    period: "Jul 2025–Dec 2025",
    location: "Bogotá, Colombia · Hybrid",
    logo: "BR",
    logoSrc: "/logos/logo-banrep-2.jpg",
    tone: "red",
    summary:
      "Applied research on uniform-price auction microstructure, bidding behavior, liquidity provision, and price formation.",
    detail:
      "I built and validated analytical datasets for primary-market auction research, then used microeconometric tools to study how institutional participants behave across bidding, liquidity provision, and price discovery settings.",
    signals: [
      "Validated analytical datasets for primary-market auction research",
      "Microeconometric analysis of dealer behavior and strategic bidding",
      "High-frequency institutional trading environment analysis"
    ],
    methods: ["Econometrics", "Market Microstructure", "Auctions", "Python"]
  },
  {
    role: "Research Assistant",
    organization: "Universidad Externado de Colombia",
    period: "Jan 2025–Dec 2025",
    location: "Bogotá, Colombia · Remote",
    logo: "UE",
    logoSrc: "/logos/logo-uec.png",
    tone: "gold",
    summary:
      "Quantitative policy analysis using Bayesian econometrics, graph methods, and computational workflows for macroeconomic systems.",
    detail:
      "This work translated policy questions into computational research pipelines, combining Bayesian modeling, network representations, and simulation logic to analyze fiscal sustainability and sectoral propagation.",
    signals: [
      "Bayesian fiscal sustainability and macroeconomic risk analysis",
      "Input-output network framework for shock propagation",
      "Simulation workflows for policy transmission and sectoral dynamics"
    ],
    methods: ["Bayesian Methods", "Graph Theory", "Macroeconomics", "Simulation"]
  },
  {
    role: "Teaching Assistant",
    organization: "Universidad Externado de Colombia",
    period: "2023–2024",
    location: "Bogotá, Colombia · In person",
    logo: "TA",
    logoSrc: "/logos/logo-uec.png",
    tone: "ink",
    summary:
      "Directed tutorials and practical computational exercises for Convex Optimization, connecting mathematical foundations with implementation.",
    detail:
      "The teaching work emphasized clear mathematical reasoning and applied implementation, helping students move from optimization theory to computational exercises in Python and SciLab.",
    signals: [
      "Optimization, dynamic programming, and multivariable calculus support",
      "Applied exercises with Python and SciLab",
      "Student-facing explanation of quantitative methods"
    ],
    methods: ["Optimization", "Python", "SciLab", "Teaching"]
  }
];

function Experience() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedId, setExpandedId] = useState("");
  const [showPastExperience, setShowPastExperience] = useState(false);
  const visibleExperiences = showPastExperience ? experiences : experiences.slice(0, 2);

  const scrollToExperienceStart = () => {
    window.requestAnimationFrame(() => {
      const section = sectionRef.current;
      const sectionContent = section?.querySelector<HTMLElement>(".experience-container") || section;

      if (!sectionContent) {
        return;
      }

      const navbarHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")
      ) || 64;
      const contentRoot = sectionContent.closest("main");
      const targetTop = Math.max(
        0,
        sectionContent.getBoundingClientRect().top -
          (contentRoot?.getBoundingClientRect().top || 0) -
          navbarHeight -
          28
      );

      window.dispatchEvent(
        new CustomEvent("portfolio:smooth-scroll-to", {
          detail: {
            top: targetTop
          }
        })
      );
    });
  };

  const handlePastExperienceToggle = () => {
    const shouldReturnToExperienceStart = showPastExperience;

    setShowPastExperience((current) => {
      const next = !current;

      if (!next) {
        setExpandedId("");
      }

      return next;
    });

    if (shouldReturnToExperienceStart) {
      scrollToExperienceStart();
    }
  };

  return (
    <section id="experience" className="experience-section" ref={sectionRef}>
      <AmbientParticleBackground className="experience-particles" variant="experience" />

      <div className="experience-container">
        <p className="section-eyebrow">{t("Experience")}</p>

        <div className="experience-header">
          <h2>{t("Research experience in machine learning and economics.")}</h2>
          <p>
            {t("My current work connects empirical economic research with production-minded data pipelines and deep learning systems for high-impact social problems.")}
          </p>
        </div>

        <div className="experience-timeline" aria-label={t("Professional and research experience")}>
          {visibleExperiences.map((experience, index) => {
            const id = experience.role.toLowerCase().replaceAll(" ", "-");
            const isExpanded = expandedId === id;

            return (
            <article
              className={`experience-card ${isExpanded ? "is-expanded" : ""}`}
              key={`${experience.role}-${experience.period}`}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onClick={() => setExpandedId(isExpanded ? "" : id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExpandedId(isExpanded ? "" : id);
                }
              }}
            >
              <div className="experience-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div
                className={[
                  "experience-logo",
                  `is-${experience.tone}`,
                  experience.logoSrc ? "has-image" : "",
                  experience.logoCrop ? "is-cropped" : ""
                ].filter(Boolean).join(" ")}
                aria-hidden="true"
              >
                {experience.logoSrc ? (
                  <img src={experience.logoSrc} alt="" loading="lazy" />
                ) : (
                  experience.logo
                )}
              </div>

              <div className="experience-body">
                <div className="experience-meta">
                  <span>{t(experience.period)}</span>
                  <span>{t(experience.location)}</span>
                </div>

                <h3>{t(experience.role)}</h3>
                <p className="experience-organization">{t(experience.organization)}</p>
                <p className="experience-summary">{t(experience.summary)}</p>

                <div className="experience-details" aria-hidden={!isExpanded}>
                  <p>{t(experience.detail)}</p>
                  <ul className="experience-signals">
                    {experience.signals.map((signal) => (
                      <li key={signal}>{t(signal)}</li>
                    ))}
                  </ul>
                </div>

                <div className="experience-methods" aria-label={t("Methods and tools")}>
                  {(isExpanded ? experience.methods : experience.methods.slice(0, 3)).map((method) => (
                    <span key={method}>{t(method)}</span>
                  ))}
                </div>

                <p className="experience-action">{isExpanded ? t("Click to collapse") : t("Click to see details")}</p>
              </div>
            </article>
          );
          })}
        </div>

        {experiences.length > 2 ? (
          <div className="experience-history-panel">
            <button
              className="experience-history-toggle"
              type="button"
              aria-expanded={showPastExperience}
              onClick={handlePastExperienceToggle}
            >
              {showPastExperience ? t("Hide past experience") : t("See past experience")}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Experience;
