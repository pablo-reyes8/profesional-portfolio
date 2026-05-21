import GravityFieldCanvas from "./GravityFieldCanvas";

function Hero() {
  return (
    <section className="hero" id="top">
      <GravityFieldCanvas />
      <div className="hero-content">
        <p className="hero-eyebrow">Pablo Reyes · Machine Learning Researcher</p>
        <h1 className="hero-title">
          Building intelligent systems at the intersection of machine learning,
          economics, and society.
        </h1>
        <p className="hero-subtitle">
          I am an economist and machine learning researcher focused on deep
          learning, computer vision, representation learning, and empirical
          research for high-impact social and economic problems.
        </p>
        <div className="hero-actions" aria-label="Portfolio actions">
          <a className="hero-button primary" href="#projects">
            View research work
          </a>
          <a className="hero-button secondary" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
