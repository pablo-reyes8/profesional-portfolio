import { useMemo, useState, type CSSProperties } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";

type ProjectCategory =
  | "Feature"
  | "Advanced Deep Learning"
  | "MLOps"
  | "Econometrics"
  | "Machine Learning Applications";

interface ProjectItem {
  id: string;
  category: ProjectCategory;
  title: string;
  source: string;
  github: string;
  summary: string;
  detail: string;
  stack: string[];
  results: string[];
}

const categories: ProjectCategory[] = [
  "Feature",
  "Advanced Deep Learning",
  "MLOps",
  "Econometrics",
  "Machine Learning Applications"
];

const stackIcons: Record<string, string> = {
  Airflow: "apacheairflow",
  ARIMA: "r",
  "Bayesian DLM": "r",
  "Bayesian VAR": "r",
  Chroma: "chromatic",
  "CIFAR-100": "pytorch",
  CNNs: "pytorch",
  DDP: "pytorch",
  DDIM: "pytorch",
  DDPM: "pytorch",
  DSGE: "r",
  DataOps: "databricks",
  Diffusion: "pytorch",
  Docker: "docker",
  DVC: "dvc",
  "Earth Engine": "googleearth",
  Econometrics: "r",
  FastAPI: "fastapi",
  Flask: "flask",
  Gensys: "python",
  "GitHub Actions": "githubactions",
  "Grad-CAM": "pytorch",
  "Hugging Face": "huggingface",
  "Integrated Gradients": "pytorch",
  "Kalman Filter": "python",
  Kubeflow: "kubeflow",
  LangChain: "langchain",
  LIME: "python",
  LSTM: "pytorch",
  MCMC: "r",
  MLflow: "mlflow",
  MoE: "pytorch",
  "Muon's": "pytorch",
  Muon: "pytorch",
  NLP: "spacy",
  NumPy: "numpy",
  Pandas: "pandas",
  Pillow: "python",
  POMDP: "pytorch",
  PyTorch: "pytorch",
  Python: "python",
  R1: "pytorch",
  RL: "pytorch",
  ResNet: "pytorch",
  "ResNet-101": "pytorch",
  "Random Forest": "scikitlearn",
  Scraping: "python",
  Simulation: "python",
  "Spectral Norm": "pytorch",
  SQLite: "sqlite",
  Streamlit: "streamlit",
  SymPy: "python",
  "Time Series": "r",
  Transformers: "huggingface",
  UNet: "pytorch",
  UNet3D: "pytorch",
  VAE: "pytorch",
  VAR: "r",
  VGG19: "pytorch",
  VB: "r",
  ViT: "pytorch",
  XGBoost: "xgboost",
  YAML: "yaml",
  pytest: "pytest"
};

function getStackIconUrl(item: string): string | null {
  const slug = stackIcons[item];
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
}

