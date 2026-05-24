import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Formation from "./components/Formation";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import { LanguageProvider } from "./i18n";

function App() {
  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clampScrollTarget = (target: number): number => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(maxScroll, target));
    };

    const scrollToPageTarget = (targetTop: number): void => {
      window.scrollTo({
        top: clampScrollTarget(targetTop),
        behavior: reduceMotionQuery.matches ? "auto" : "smooth"
      });
    };

    const handleClick = (event: MouseEvent): void => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!link) {
        return;
      }

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      const navbarHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")
      ) || 64;
      const sectionContent = target.querySelector<HTMLElement>(
        ".about-container, .projects-container, .experience-container, .formation-container, .contact-container"
      );
      const scrollTarget = sectionContent || target;
      const targetTop =
        hash === "#top"
          ? 0
          : scrollTarget.getBoundingClientRect().top + window.scrollY - navbarHeight - 28;

      document.body.classList.add("is-section-scrolling");
      scrollToPageTarget(targetTop);
      window.history.pushState(null, "", hash);
      window.setTimeout(() => {
        document.body.classList.remove("is-section-scrolling");
      }, 760);
    };

    const handleSmoothScrollRequest = (event: Event): void => {
      const { top } = (event as CustomEvent<{ top?: number }>).detail || {};

      if (typeof top !== "number") {
        return;
      }

      document.body.classList.add("is-section-scrolling");
      scrollToPageTarget(top);
      window.setTimeout(() => {
        document.body.classList.remove("is-section-scrolling");
      }, 760);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("portfolio:smooth-scroll-to", handleSmoothScrollRequest);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("portfolio:smooth-scroll-to", handleSmoothScrollRequest);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));

    sections.forEach((section, index) => {
      section.classList.add("section-transition");
      section.style.setProperty("--section-index", String(index));
    });

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            section.classList.add("is-in-view");
            section.classList.toggle("is-section-active", entry.intersectionRatio > 0.42);
          } else {
            section.classList.remove("is-in-view");
            section.classList.remove("is-section-active");
          }
        });
      },
      {
        root: null,
        rootMargin: "-16% 0px -20%",
        threshold: [0.12, 0.42, 0.72]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove("section-transition", "is-in-view", "is-section-active");
        section.style.removeProperty("--section-index");
      });
    };
  }, []);

  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Formation />
        <Contact />
      </main>
      <Analytics />
    </LanguageProvider>
  );
}

export default App;
