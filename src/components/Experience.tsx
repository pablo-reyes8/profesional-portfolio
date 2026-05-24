import { useState } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";

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
  const [expandedId, setExpandedId] = useState("");

  return (
    <section id="experience" className="experience-section">
      <AmbientParticleBackground className="experience-particles" variant="experience" />

      <div className="experience-container">
        <p className="section-eyebrow">Experience</p>

        <div className="experience-header">
          <h2>Research experience in machine learning and economics.</h2>
          <p>
            My current work connects empirical economic research with production-minded
            data pipelines and deep learning systems for high-impact social problems.
          </p>
        </div>

        <div className="experience-timeline" aria-label="Professional and research experience">
          {experiences.map((experience, index) => {
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
                  <span>{experience.period}</span>
                  <span>{experience.location}</span>
                </div>

                <h3>{experience.role}</h3>
                <p className="experience-organization">{experience.organization}</p>
                <p className="experience-summary">{experience.summary}</p>

                <div className="experience-details" aria-hidden={!isExpanded}>
                  <p>{experience.detail}</p>
                  <ul className="experience-signals">
                    {experience.signals.map((signal) => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                </div>

                <div className="experience-methods" aria-label="Methods and tools">
                  {(isExpanded ? experience.methods : experience.methods.slice(0, 3)).map((method) => (
                    <span key={method}>{method}</span>
                  ))}
                </div>

                <p className="experience-action">{isExpanded ? "Click to collapse" : "Click to see details"}</p>
              </div>
            </article>
          );
          })}
        </div>
      </div>
    </section>
  );
}

export default Experience;
