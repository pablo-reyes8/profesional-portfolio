import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (text: string) => string;
}

const translations: Record<string, string> = {
  "Pablo Reyes home": "Inicio de Pablo Reyes",
  "Main navigation": "Navegación principal",
  "External links": "Enlaces externos",
  "About Me": "Sobre mí",
  Projects: "Proyectos",
  Experience: "Experiencia",
  Formation: "Formación",
  Contact: "Contacto",
  "Economist & Data Scientist": "Economista & Científico de Datos",
  "Learning from data to understand complex systems.": "Aprendiendo de los datos para entender sistemas complejos.",
  "Explore my work across machine learning, data science, computer vision, and applied economic research.":
    "Explora mi trabajo en machine learning, ciencia de datos, visión computacional e investigación económica.",
  "Portfolio actions": "Acciones del portafolio",
  "View Projects": "Ver proyectos",
  "I am ": "Soy ",
  ", an economist and data scientist focused": ", economista y científico de datos enfocado",
  "on ": "en ",
  "computer vision": "visión computacional",
  "causal inference": "inferencia causal",
  "Bayesian methods": "métodos bayesianos",
  ", and applied machine learning. I": " y machine learning aplicado. Actualmente",
  "currently work at the Central Bank of Colombia as a researcher in the team":
    "trabajo en el Banco de la República como investigador en el equipo",
  "of Board Member Mauricio Villamizar, developing empirical research on":
    "del codirector Mauricio Villamizar, desarrollando investigación empírica sobre",
  "financial data, market behavior, and economic policy questions.":
    "datos financieros, comportamiento de mercado y política económica.",
  "My work combines ": "Mi trabajo combina ",
  "deep learning": "deep learning",
  " and rigorous empirical": " y métodos empíricos rigurosos",
  "methods to study real-world mechanisms. I am especially interested in":
    "para estudiar mecanismos reales. Me interesan especialmente",
  "representation learning": "representation learning",
  ", generative computer vision,": ", visión generativa,",
  "reproducible research pipelines, and models that are not only predictive,":
    "pipelines reproducibles y modelos no solo predictivos,",
  "but also interpretable and useful for understanding economic and social":
    "sino interpretables y útiles para entender dinámicas económicas y sociales.",
  "dynamics.": "",
  Stack: "Stack",
  "Technical stack": "Stack técnico",
  "Interested in a data-driven solution for a complex research or quantitative problem?":
    "¿Buscas una solución con datos para un problema complejo de investigación o cuantitativo?",
  "Send me a short note about the question, system, or research workflow you have in mind.":
    "Envíame una nota breve sobre la pregunta, sistema o flujo de investigación que tienes en mente.",
  Name: "Nombre",
  Email: "Email",
  Message: "Mensaje",
  "Send Message": "Enviar mensaje",
  "Portfolio contact from": "Contacto desde portafolio de",
  Visitor: "Visitante",

  "Research experience in machine learning and economics.": "Experiencia en machine learning y economía.",
  "My current work connects empirical economic research with production-minded data pipelines and deep learning systems for high-impact social problems.":
    "Mi trabajo conecta investigación económica empírica con pipelines de datos y deep learning para problemas sociales de alto impacto.",
  "Professional and research experience": "Experiencia profesional e investigativa",
  "Methods and tools": "Métodos y herramientas",
  "Professional Research Assistant": "Asistente profesional de investigación",
  "Central Bank of Colombia — Board of Directors": "Banco de la República — Junta Directiva",
  "2025–Present": "2025–Presente",
  "Bogotá, Colombia · Hybrid": "Bogotá, Colombia · Híbrido",
  "Empirical research on market behavior, credit risk, institutional dynamics, and large-scale financial data for policy-relevant questions.":
    "Investigación empírica sobre mercados, riesgo crediticio, dinámica institucional y datos financieros para preguntas de política.",
  "I work on empirical research workflows that connect financial microdata, policy questions, and reproducible modeling. The role combines dataset construction, econometric design, risk modeling, and clear research outputs for decision-facing environments.":
    "Trabajo en flujos empíricos que conectan microdatos financieros, política y modelación reproducible. El rol combina datos, econometría, riesgo y resultados claros para decisión.",
  "Causal inference and survival analysis for household credit portfolios":
    "Inferencia causal y supervivencia para crédito de hogares",
  "Hazard models for default selection and delinquency transitions":
    "Modelos hazard para default y mora",
  "Reproducible Python pipelines for regulatory and financial datasets":
    "Pipelines Python reproducibles para datos regulatorios y financieros",
  "Junior Researcher": "Investigador junior",
  "Bogotá, Colombia · In person": "Bogotá, Colombia · Presencial",
  "Computer vision and generative modeling research for socially relevant identification tasks in collaboration with Colombia's Missing Persons Search Unit.":
    "Investigación en visión computacional y modelos generativos para identificación socialmente relevante con la UBPD.",
  "The work focuses on visual representation learning under difficult data conditions: limited samples, identity-sensitive tasks, domain shift, and the need for controllable outputs that can support human-centered research workflows.":
    "El trabajo aborda representación visual con datos difíciles: pocas muestras, identidad sensible, cambio de dominio y salidas controlables para investigación centrada en personas.",
  "Deep learning pipelines for facial aging and biometric synthesis":
    "Pipelines de deep learning para envejecimiento facial y síntesis biométrica",
  "Representation learning under limited-data and domain-shift settings":
    "Representation learning con pocos datos y cambio de dominio",
  "Diffusion and transformer methods for controllable visual generation":
    "Difusión y transformers para generación visual controlable",
  "Research Intern": "Practicante de investigación",
  "Jul 2025–Dec 2025": "Jul 2025–Dic 2025",
  "Applied research on uniform-price auction microstructure, bidding behavior, liquidity provision, and price formation.":
    "Investigación aplicada sobre subastas uniformes, pujas, liquidez y formación de precios.",
  "I built and validated analytical datasets for primary-market auction research, then used microeconometric tools to study how institutional participants behave across bidding, liquidity provision, and price discovery settings.":
    "Construí y validé datos para subastas primarias, usando microeconometría para estudiar pujas, liquidez y descubrimiento de precios.",
  "Validated analytical datasets for primary-market auction research":
    "Datos analíticos validados para subastas primarias",
  "Microeconometric analysis of dealer behavior and strategic bidding":
    "Análisis microeconométrico de dealers y pujas estratégicas",
  "High-frequency institutional trading environment analysis":
    "Análisis de trading institucional de alta frecuencia",
  "Research Assistant": "Asistente de investigación",
  "Jan 2025–Dec 2025": "Ene 2025–Dic 2025",
  "Bogotá, Colombia · Remote": "Bogotá, Colombia · Remoto",
  "Quantitative policy analysis using Bayesian econometrics, graph methods, and computational workflows for macroeconomic systems.":
    "Análisis cuantitativo de política con econometría bayesiana, grafos y flujos computacionales para sistemas macro.",
  "This work translated policy questions into computational research pipelines, combining Bayesian modeling, network representations, and simulation logic to analyze fiscal sustainability and sectoral propagation.":
    "Este trabajo convirtió preguntas de política en pipelines computacionales, combinando Bayes, redes y simulación para sostenibilidad fiscal y propagación sectorial.",
  "Bayesian fiscal sustainability and macroeconomic risk analysis":
    "Sostenibilidad fiscal bayesiana y riesgo macro",
  "Input-output network framework for shock propagation":
    "Red insumo-producto para propagación de choques",
  "Simulation workflows for policy transmission and sectoral dynamics":
    "Simulación para transmisión de política y dinámica sectorial",
  "Teaching Assistant": "Monitor académico",
  "Directed tutorials and practical computational exercises for Convex Optimization, connecting mathematical foundations with implementation.":
    "Dirigí tutorías y ejercicios computacionales de Optimización Convexa, conectando fundamentos matemáticos con implementación.",
  "The teaching work emphasized clear mathematical reasoning and applied implementation, helping students move from optimization theory to computational exercises in Python and SciLab.":
    "La docencia enfatizó razonamiento matemático claro e implementación aplicada, llevando teoría de optimización a ejercicios en Python y SciLab.",
  "Optimization, dynamic programming, and multivariable calculus support":
    "Apoyo en optimización, programación dinámica y cálculo multivariable",
  "Applied exercises with Python and SciLab": "Ejercicios aplicados con Python y SciLab",
  "Student-facing explanation of quantitative methods":
    "Explicación de métodos cuantitativos a estudiantes",
  Econometrics: "Econometría",
  "Causal Inference": "Inferencia causal",
  "Financial Data": "Datos financieros",
  "Computer Vision": "Visión computacional",
  "Representation Learning": "Representation learning",
  "Market Microstructure": "Microestructura",
  Auctions: "Subastas",
  "Bayesian Methods": "Métodos bayesianos",
  "Graph Theory": "Teoría de grafos",
  Macroeconomics: "Macroeconomía",
  Teaching: "Docencia",
  "Click to collapse": "Click para cerrar",
  "Click to see details": "Click para detalles",
  "Hide past experience": "Ocultar experiencia previa",
  "See past experience": "Ver experiencia previa",

  "Academic training in economics, statistics, and machine learning.":
    "Formación en economía, estadística y machine learning.",
  "A compact view of my formal education,  built around economic analysis, statistical modeling, and machine learning.":
    "Una vista compacta de mi formación, centrada en análisis económico, modelación estadística y machine learning.",
  "Academic formation": "Formación académica",
  "B.A. in Economics": "Economía",
  "Highest GPA in the Economics cohort, with a concentration in quantitative methods and artificial intelligence applied to economics.":
    "Mejor promedio de la cohorte de Economía, con énfasis en métodos cuantitativos e IA aplicada.",
  "Interdisciplinary economics training across macroeconomics, microeconomics, econometrics, finance, political science, law, administration, history, and philosophy.":
    "Formación interdisciplinaria en macro, micro, econometría, finanzas, ciencia política, derecho, administración, historia y filosofía.",
  "Strong emphasis on quantitative analysis, applied economic research, and data-driven reasoning for social and economic systems.":
    "Énfasis en análisis cuantitativo, investigación aplicada y razonamiento con datos para sistemas sociales y económicos.",
  "Graduated with the highest GPA in the Economics cohort.":
    "Graduado con el mejor promedio de la cohorte de Economía.",
  Economics: "Economía",
  "Quant Methods": "Métodos cuant.",
  "Applied AI": "IA aplicada",
  Research: "Investigación",
  "Economics Degree Act": "Acta de grado",
  "M.Sc. in Business Intelligence": "M.Sc. en Inteligencia de Negocios",
  "2024–Present": "2024–Presente",
  "Graduate work focused on advanced analytics, machine learning, statistical modeling, and data management.":
    "Posgrado centrado en analítica avanzada, machine learning, modelación estadística y gestión de datos.",
  "Graduate training in advanced analytics, machine learning, statistical modeling, and data management.":
    "Formación de posgrado en analítica avanzada, machine learning, modelación estadística y gestión de datos.",
  "Focus on organizing and using information systems to support strategic decision-making.":
    "Enfoque en organizar y usar sistemas de información para apoyar decisiones estratégicas.",
  "Connects analytical methods with business intelligence systems in economic, financial, and administrative contexts.":
    "Conecta métodos analíticos con BI en contextos económicos, financieros y administrativos.",
  "Business Intelligence": "Inteligencia de Negocios",
  Analytics: "Analítica",
  "Machine Learning": "Machine Learning",
  "Data Management": "Gestión de Datos",
  Strategy: "Estrategia",
  "Undergraduate Track in Data Science": "Énfasis en Ciencia de Datos",
  "Formal training in programming, data science, machine learning, statistical modeling, and computational methods.":
    "Formación formal en programación, ciencia de datos, machine learning, estadística y métodos computacionales.",
  "Formal complement to economics training in programming, data science, machine learning, and statistical modeling.":
    "Complemento formal a Economía en programación, ciencia de datos, machine learning y estadística.",
  "Strengthens reproducible quantitative workflows for empirical research and model development.":
    "Fortalece flujos cuantitativos reproducibles para investigación empírica y desarrollo de modelos.",
  "Provides the technical layer for data-driven products and computational research pipelines.":
    "Aporta la capa técnica para productos de datos y pipelines de investigación computacional.",
  "Data Science": "Ciencia de Datos",
  "Statistical Modeling": "Modelación estadística",
  "Reproducible Workflows": "Flujos reproducibles",
  "MicroMasters Program in Statistics and Data Science": "MicroMasters en Estadística y Ciencia de Datos",
  "Rigorous training in probability, statistics, data analysis, and machine learning through the MITx MicroMasters sequence.":
    "Formación rigurosa en probabilidad, estadística, análisis de datos y machine learning vía MITx.",
  "Mathematically rigorous MITx sequence around probability, statistics, data analysis, and machine learning.":
    "Secuencia MITx rigurosa en probabilidad, estadística, análisis de datos y machine learning.",
  "Built for statistical reasoning, computational inference, and modern data science methods.":
    "Diseñado para razonamiento estadístico, inferencia computacional y ciencia de datos moderna.",
  "Part of the MITx MicroMasters structure developed with IDSS.":
    "Parte del MicroMasters MITx desarrollado con IDSS.",
  "Current coursework includes Probability and Fundamentals of Statistics, with emphasis on proof-based reasoning and applied inference.":
    "Cursos actuales: Probabilidad y Fundamentos de Estadística, con énfasis en pruebas e inferencia aplicada.",
  Probability: "Probabilidad",
  Statistics: "Estadística",
  "Fundamentals of Statistics": "Fundamentos de Estadística",
  "Diploma in Advanced Machine Learning and Data Science": "Diplomado en Machine Learning Avanzado y Ciencia de Datos",
  "Aug 2025–Dec 2025": "Ago 2025–Dic 2025",
  "Applied training in machine learning, NLP, 3D computer vision, MLOps, and end-to-end machine learning projects.":
    "Formación aplicada en machine learning, NLP, visión 3D, MLOps y proyectos end-to-end.",
  "192-hour applied program from Universidad Nacional de Colombia focused on practical and advanced machine learning methods.":
    "Programa aplicado de 192 horas de la Universidad Nacional sobre métodos avanzados de machine learning.",
  "Covers deep learning, NLP, MLOps, 3D computer vision, and applied project workflows.":
    "Cubre deep learning, NLP, MLOps, visión 3D y flujos de proyectos aplicados.",
  "Designed around end-to-end machine learning systems and modern data science practice.":
    "Diseñado alrededor de sistemas end-to-end y práctica moderna de ciencia de datos.",
  "Advanced ML": "ML avanzado",
  "General Certificate": "Certificado general",
  "Deep Learning": "Deep Learning",
  "Show Certification": "Ver certificado",
  "Additional certificates": "Certificados adicionales",
  "Focus areas": "Áreas de enfoque",
  "Hide additional formation": "Ocultar formación adicional",
  "Show additional formation": "Ver formación adicional",
  "Deep Learning Specialization": "Especialización en Deep Learning",
  "Five-course sequence covering neural networks, optimization, ML project strategy, convolutional networks, and sequence models.":
    "Secuencia de cinco cursos sobre redes neuronales, optimización, estrategia ML, CNNs y modelos secuenciales.",
  "Full Specialization": "Especialización completa",
  "Neural Networks and Deep Learning": "Redes neuronales y Deep Learning",
  "Improving Deep Neural Networks": "Mejora de redes neuronales",
  "Structuring Machine Learning Projects": "Estructura de proyectos ML",
  "Convolutional Neural Networks": "Redes convolucionales",
  "Sequence Models": "Modelos secuenciales",
  "Machine Learning Specialization": "Especialización en Machine Learning",
  "Andrew Ng's three-course sequence on supervised learning, advanced learning algorithms, unsupervised learning, recommenders, and reinforcement learning.":
    "Secuencia de Andrew Ng sobre aprendizaje supervisado, algoritmos avanzados, no supervisado, recomendadores y RL.",
  "Supervised Machine Learning": "Machine Learning supervisado",
  "Advanced Learning Algorithms": "Algoritmos avanzados",
  "Unsupervised, Recommenders, Reinforcement Learning": "No supervisado, recomendadores y RL",
  "Applied data and tooling certificates": "Certificados aplicados de datos y herramientas",
  "Focused short-form courses in PyTorch, SQL, NLP, Power BI, data visualization, and machine learning demos.":
    "Cursos cortos en PyTorch, SQL, NLP, Power BI, visualización y demos de machine learning.",
  "SQL and MySQL": "SQL y MySQL",
  "Data Visualization for BI": "Visualización de datos para BI",
  "Machine Learning Demos": "Demos de Machine Learning"
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

Object.assign(translations, {
  Feature: "Destacados",
  "Advanced Deep Learning": "Deep Learning Avanzado",
  MLOps: "MLOps",
  "Machine Learning Applications": "Apps de Machine Learning",
  Results: "Resultados",
  Signals: "Señales",
  Expanded: "Expandido",
  "Open project": "Abrir proyecto",
  Back: "Volver",
  "GitHub Code": "Código GitHub",
  "Hide Results": "Ocultar resultados",
  "Show Results": "Ver resultados",
  "Project categories": "Categorías de proyectos",
  "Click to see full details": "Click para ver detalles",
  "Selected research systems, shipped as working code.":
    "Sistemas de investigación seleccionados, publicados como código funcional.",
  "The portfolio focus here is the full research-to-code surface: modeling decisions, reproducible workflows, evaluation artifacts, and enough engineering structure for the system to be inspected, extended, and rerun.":
    "El foco del portafolio es el ciclo investigación-código: decisiones de modelación, flujos reproducibles, artefactos de evaluación y estructura suficiente para inspeccionar, extender y correr el sistema.",

  "Aging synthesis previews": "Vistas de síntesis de envejecimiento",
  "Two horizontal triptychs showing identity-preserving local and global aging behavior.":
    "Dos trípticos horizontales con envejecimiento local y global preservando identidad.",
  "Three-stage aging strip, sample 1.": "Tira de envejecimiento en tres etapas, muestra 1.",
  "Three-stage aging strip, sample 2.": "Tira de envejecimiento en tres etapas, muestra 2.",
  "Monetary shock diagnostics": "Diagnósticos de choque monetario",
  "Impulse responses, local projection robustness, posterior density, and FEVD views from the structural monetary shock workflow.":
    "IRFs, robustez con proyecciones locales, densidad posterior y FEVD del flujo de choque monetario.",
  "Bayesian structural impulse-response functions.": "Funciones impulso-respuesta bayesianas.",
  "Local projections with HAC inference.": "Proyecciones locales con inferencia HAC.",
  "Forecast error variance decomposition.": "Descomposición de varianza del error.",
  "Posterior parameter density snapshot.": "Densidad posterior de parámetros.",
  "Architecture benchmark outputs": "Resultados de benchmark arquitectónico",
  "Comparison and robustness plots for the OutGridViT architecture experiments.":
    "Gráficas de comparación y robustez de los experimentos OutGridViT.",
  "Model comparison across vision architectures.": "Comparación de arquitecturas de visión.",
  "Training convergence panels.": "Paneles de convergencia de entrenamiento.",
  "TinyImageNet-C corruption robustness.": "Robustez a corrupción en TinyImageNet-C.",
  "Casino-like validation snapshot": "Validación tipo casino",
  "A compact policy comparison under realistic shoe dynamics and partial observability.":
    "Comparación compacta de políticas con zapato realista y observabilidad parcial.",
  "Best checkpoints": "Mejores checkpoints",
  Checkpoint: "Checkpoint",
  "EV / 1000": "EV / 1000",
  "Win rate": "Tasa de victoria",
  "Loss rate": "Tasa de pérdida",
  "Attribute-conditioned samples": "Muestras condicionadas por atributos",
  "Horizontal generation strips from the latent diffusion conditioning workflow.":
    "Tiras horizontales generadas desde el flujo de difusión latente condicionada.",
  "Conditioned sample strip: young man.": "Tira condicionada: hombre joven.",
  "Conditioned sample strip: senior man.": "Tira condicionada: hombre mayor.",
  "Conditioned sample strip: additional attribute setting.": "Tira condicionada: atributo adicional.",
  "CIFAR-100 benchmark snapshot": "Snapshot benchmark CIFAR-100",
  "Best validation epoch observed for each model in the shared comparison arena.":
    "Mejor época de validación por modelo en la arena comparativa.",
  "CIFAR-100 results": "Resultados CIFAR-100",
  Model: "Modelo",
  "Best epoch": "Mejor época",
  "Val loss": "Pérdida val",
  "Segmentation review outputs": "Resultados de segmentación",
  "Prediction strips and overlay error panels from the medical segmentation workflow.":
    "Tiras de predicción y paneles de error del flujo de segmentación médica.",
  "Model prediction strip across slices.": "Tira de predicciones por cortes.",
  "Overlay error inspection panel.": "Panel de inspección de errores.",
  "Targeting diagnostics": "Diagnósticos de focalización",
  "Geographic, modeling, and threshold views for subsidy candidate prediction under severe class imbalance.":
    "Vistas geográficas, de modelación y umbrales para subsidios con fuerte desbalance.",
  "Geographic distribution of subsidy labels.": "Distribución geográfica de etiquetas.",
  "Modeling diagnostic strip 1.": "Tira diagnóstica de modelación 1.",
  "Modeling diagnostic strip 2.": "Tira diagnóstica de modelación 2.",
  "Model results summary": "Resumen de resultados",
  "Model / Strategy": "Modelo / Estrategia",
  Precision: "Precisión",
  Recall: "Recall",
  "Trade-off": "Trade-off",
  "Meets recall target with moderate precision": "Cumple recall con precisión moderada",
  "Very high precision, low recall": "Muy alta precisión, bajo recall",
  "Tourism forecasting interpretability": "Interpretabilidad turística",
  "LIME explanations for principal and smaller destination cities, followed by feature imputation and partial dependence diagnostics.":
    "Explicaciones LIME para ciudades principales y pequeñas, más imputación y dependencia parcial.",
  "LIME explanation for a principal city forecast.": "LIME para una ciudad principal.",
  "LIME explanation for a smaller city forecast.": "LIME para una ciudad pequeña.",
  "Feature imputation and data completeness diagnostics.": "Imputación y completitud de datos.",
  "Partial dependence plots for the forecasting model.": "Dependencia parcial del modelo.",
  "Forecast comparison": "Comparación de pronósticos",
  "Classical ARIMA and neural LSTM prediction panels from the inflation forecasting arena.":
    "Paneles ARIMA clásico y LSTM neural del entorno de pronóstico de inflación.",
  "ARIMA forecast panel.": "Panel de pronóstico ARIMA.",
  "LSTM forecast panel.": "Panel de pronóstico LSTM.",
  "Dynamic Bayesian forecasting diagnostics": "Diagnósticos bayesianos dinámicos",
  "Posterior, lambda trace, and out-of-sample prediction diagnostics from the graphical DLM workflow.":
    "Posteriores, trazas lambda y predicción out-of-sample del flujo DLM gráfico.",
  "Out-of-sample prediction trajectories.": "Trayectorias out-of-sample.",
  "Posterior diagnostic grid.": "Grid de diagnósticos posteriores.",
  "Lambda trace diagnostics.": "Diagnósticos de trazas lambda.",
  "BVAR posterior and shock analysis": "Posteriores BVAR y choques",
  "Posterior densities, impulse responses, and FEVD outputs from the conjugate Bayesian VAR toolkit.":
    "Densidades posteriores, IRFs y FEVD del toolkit VAR bayesiano conjugado.",
  "Impulse-response functions.": "Funciones impulso-respuesta.",
  "Posterior density diagnostics.": "Diagnósticos de densidad posterior.",
  "Bayesian regression diagnostics": "Diagnósticos de regresión bayesiana",
  "Posterior and MCMC diagnostics for the from-scratch Bayesian linear regression sampler.":
    "Diagnósticos posteriores y MCMC del sampler de regresión bayesiana desde cero.",
  "Posterior density comparison.": "Comparación de densidad posterior.",
  "MCMC traces for beta parameters.": "Trazas MCMC para betas.",
  "News intelligence visuals": "Visuales de inteligencia noticiosa",
  "Topic, sentiment, label, and word-cloud outputs for the Colombian news NLP pipeline.":
    "Tópicos, sentimiento, etiquetas y nube de palabras del pipeline NLP de noticias colombianas.",
  "Sentiment time-series view.": "Serie temporal de sentimiento.",
  "Media label distribution graph.": "Distribución de etiquetas por medio.",
  "Word-cloud summary.": "Resumen en nube de palabras.",
  "Sentiment score distribution.": "Distribución de puntajes de sentimiento.",
  "Qualitative style transfer gallery": "Galería cualitativa de style transfer",
  "Three horizontal content-style-output strips paired with the vertical SOTA comparison strip.":
    "Tres tiras contenido-estilo-salida junto a una comparación vertical SOTA.",
  "Horizontal transfer sample 000.": "Muestra horizontal 000.",
  "Horizontal transfer sample 001.": "Muestra horizontal 001.",
  "Horizontal transfer sample 003.": "Muestra horizontal 003.",
  "Vertical SOTA comparison strip.": "Tira vertical comparativa SOTA.",
  "Diffusion sample grid": "Grid de muestras de difusión",
  "A large generated image grid with selected individual samples from the DDPM/DDIM playground.":
    "Grid grande de imágenes generadas con muestras seleccionadas del entorno DDPM/DDIM.",
  "Generated sample grid.": "Grid de muestras generadas.",
  "Selected sample 1.": "Muestra seleccionada 1.",
  "Selected sample 2.": "Muestra seleccionada 2.",
  "Selected sample 3.": "Muestra seleccionada 3.",
  "Selected sample 4.": "Muestra seleccionada 4.",
  "GAN generation snapshots": "Snapshots de generación GAN",
  "Generated samples across simple, CIFAR, and StyleGAN-inspired experiments.":
    "Muestras generadas en experimentos simples, CIFAR e inspirados en StyleGAN.",
  "CIFAR generated samples.": "Muestras CIFAR generadas.",
  "StyleGAN-inspired generated samples.": "Muestras inspiradas en StyleGAN.",
  "MNIST generated samples.": "Muestras MNIST generadas.",
  "Interpretability panels": "Paneles de interpretabilidad",
  "Feature map and Grad-CAM visual explanations from the ResNet interpretability service.":
    "Mapas de características y Grad-CAM del servicio interpretativo ResNet.",
  "Feature map inspection panel.": "Panel de mapas de características.",
  "Grad-CAM explanation panel.": "Panel de explicación Grad-CAM.",

  "AlphaFold2 Research Rebuild": "Reconstrucción investigativa de AlphaFold2",
  "A from-scratch PyTorch reconstruction of AlphaFold2 focused on geometry, Evoformer internals, ablations, and accessible structural deep learning.":
    "Reconstrucción PyTorch de AlphaFold2 desde cero, enfocada en geometría, Evoformer, ablaciones y deep learning estructural accesible.",
  "Rebuilds the AlphaFold2 learning pipeline as a research object: MSA and pair representations, Evoformer blocks, invariant point attention, recycling, structural losses, Foldbench data tooling, and config-driven experiments.":
    "Reconstruye AlphaFold2 como objeto de investigación: MSA, pares, Evoformer, IPA, reciclaje, pérdidas estructurales, Foldbench y experimentos por config.",
  "Evoformer and structure module implemented": "Evoformer y módulo estructural implementados",
  "FAPE, distogram, pLDDT, and torsion losses": "Pérdidas FAPE, distograma, pLDDT y torsión",
  "Ablation-ready training and data inspection CLIs": "CLIs para entrenamiento, ablación e inspección",
  "DeepSeek-V4 Mini Systems Lab": "Lab mini de sistemas DeepSeek-V4",
  "A paper-faithful mini implementation of DeepSeek-V4 mechanisms for transparent experiments in long-context language modeling.":
    "Implementación mini fiel a DeepSeek-V4 para experimentos transparentes en modelado de lenguaje de largo contexto.",
  "Implements the architectural ideas behind DeepSeek-V4 at research scale: hybrid compressed attention, compressed sparse attention, MoE routing, manifold-constrained hyper-connections, multi-token prediction, Muon training, inference caches, ablations, and CI-tested modules.":
    "Implementa ideas de DeepSeek-V4 a escala investigación: atención comprimida, MoE, hiperconexiones, predicción multitoken, Muon, cachés, ablaciones y CI.",
  "HCA and CSA cache-aware inference path": "Inferencia HCA/CSA consciente de caché",
  "Six ablation suites": "Seis suites de ablación",
  "Synthetic retrieval and Hugging Face dataset presets": "Retrieval sintético y presets Hugging Face",
  "Dual-Scale Diffusion Aging": "Envejecimiento por difusión dual",
  "A research pipeline for face aging with global and local latent diffusion branches, identity-aware fusion, and DataOps controls.":
    "Pipeline de envejecimiento facial con difusión global/local, fusión consciente de identidad y controles DataOps.",
  "Studies face aging as both a global semantic edit and a local texture synthesis problem. The system combines full-face aging, region-level aging, deterministic residual fusion, reusable data modules, CLIs, manifests, smoke tests, Docker, and technical documentation.":
    "Estudia envejecimiento facial como edición global y textura local. Integra envejecimiento completo/regional, fusión residual, módulos, CLIs, manifiestos, tests, Docker y docs.",
  "Global and local aging branches": "Ramas de envejecimiento global y local",
  "Residual fusion for identity preservation": "Fusión residual para preservar identidad",
  "Governed preprocessing and inference workflow": "Flujo gobernado de preprocesamiento e inferencia",
  "Bayesian Monetary Shock Lab": "Lab bayesiano de choques monetarios",
  "A Bayesian SBVAR and Local Projections framework for studying U.S. monetary policy spillovers into Colombian macro-financial variables.":
    "Marco SBVAR bayesiano y proyecciones locales para estudiar spillovers de política monetaria de EE. UU. sobre Colombia.",
  "Estimates structural monetary shocks using agnostic identification, posterior filtering, MCMC diagnostics, impulse responses, FEVDs, and Local Projections for robustness across Bayesian and frequentist views of shock transmission.":
    "Estima choques monetarios con identificación agnóstica, filtrado posterior, MCMC, IRFs, FEVD y proyecciones locales para robustez.",
  "Two-chain MCMC diagnostics": "Diagnósticos MCMC de dos cadenas",
  "IRFs and FEVD outputs": "Salidas IRF y FEVD",
  "LP robustness checks for structural dynamics": "Robustez LP para dinámica estructural",
  "OutGridViT Architecture": "Arquitectura OutGridViT",
  "A hybrid vision transformer combining dynamic local aggregation, MBConv inductive bias, and grid attention.":
    "Transformer visual híbrido que combina agregación local dinámica, sesgo MBConv y atención en grilla.",
  "Builds and evaluates an original vision architecture with CIFAR-100 experiments, TinyImageNet-C robustness checks, MAD and entropy diagnostics, convergence curves, and baseline comparisons against DeiT, Swin, MaxViT, and ResNet.":
    "Construye y evalúa una arquitectura visual con CIFAR-100, robustez TinyImageNet-C, MAD, entropía, convergencia y comparación con baselines.",
  "Model comparison tables": "Tablas comparativas de modelos",
  "Robustness experiments": "Experimentos de robustez",
  "Attention and MAD analysis": "Análisis de atención y MAD",
  "Blackjack POMDP Research Environment": "Entorno POMDP de Blackjack",
  "A pure-PyTorch reinforcement learning environment that treats Blackjack as a partially observable sequential decision problem.":
    "Entorno RL en PyTorch puro que trata Blackjack como decisión secuencial parcialmente observable.",
  "Models hidden shoe state, reshuffle dynamics, cut-card behavior, variable observations, explicit betting phases, replay buffers, staged training, distillation, and transparent experiment pipelines without Gym abstractions.":
    "Modela zapato oculto, reshuffle, cut-card, observaciones variables, apuestas, replay buffers, entrenamiento por etapas, destilación y pipelines sin Gym.",
  "Custom environment dynamics": "Dinámicas de entorno propias",
  "Bet-sizing and hidden-state modeling": "Modelación de apuestas y estado oculto",
  "Research-grade training presets": "Presets de entrenamiento investigativo",
  "Attribute-Conditioned Latent Diffusion": "Difusión latente condicionada",
  "A latent diffusion training and sampling stack for attribute-conditioned face generation with CFG and cross-attention.":
    "Stack de entrenamiento y muestreo de difusión latente para rostros condicionados con CFG y cross-attention.",
  "Runs a reproducible data-to-training-to-evaluation workflow with VAE latents, UNet denoising, binary attribute conditioning, classifier-free guidance, EMA, mixed precision, DDIM sampling, and offline FID/KID/IS evaluation.":
    "Ejecuta flujo reproducible datos-entrenamiento-evaluación con VAE, UNet, atributos binarios, CFG, EMA, mixed precision, DDIM y métricas offline.",
  "512px model training path": "Ruta de entrenamiento 512px",
  "54+ epoch sample progress": "Progreso de muestras 54+ épocas",
  "CLI pipeline for data, training, inference, evaluation": "CLI para datos, entrenamiento, inferencia y evaluación",
  "Attention-Guided Style Transfer": "Transferencia de estilo guiada por atención",
  "A feed-forward artistic style transfer system with multi-level attention fusion and moment-aware perceptual losses.":
    "Sistema feed-forward de transferencia artística con fusión por atención multinivel y pérdidas perceptuales por momentos.",
  "Combines a frozen VGG19 encoder, cross-attention over content and style features, AdaIN-inspired decoding, Gram and moment matching, total variation regularization, mixed precision, and SOTA-vs-baseline qualitative comparisons.":
    "Combina VGG19 congelado, cross-attention, decoder tipo AdaIN, Gram/moment matching, TV, mixed precision y comparación SOTA vs baseline.",
  "Cleaner brushwork and color transfer": "Pinceladas y color más limpios",
  "Baseline vs SOTA comparisons": "Comparaciones baseline vs SOTA",
  "High-resolution stylization workflow": "Flujo de estilización en alta resolución",
  "Vision Transformer Comparison Arena": "Arena comparativa de Vision Transformers",
  "A shared benchmark arena for ViT, HierarchicalViT, Swin, MaxViT, and VOLO under consistent training recipes.":
    "Arena benchmark común para ViT, HierarchicalViT, Swin, MaxViT y VOLO con recetas consistentes.",
  "Compares modern transformer families under a common data split, model factory, augmentation presets, evaluation pipeline, Docker setup, and training logs for reproducible architecture analysis.":
    "Compara familias transformer con split común, factoría de modelos, aumentación, evaluación, Docker y logs reproducibles.",
  "VOLO 67.90% Top-1 on CIFAR-100 snapshot": "VOLO 67.90% Top-1 en CIFAR-100",
  "MaxViT 89.92% Top-5": "MaxViT 89.92% Top-5",
  "Shared comparison arena": "Arena comparativa compartida"
});

Object.assign(translations, {
  "Medical Segmentation MLOps Suite": "Suite MLOps de segmentación médica",
  "A production-minded UNet3D segmentation platform with APIs, review tooling, drift checks, and orchestration.":
    "Plataforma UNet3D de segmentación con APIs, revisión, checks de drift y orquestación.",
  "Wraps medical image segmentation in an operational stack: FastAPI inference, Streamlit review console, Dockerized deployment, explicit data contracts, MLflow hooks, monitoring, drift checks, retraining, and rollback decisions.":
    "Envuelve segmentación médica en un stack operacional: FastAPI, Streamlit, Docker, contratos de datos, MLflow, monitoreo, drift, reentrenamiento y rollback.",
  "Local-first MLOps platform": "Plataforma MLOps local-first",
  "API and review console": "API y consola de revisión",
  "Data contracts and drift monitoring": "Contratos de datos y monitoreo de drift",
  "Subsidy Targeting MLOps Pipeline": "Pipeline MLOps para focalización de subsidios",
  "An end-to-end MLOps project for subsidy candidate prediction under severe class imbalance in Colombian household survey data.":
    "Proyecto MLOps end-to-end para predecir candidatos a subsidio con fuerte desbalance en encuestas de hogares.",
  "Combines supervised cascade models, anomaly baselines, threshold optimization, MLflow tracking, DVC pipelines, Kubeflow compilation, FastAPI serving, Docker profiles, and Evidently drift checks.":
    "Combina cascadas supervisadas, anomalías, optimización de umbrales, MLflow, DVC, Kubeflow, FastAPI, Docker y checks Evidently.",
  "Threshold-aware evaluation": "Evaluación sensible a umbrales",
  "FastAPI prediction service": "Servicio predictivo FastAPI",
  "Drift and reproducibility pipeline": "Pipeline de drift y reproducibilidad",
  "Colombia Tourism Forecasting System": "Sistema de pronóstico turístico en Colombia",
  "A high-dimensional forecasting project for international tourist arrivals across Colombian cities.":
    "Proyecto de pronóstico de alta dimensión para llegadas de turistas internacionales a ciudades colombianas.",
  "Builds a panel dataset with remote sensing, macroeconomic, security, infrastructure, climate, event, and expenditure variables, then compares ML regressors and econometric benchmarks with interpretability outputs.":
    "Construye panel con variables satelitales, macro, seguridad, infraestructura, clima, eventos y gasto, comparando ML y econometría con interpretabilidad.",
  "XGBoost near 0.99 R2 snapshot": "XGBoost cerca de 0.99 R2",
  "City-level interpretability": "Interpretabilidad a nivel ciudad",
  "Strategic tourism insights": "Insights turísticos estratégicos",
  "Inflation Forecasting Arena": "Arena de pronóstico de inflación",
  "A research-grade forecasting toolkit comparing ARIMA, volatility models, machine learning, and deep learning.":
    "Toolkit de pronóstico investigativo que compara ARIMA, volatilidad, machine learning y deep learning.",
  "Packages state-level inflation forecasting into a CLI, Streamlit arena, documented HTTP API, data assets, artifacts, and model comparison framework spanning classical econometrics and modern predictive methods.":
    "Empaqueta pronóstico de inflación en CLI, Streamlit, API HTTP, datos, artefactos y comparación entre econometría clásica y métodos modernos.",
  "Unified model arena": "Arena unificada de modelos",
  "Interactive forecasting app": "App interactiva de pronóstico",
  "Classical vs deep learning comparison": "Comparación clásica vs deep learning",
  "Python DSGE Modeling Toolkit": "Toolkit Python para modelos DSGE",
  "A Dynare-style Python toolkit for symbolic DSGE specification, solution, and Bayesian estimation.":
    "Toolkit Python estilo Dynare para especificación simbólica, solución y estimación bayesiana DSGE.",
  "Connects symbolic equations, parameter registries, linearization, Gensys solution, Kalman likelihood, MAP estimation, adaptive Metropolis-Hastings, and impulse-response analysis in composable Python modules.":
    "Conecta ecuaciones simbólicas, parámetros, linearización, Gensys, likelihood Kalman, MAP, Metropolis-Hastings adaptativo e IRFs en módulos Python.",
  "Symbolic-to-linear pipeline": "Pipeline simbólico a lineal",
  "Bayesian estimation primitives": "Primitivas de estimación bayesiana",
  "IRF and MCMC diagnostics": "Diagnósticos IRF y MCMC",
  "Simultaneous Graphical DLM": "DLM gráfico simultáneo",
  "A Bayesian dynamic forecasting workflow for multivariate time series with graphical decouple-recouple structure.":
    "Flujo bayesiano dinámico para series multivariadas con estructura gráfica decouple-recouple.",
  "Implements Simultaneous Graphical DLM ideas with lagged cross-series structure, Minnesota-style priors, decoupled DLM updates, recoupling, variational Bayes, and importance-sampling refinement.":
    "Implementa DLM gráfico simultáneo con rezagos cruzados, priors Minnesota, updates desacoplados, recoupling, Bayes variacional e importance sampling.",
  "Dynamic VAR reconstruction": "Reconstrucción VAR dinámica",
  "Graph-constrained recoupling": "Recoupling restringido por grafo",
  "Notebook and modular code paths": "Notebooks y rutas modulares",
  "Conjugate Bayesian VAR Toolkit": "Toolkit VAR bayesiano conjugado",
  "A Python BVAR implementation with conjugate priors, Minnesota hyperparameters, posterior sampling, IRFs, and FEVD.":
    "Implementación BVAR en Python con priors conjugados, hiperparámetros Minnesota, muestreo posterior, IRFs y FEVD.",
  "Implements a standard Bayesian Vector Autoregression with Normal-Inverse-Wishart priors, Minnesota hyperparameter structure, Monte Carlo posterior draws, impulse response functions, forecast error variance decomposition, diagnostics, tests, and a FastAPI service layer.":
    "Implementa VAR bayesiano estándar con priors NIW, Minnesota, Monte Carlo, IRFs, FEVD, diagnósticos, tests y capa FastAPI.",
  "Conjugate posterior sampling": "Muestreo posterior conjugado",
  "Posterior density and trace diagnostics": "Densidad posterior y trazas",
  "Bayesian Linear Regression Lab": "Lab de regresión lineal bayesiana",
  "A from-scratch Bayesian regression pipeline with Gibbs sampling, non-conjugate priors, diagnostics, and posterior predictive checks.":
    "Pipeline de regresión bayesiana desde cero con Gibbs, priors no conjugados, diagnósticos y checks predictivos.",
  "Builds Bayesian linear regression from first principles: conjugate Normal-Inverse-Gamma updates, Metropolis-Hastings for non-conjugate priors, adaptive covariance, posterior predictive checks, HDI summaries, ArviZ diagnostics, trace plots, ACF, ESS, R-hat, and log-scale variance calibration.":
    "Construye regresión bayesiana desde principios: NIG, Metropolis-Hastings, covarianza adaptativa, checks predictivos, HDI, ArviZ, trazas, ACF, ESS, R-hat y varianza log.",
  "Gibbs and MH sampling paths": "Rutas de muestreo Gibbs y MH",
  "Posterior predictive checks": "Checks predictivos posteriores",
  "ESS, R-hat, trace, and ACF diagnostics": "Diagnósticos ESS, R-hat, trazas y ACF",
  "SME Finance AI Advisor": "Asesor IA financiero para pymes",
  "A finance assistant for Colombian SMEs with local knowledge retrieval, conversational memory, and financial calculators.":
    "Asistente financiero para pymes colombianas con retrieval local, memoria conversacional y calculadoras financieras.",
  "Combines Flask, LangChain, Chroma retrieval, local versioned knowledge, structured prompts, SQLite persistence, quick-reply UI patterns, metrics, Docker deployment, and calculators for liquidity, margins, break-even, and cash flow.":
    "Combina Flask, LangChain, Chroma, conocimiento local versionado, prompts, SQLite, quick replies, métricas, Docker y calculadoras de liquidez, márgenes, equilibrio y caja.",
  "Local semantic retrieval": "Retrieval semántico local",
  "Persistent user preferences": "Preferencias persistentes",
  "Finance calculator routing": "Ruteo a calculadoras financieras",
  "GPT Research Suite": "Suite de investigación GPT",
  "A from-scratch GPT-style language modeling suite with reproducible training, comparison, ablation, and orchestration workflows.":
    "Suite GPT desde cero para modelado de lenguaje con entrenamiento, comparación, ablación y orquestación reproducibles.",
  "Implements GPT-2/GPT-3-style decoder-only models from scratch with RMSNorm, SwiGLU, RoPE, SDPA attention, gradient checkpointing, dataset registries, local corpora support, YAML experiment packaging, research CLIs, plotting, and Airflow orchestration.":
    "Implementa modelos decoder-only tipo GPT-2/3 con RMSNorm, SwiGLU, RoPE, SDPA, checkpointing, registros de datasets, YAML, CLIs, plots y Airflow.",
  "GPT2 and GPT3 model variants": "Variantes GPT2 y GPT3",
  "Train, compare, ablation, and plotting CLIs": "CLIs de entrenamiento, comparación, ablación y plots",
  "OpenWebText, WikiText, TinyStories, C4, Pile, and local dataset loaders":
    "Loaders OpenWebText, WikiText, TinyStories, C4, Pile y datasets locales",
  "YOLOv2 Detection System": "Sistema de detección YOLOv2",
  "A modular PyTorch implementation of YOLOv2 with Darknet-19, VOC training, mAP evaluation, and visualization tools.":
    "Implementación modular PyTorch de YOLOv2 con Darknet-19, entrenamiento VOC, mAP y visualización.",
  "Rebuilds the YOLOv2 object detection pipeline with Darknet-19, anchor boxes, passthrough connections, YOLO loss, decoding, NMS, VOC-style mAP@0.5, mixed-precision training, gradient accumulation, checkpointing, visualization scripts, and unit tests.":
    "Reconstruye YOLOv2 con Darknet-19, anchors, passthrough, loss YOLO, decoding, NMS, mAP@0.5 VOC, mixed precision, checkpoints, visualización y tests.",
  "VOC training and evaluation workflow": "Flujo de entrenamiento y evaluación VOC",
  "YOLOv2 loss, decoding, and NMS utilities": "Loss YOLOv2, decoding y NMS",
  "mAP@0.5 and detection visualization pipeline": "Pipeline mAP@0.5 y visualización",
  "Colombian News Intelligence Map": "Mapa inteligente de noticias colombianas",
  "A Spanish NLP pipeline for scraping, cleaning, and analyzing Colombian news topics, sentiment, and entities.":
    "Pipeline NLP en español para scraping, limpieza y análisis de tópicos, sentimiento y entidades en noticias colombianas.",
  "Transforms fragmented media sources into a structured map of news trends by combining scraping, cleaning, topic analysis, sentiment analysis, named-entity recognition, and API-oriented cleanup.":
    "Convierte medios fragmentados en un mapa estructurado de tendencias combinando scraping, limpieza, tópicos, sentimiento, NER y limpieza para API.",
  "Multi-source Colombian media corpus": "Corpus colombiano multifuente",
  "Topic, sentiment, and entity outputs": "Salidas de tópicos, sentimiento y entidades",
  "Structured trend analysis": "Análisis estructurado de tendencias",
  "DDPM Diffusion Playground": "Playground de difusión DDPM",
  "A PyTorch implementation of DDPM/DDIM image generation with attention and model-capacity experiments.":
    "Implementación PyTorch de generación DDPM/DDIM con atención y experimentos de capacidad.",
  "Reproduces Denoising Diffusion Probabilistic Models and extends the sandbox with DDIM sampling, UNet variants with and without attention, and controlled experiments on sample quality, speed, and capacity.":
    "Reproduce DDPM y extiende el sandbox con DDIM, variantes UNet con/sin atención y experimentos controlados de calidad, velocidad y capacidad.",
  "DDPM and DDIM support": "Soporte DDPM y DDIM",
  "Attention and capacity ablations": "Ablaciones de atención y capacidad",
  "Generation research playground": "Playground de investigación generativa",
  "GAN Objectives and Stabilization Lab": "Lab de objetivos y estabilización GAN",
  "A PyTorch research playground for comparing GAN architectures, losses, datasets, and stabilization tricks.":
    "Playground PyTorch para comparar arquitecturas GAN, pérdidas, datasets y técnicas de estabilización.",
  "Explores MLP GANs, DCGAN, hinge/SNGAN, StyleGAN-inspired components, saturating and non-saturating losses, spectral normalization, R1 regularization, EMA, DiffAugment, and dataset complexity effects.":
    "Explora MLP GANs, DCGAN, hinge/SNGAN, componentes StyleGAN, pérdidas, spectral norm, R1, EMA, DiffAugment y complejidad de datos.",
  "Architecture and loss comparisons": "Comparaciones de arquitectura y pérdidas",
  "Dataset complexity studies": "Estudios de complejidad de datos",
  "Extensible GAN training code": "Código GAN extensible",
  "CNN Architecture Survey from Scratch": "Survey de arquitecturas CNN desde cero",
  "A code-first literature review of influential CNN architectures implemented from scratch in PyTorch.":
    "Revisión code-first de arquitecturas CNN influyentes implementadas desde cero en PyTorch.",
  "Implements classic CNN families without torchvision wrappers, mapping architecture details to original papers across LeNet, AlexNet, VGG, Inception, ResNet, U-Net, MobileNet, and EfficientNet.":
    "Implementa familias CNN clásicas sin torchvision, conectando detalles con papers de LeNet, AlexNet, VGG, Inception, ResNet, U-Net, MobileNet y EfficientNet.",
  "Self-contained architecture modules": "Módulos de arquitectura autocontenidos",
  "Training scripts and tests": "Scripts de entrenamiento y tests",
  "Historical architecture timeline": "Línea histórica de arquitecturas",
  "ResNet Interpretability Service": "Servicio de interpretabilidad ResNet",
  "A full-stack ResNet-101 cat-vs-dog classifier with explainability tools and reproducible configuration.":
    "Clasificador full-stack ResNet-101 gato-perro con explicabilidad y configuración reproducible.",
  "Ships an API and app for binary image classification with occlusion sensitivity, Integrated Gradients, Grad-CAM, feature maps, kernel visualization, modular YAML configs, and evaluation utilities.":
    "Incluye API y app para clasificación binaria con oclusión, Integrated Gradients, Grad-CAM, mapas, kernels, configs YAML y evaluación.",
  "Prediction API and app": "API predictiva y app",
  "Multiple explanation methods": "Múltiples métodos de explicación",
  "Config-driven reproducibility": "Reproducibilidad por configuración",
  "CNN from First Principles": "CNN desde primeros principios",
  "A pure Python and NumPy convolutional network built to expose every forward and backward pass detail.":
    "Red convolucional en Python puro y NumPy para exponer cada detalle forward y backward.",
  "Implements 2D convolution, ReLU, max pooling, flattening, dense softmax, backpropagation, Adam, unit tests, and notebooks for hands-on experimentation without autograd abstractions.":
    "Implementa convolución 2D, ReLU, max pooling, flatten, softmax denso, backprop, Adam, tests y notebooks sin autograd.",
  "Hand-coded neural network components": "Componentes neuronales escritos a mano",
  "Unit-tested math": "Matemática con unit tests",
  "Interactive learning notebooks": "Notebooks interactivos"
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(() => {
    const t = (text: string): string => (language === "es" ? translations[text] || text : text);

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "es" : "en")),
      t
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