function GitHubIcon() {
  return (
    <svg className="project-action-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.97c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.95.68 1.92v2.84c0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

const projects: ProjectItem[] = [
  {
    id: "alphafold2",
    category: "Feature",
    title: "AlphaFold2 Research Rebuild",
    source: "alphafoldv2.md",
    github: "https://github.com/pablo-reyes8/alphafold2-from-scratch",
    summary: "A from-scratch PyTorch reconstruction of AlphaFold2 focused on geometry, Evoformer internals, ablations, and accessible structural deep learning.",
    detail:
      "Rebuilds the AlphaFold2 learning pipeline as a research object: MSA and pair representations, Evoformer blocks, invariant point attention, recycling, structural losses, Foldbench data tooling, and config-driven experiments.",
    stack: ["Python", "PyTorch", "YAML", "Foldbench", "Docker", "DDP"],
    results: ["Evoformer and structure module implemented", "FAPE, distogram, pLDDT, and torsion losses", "Ablation-ready training and data inspection CLIs"]
  },
  {
    id: "deepseek-v4",
    category: "Feature",
    title: "DeepSeek-V4 Mini Systems Lab",
    source: "Deepseek-v4.md",
    github: "https://github.com/pablo-reyes8/deepseek-v4-mini-pytorch",
    summary: "A paper-faithful mini implementation of DeepSeek-V4 mechanisms for transparent experiments in long-context language modeling.",
    detail:
      "Implements the architectural ideas behind DeepSeek-V4 at research scale: hybrid compressed attention, compressed sparse attention, MoE routing, manifold-constrained hyper-connections, multi-token prediction, Muon training, inference caches, ablations, and CI-tested modules.",
    stack: ["Python", "PyTorch", "Transformers", "MoE", "Muon", "Docker"],
    results: ["HCA and CSA cache-aware inference path", "Six ablation suites", "Synthetic retrieval and Hugging Face dataset presets"]
  },
  {
    id: "diffusion-aging",
    category: "Feature",
    title: "Dual-Scale Diffusion Aging",
    source: "agging.md",
    github: "https://github.com/pablo-reyes8/dual-aging-diffusion",
    summary: "A research pipeline for face aging with global and local latent diffusion branches, identity-aware fusion, and DataOps controls.",
    detail:
      "Studies face aging as both a global semantic edit and a local texture synthesis problem. The system combines full-face aging, region-level aging, deterministic residual fusion, reusable data modules, CLIs, manifests, smoke tests, Docker, and technical documentation.",
    stack: ["Python", "PyTorch", "Diffusion", "DataOps", "Docker", "pytest"],
    results: ["Global and local aging branches", "Residual fusion for identity preservation", "Governed preprocessing and inference workflow"]
  },
  {
    id: "bayesian-structural-var",
    category: "Feature",
    title: "Bayesian Monetary Shock Lab",
    source: "bayesian-structural-var.md",
    github: "https://github.com/pablo-reyes8/bayesian-structural-var",
    summary: "A Bayesian SBVAR and Local Projections framework for studying U.S. monetary policy spillovers into Colombian macro-financial variables.",
    detail:
      "Estimates structural monetary shocks using agnostic identification, posterior filtering, MCMC diagnostics, impulse responses, FEVDs, and Local Projections for robustness across Bayesian and frequentist views of shock transmission.",
    stack: ["Python", "NumPy", "Bayesian VAR", "MCMC", "Local Projections", "Econometrics"],
    results: ["Two-chain MCMC diagnostics", "IRFs and FEVD outputs", "LP robustness checks for structural dynamics"]
  },
  {
    id: "outgrid",
    category: "Advanced Deep Learning",
    title: "OutGridViT Architecture Lab",
    source: "outgrid.md",
    github: "https://github.com/pablo-reyes8/outlook-grid-vision-transformer",
    summary: "A hybrid vision transformer combining dynamic local aggregation, MBConv inductive bias, and grid attention.",
    detail:
      "Builds and evaluates an original vision architecture with CIFAR-100 experiments, TinyImageNet-C robustness checks, MAD and entropy diagnostics, convergence curves, and baseline comparisons against DeiT, Swin, MaxViT, and ResNet.",
    stack: ["Python", "PyTorch", "ViT", "Attention", "CIFAR-100", "TinyImageNet-C"],
    results: ["Model comparison tables", "Robustness experiments", "Attention and MAD analysis"]
  },
  {
    id: "stable-diffusion",
    category: "Advanced Deep Learning",
    title: "Attribute-Conditioned Latent Diffusion",
    source: "stable difussion.md",
    github: "https://github.com/pablo-reyes8/conditioning-stable-diffusion",
    summary: "A latent diffusion training and sampling stack for attribute-conditioned face generation with CFG and cross-attention.",
    detail:
      "Runs a reproducible data-to-training-to-evaluation workflow with VAE latents, UNet denoising, binary attribute conditioning, classifier-free guidance, EMA, mixed precision, DDIM sampling, and offline FID/KID/IS evaluation.",
    stack: ["Python", "PyTorch", "Diffusion", "VAE", "CFG", "Hugging Face"],
    results: ["512px model training path", "54+ epoch sample progress", "CLI pipeline for data, training, inference, evaluation"]
  },
  {
    id: "vision-transformers",
    category: "Advanced Deep Learning",
    title: "Vision Transformer Comparison Arena",
    source: "ViTs.md",
    github: "https://github.com/pablo-reyes8/multiscale-vision-transformers",
    summary: "A shared benchmark arena for ViT, HierarchicalViT, Swin, MaxViT, and VOLO under consistent training recipes.",
    detail:
      "Compares modern transformer families under a common data split, model factory, augmentation presets, evaluation pipeline, Docker setup, and training logs for reproducible architecture analysis.",
    stack: ["Python", "PyTorch", "ViT", "CIFAR-100", "Docker", "pytest"],
    results: ["VOLO 67.90% Top-1 on CIFAR-100 snapshot", "MaxViT 89.92% Top-5", "Shared comparison arena"]
  },
  {
    id: "medical-segmentation",
    category: "MLOps",
    title: "Medical Segmentation MLOps Suite",
    source: "medseg-unet.md",
    github: "https://github.com/pablo-reyes8/unet3d-medseg",
    summary: "A production-minded UNet3D segmentation platform with APIs, review tooling, drift checks, and orchestration.",
    detail:
      "Wraps medical image segmentation in an operational stack: FastAPI inference, Streamlit review console, Dockerized deployment, explicit data contracts, MLflow hooks, monitoring, drift checks, retraining, and rollback decisions.",
    stack: ["Python", "PyTorch", "UNet3D", "FastAPI", "Streamlit", "Airflow"],
    results: ["Local-first MLOps platform", "API and review console", "Data contracts and drift monitoring"]
  },
  {
    id: "subsidy-mlops",
    category: "MLOps",
    title: "Subsidy Targeting MLOps Pipeline",
    source: "mlops-subsidy-clasification.md",
    github: "https://github.com/pablo-reyes8/colombia-subsidy-ml-prediction",
    summary: "An end-to-end MLOps project for subsidy candidate prediction under severe class imbalance in Colombian household survey data.",
    detail:
      "Combines supervised cascade models, anomaly baselines, threshold optimization, MLflow tracking, DVC pipelines, Kubeflow compilation, FastAPI serving, Docker profiles, and Evidently drift checks.",
    stack: ["Python", "XGBoost", "Random Forest", "MLflow", "DVC", "Kubeflow"],
    results: ["Threshold-aware evaluation", "FastAPI prediction service", "Drift and reproducibility pipeline"]
  },
  {
    id: "tourism-forecasting",
    category: "Machine Learning Applications",
    title: "Colombia Tourism Forecasting System",
    source: "ml-turism-forecasting.md",
    github: "https://github.com/pablo-reyes8/colombia-tourism-ml-forecasting",
    summary: "A high-dimensional forecasting project for international tourist arrivals across Colombian cities.",
    detail:
      "Builds a panel dataset with remote sensing, macroeconomic, security, infrastructure, climate, event, and expenditure variables, then compares ML regressors and econometric benchmarks with interpretability outputs.",
    stack: ["Python", "XGBoost", "Panel Data", "LIME", "PDP", "Earth Engine"],
    results: ["XGBoost near 0.99 R2 snapshot", "City-level interpretability", "Strategic tourism insights"]
  },
  {
    id: "inflation-forecasting",
    category: "Econometrics",
    title: "Inflation Forecasting Arena",
    source: "inflation-forecasting-ml-vs-econometrics.md",
    github: "https://github.com/pablo-reyes8/inflation-forecasting-arima-lstm",
    summary: "A research-grade forecasting toolkit comparing ARIMA, volatility models, machine learning, and deep learning.",
    detail:
      "Packages state-level inflation forecasting into a CLI, Streamlit arena, documented HTTP API, data assets, artifacts, and model comparison framework spanning classical econometrics and modern predictive methods.",
    stack: ["Python", "ARIMA", "GARCH", "LSTM", "Streamlit", "FastAPI"],
    results: ["Unified model arena", "Interactive forecasting app", "Classical vs deep learning comparison"]
  },
  {
    id: "python-dsge",
    category: "Econometrics",
    title: "Python DSGE Modeling Toolkit",
    source: "python-dsge-library.md",
    github: "https://github.com/pablo-reyes8/python-dsge-library",
    summary: "A Dynare-style Python toolkit for symbolic DSGE specification, solution, and Bayesian estimation.",
    detail:
      "Connects symbolic equations, parameter registries, linearization, Gensys solution, Kalman likelihood, MAP estimation, adaptive Metropolis-Hastings, and impulse-response analysis in composable Python modules.",
    stack: ["Python", "SymPy", "Gensys", "Kalman Filter", "MCMC", "DSGE"],
    results: ["Symbolic-to-linear pipeline", "Bayesian estimation primitives", "IRF and MCMC diagnostics"]
  },
  {
    id: "sgdlm",
    category: "Econometrics",
    title: "Simultaneous Graphical DLM",
    source: "bayesian-sgdlm.md",
    github: "https://github.com/pablo-reyes8/bayesian-sgdlm",
    summary: "A Bayesian dynamic forecasting workflow for multivariate time series with graphical decouple-recouple structure.",
    detail:
      "Implements Simultaneous Graphical DLM ideas with lagged cross-series structure, Minnesota-style priors, decoupled DLM updates, recoupling, variational Bayes, and importance-sampling refinement.",
    stack: ["Python", "Bayesian DLM", "VAR", "VB", "Importance Sampling", "Time Series"],
    results: ["Dynamic VAR reconstruction", "Graph-constrained recoupling", "Notebook and modular code paths"]
  },
  {
    id: "sme-agent",
    category: "Machine Learning Applications",
    title: "SME Finance AI Advisor",
    source: "sme-ai-advicer.md",
    github: "https://github.com/pablo-reyes8/sme-ai-advicer",
    summary: "A finance assistant for Colombian SMEs with local knowledge retrieval, conversational memory, and financial calculators.",
    detail:
      "Combines Flask, LangChain, Chroma retrieval, local versioned knowledge, structured prompts, SQLite persistence, quick-reply UI patterns, metrics, Docker deployment, and calculators for liquidity, margins, break-even, and cash flow.",
    stack: ["Python", "Flask", "LangChain", "Chroma", "SQLite", "Docker"],
    results: ["Local semantic retrieval", "Persistent user preferences", "Finance calculator routing"]
  },
  {
    id: "news-nlp",
    category: "Machine Learning Applications",
    title: "Colombian News Intelligence Map",
    source: "colombia-news-nlp.md",
    github: "https://github.com/pablo-reyes8/colombian-news-nlp-analysis",
    summary: "A Spanish NLP pipeline for scraping, cleaning, and analyzing Colombian news topics, sentiment, and entities.",
    detail:
      "Transforms fragmented media sources into a structured map of news trends by combining scraping, cleaning, topic analysis, sentiment analysis, named-entity recognition, and API-oriented cleanup.",
    stack: ["Python", "NLP", "Scraping", "NER", "Topic Modeling", "Spanish Text"],
    results: ["Multi-source Colombian media corpus", "Topic, sentiment, and entity outputs", "Structured trend analysis"]
  },
  {
    id: "blackjack-rl",
    category: "Machine Learning Applications",
    title: "Blackjack POMDP Research Environment",
    source: "blackjack.md",
    github: "https://github.com/pablo-reyes8/blackjack",
    summary: "A pure-PyTorch reinforcement learning environment that treats Blackjack as a partially observable sequential decision problem.",
    detail:
      "Models hidden shoe state, reshuffle dynamics, cut-card behavior, variable observations, explicit betting phases, replay buffers, staged training, distillation, and transparent experiment pipelines without Gym abstractions.",
    stack: ["Python", "PyTorch", "RL", "POMDP", "Experiment Tracking", "Simulation"],
    results: ["Custom environment dynamics", "Bet-sizing and hidden-state modeling", "Research-grade training presets"]
  },
  {
    id: "style-transfer",
    category: "Advanced Deep Learning",
    title: "Attention-Guided Style Transfer",
    source: "styletransfer.md",
    github: "https://github.com/pablo-reyes8/a2k-style-transfer",
    summary: "A feed-forward artistic style transfer system with multi-level attention fusion and moment-aware perceptual losses.",
    detail:
      "Combines a frozen VGG19 encoder, cross-attention over content and style features, AdaIN-inspired decoding, Gram and moment matching, total variation regularization, mixed precision, and SOTA-vs-baseline qualitative comparisons.",
    stack: ["Python", "PyTorch", "VGG19", "Attention", "AdaIN", "AMP"],
    results: ["Cleaner brushwork and color transfer", "Baseline vs SOTA comparisons", "High-resolution stylization workflow"]
  },
  {
    id: "ddpm",
    category: "Advanced Deep Learning",
    title: "DDPM Diffusion Playground",
    source: "ddpm.md",
    github: "https://github.com/pablo-reyes8/ddpm-diffusion-model",
    summary: "A PyTorch implementation of DDPM/DDIM image generation with attention and model-capacity experiments.",
    detail:
      "Reproduces Denoising Diffusion Probabilistic Models and extends the sandbox with DDIM sampling, UNet variants with and without attention, and controlled experiments on sample quality, speed, and capacity.",
    stack: ["Python", "PyTorch", "DDPM", "DDIM", "UNet", "CelebA"],
    results: ["DDPM and DDIM support", "Attention and capacity ablations", "Generation research playground"]
  },
  {
    id: "gans",
    category: "Advanced Deep Learning",
    title: "GAN Objectives and Stabilization Lab",
    source: "gans-implementations.md",
    github: "https://github.com/pablo-reyes8/pytorch-gans",
    summary: "A PyTorch research playground for comparing GAN architectures, losses, datasets, and stabilization tricks.",
    detail:
      "Explores MLP GANs, DCGAN, hinge/SNGAN, StyleGAN-inspired components, saturating and non-saturating losses, spectral normalization, R1 regularization, EMA, DiffAugment, and dataset complexity effects.",
    stack: ["Python", "PyTorch", "GANs", "Spectral Norm", "R1", "EMA"],
    results: ["Architecture and loss comparisons", "Dataset complexity studies", "Extensible GAN training code"]
  },
  {
    id: "cnn-survey",
    category: "Advanced Deep Learning",
    title: "CNN Architecture Survey from Scratch",
    source: "cnn-architectures-survery.md",
    github: "https://github.com/pablo-reyes8/famous-cnns-from-scratch",
    summary: "A code-first literature review of influential CNN architectures implemented from scratch in PyTorch.",
    detail:
      "Implements classic CNN families without torchvision wrappers, mapping architecture details to original papers across LeNet, AlexNet, VGG, Inception, ResNet, U-Net, MobileNet, and EfficientNet.",
    stack: ["Python", "PyTorch", "CNNs", "ResNet", "U-Net", "EfficientNet"],
    results: ["Self-contained architecture modules", "Training scripts and tests", "Historical architecture timeline"]
  },
  {
    id: "cat-dog-interpretability",
    category: "MLOps",
    title: "ResNet Interpretability Service",
    source: "cnn-mlops-interpretability.md",
    github: "https://github.com/SPMINE-2425/proyecto-final-reyes-castano",
    summary: "A full-stack ResNet-101 cat-vs-dog classifier with explainability tools and reproducible configuration.",
    detail:
      "Ships an API and app for binary image classification with occlusion sensitivity, Integrated Gradients, Grad-CAM, feature maps, kernel visualization, modular YAML configs, and evaluation utilities.",
    stack: ["Python", "PyTorch", "ResNet-101", "FastAPI", "Grad-CAM", "Integrated Gradients"],
    results: ["Prediction API and app", "Multiple explanation methods", "Config-driven reproducibility"]
  },
  {
    id: "scratch-convnet",
    category: "Machine Learning Applications",
    title: "CNN from First Principles",
    source: "convnet-pure-python.md",
    github: "https://github.com/pablo-reyes8/scratch-conv-net-classification",
    summary: "A pure Python and NumPy convolutional network built to expose every forward and backward pass detail.",
    detail:
      "Implements 2D convolution, ReLU, max pooling, flattening, dense softmax, backpropagation, Adam, unit tests, and notebooks for hands-on experimentation without autograd abstractions.",
    stack: ["Python", "NumPy", "Pillow", "CNN", "Backpropagation", "pytest"],
    results: ["Hand-coded neural network components", "Unit-tested math", "Interactive learning notebooks"]
  }
];

function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("Feature");
  const [expandedId, setExpandedId] = useState<string>("");

  const visibleProjects = useMemo(
    () => projects.filter((project) => project.category === activeCategory),
    [activeCategory]
  );

  const orderedProjects = useMemo(() => {
    if (!expandedId) {
      return visibleProjects;
    }

    const expandedProject = visibleProjects.find((project) => project.id === expandedId);
    if (!expandedProject) {
      return visibleProjects;
    }

    return [
      expandedProject,
      ...visibleProjects.filter((project) => project.id !== expandedId)
    ];
  }, [expandedId, visibleProjects]);

  const handleCategoryChange = (category: ProjectCategory): void => {
    setActiveCategory(category);
    setExpandedId("");
  };

  return (
    <section id="projects" className="projects-section">
      <AmbientParticleBackground className="projects-particles" variant="projects" />
      <div className="projects-container">
        <p className="section-eyebrow">Projects</p>
        <div className="projects-heading-row">
          <h2 className="projects-title">Selected research systems, shipped as working code.</h2>
        </div>

        <div className="project-tabs" aria-label="Project categories">
          {categories.map((category) => (
            <button
              className={`project-tab ${category === activeCategory ? "is-active" : ""}`}
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
            >
              {category === "Feature" ? <span className="project-tab-star">★</span> : null}
              {category}
            </button>
          ))}
        </div>

        <div className={`project-grid ${activeCategory === "Feature" ? "is-feature" : ""} ${expandedId ? "has-expanded" : ""}`}>
          {orderedProjects.map((project) => {
            const isExpanded = project.id === expandedId;
            const stackItems = isExpanded ? project.stack : project.stack.slice(0, 4);
            return (
              <article
                className={`project-card ${isExpanded ? "is-expanded" : ""}`}
                key={project.id}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => setExpandedId(project.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedId(project.id);
                  }
                }}
              >
                <div className="project-card-topline">
                  <span>{project.category}</span>
                  <span>{isExpanded ? "Expanded" : "Open project"}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
                {isExpanded ? (
                  <div className="project-expanded-content">
                    <div className="project-expanded-copy">
                      <p>{project.detail}</p>
                      <p>
                        The portfolio focus here is the full research-to-code surface:
                        modeling decisions, reproducible workflows, evaluation artifacts,
                        and enough engineering structure for the system to be inspected,
                        extended, and rerun.
                      </p>
                    </div>
                    <div className="project-results">
                      <p className="project-results-title">Signals</p>
                      {project.results.map((result) => (
                        <span key={result}>{result}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="project-stack">
                  {stackItems.map((item, index) => {
                    const iconUrl = getStackIconUrl(item);
                    return (
                      <span
                        className="project-stack-chip"
                        key={item}
                        style={{ "--chip-index": index } as CSSProperties}
                      >
                        {iconUrl ? (
                          <img alt="" className="project-stack-icon" src={iconUrl} />
                        ) : (
                          <span className="project-stack-fallback">{item.slice(0, 1)}</span>
                        )}
                        {item}
                      </span>
                    );
                  })}
                </div>
                <div className="project-actions">
                  {isExpanded ? (
                    <button
                      className="project-action-button project-back"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setExpandedId("");
                      }}
                    >
                      Back
                    </button>
                  ) : null}
                  <a
                    className="project-action-button project-github"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <GitHubIcon />
                    GitHub Code
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <p className="project-grid-hint">Click to see full details</p>
      </div>
    </section>
  );
}

export default Projects;
