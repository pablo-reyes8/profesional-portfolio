import type { CSSProperties } from "react";

const skills = [
  { name: "Python", icon: "python" },
  { name: "R", icon: "r" },
  { name: "Stata", icon: "stata" },
  { name: "SQL", icon: "postgresql" },
  { name: "LaTeX", icon: "latex" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "scikit-learn", icon: "scikitlearn" },
  { name: "Hugging Face", icon: "huggingface" },
  { name: "OpenCV", icon: "opencv" },
  { name: "Pandas", icon: "pandas" },
  { name: "Docker", icon: "docker" },
  { name: "GitHub Actions", icon: "githubactions" },
  { name: "Power BI", icon: "powerbi" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "Airflow", icon: "apacheairflow" }
];

function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <p className="section-eyebrow">About Me</p>

        <div className="about-grid">
          <div className="about-copy">
            <p className="about-lead">
              I work at the intersection of <strong>machine learning</strong>,{" "}
              <strong>economics</strong>, and{" "}
              <strong>research-driven data science</strong>.
            </p>

            <p>
              I am <strong>Pablo Reyes</strong>, an economist and data scientist
              focused on <strong>machine learning</strong>,{" "}
              <strong>computer vision</strong>, <strong>causal inference</strong>,
              and <strong>Bayesian methods</strong>. I currently work at the
              Central Bank of Colombia as a researcher in the team of Board
              Member Mauricio Villamizar, developing empirical research on
              financial data, market behavior, and economic policy questions.
            </p>

            <p>
              My work combines <strong>deep learning</strong> and rigorous
              empirical methods to study complex social and economic systems. I
              am especially interested in <strong>representation learning</strong>,
              generative computer vision, reproducible research pipelines, and
              models that are not only predictive, but also interpretable and
              useful for understanding real-world mechanisms.
            </p>
          </div>

          <div className="stack-panel" aria-label="Technical stack">
            <p className="stack-title">Stack</p>
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
                    src={`https://cdn.simpleicons.org/${skill.icon}`}
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
