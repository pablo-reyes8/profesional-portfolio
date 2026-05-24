import { useEffect, useRef } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Formation from "./components/Formation";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import { LanguageProvider } from "./i18n";

function App() {
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups: Array<() => void> = [];

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

    const getContentScrollTop = (element: HTMLElement): number => {
      if (!content) {
        return element.getBoundingClientRect().top + window.scrollY;
      }

      return element.getBoundingClientRect().top - content.getBoundingClientRect().top;
    };

    if (!content || reduceMotionQuery.matches) {
      document.body.style.removeProperty("height");
      content?.style.removeProperty("transform");
      content?.classList.remove("smooth-scroll-content");
    } else {
      let renderedScroll = window.scrollY;
      let animationFrame = 0;

      const setBodyHeight = (): void => {
        document.body.style.height = `${content.scrollHeight}px`;
      };

      const renderSmoothScroll = (): void => {
        const targetScroll = window.scrollY;
        const distance = targetScroll - renderedScroll;

        renderedScroll += distance * 0.095;

        if (Math.abs(distance) < 0.08) {
          renderedScroll = targetScroll;
        }

        content.style.transform = `translate3d(0, ${-renderedScroll}px, 0)`;
        animationFrame = window.requestAnimationFrame(renderSmoothScroll);
      };

      content.classList.add("smooth-scroll-content");
      setBodyHeight();
      animationFrame = window.requestAnimationFrame(renderSmoothScroll);

      const resizeObserver = new ResizeObserver(setBodyHeight);
      resizeObserver.observe(content);
      window.addEventListener("resize", setBodyHeight);

      const handleMotionPreferenceChange = (): void => {
        window.location.reload();
      };

      reduceMotionQuery.addEventListener("change", handleMotionPreferenceChange);
      cleanups.push(() => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        window.removeEventListener("resize", setBodyHeight);
        reduceMotionQuery.removeEventListener("change", handleMotionPreferenceChange);
        document.body.style.removeProperty("height");
        content.style.removeProperty("transform");
        content.classList.remove("smooth-scroll-content");
      });
    }

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
          : getContentScrollTop(scrollTarget) - navbarHeight - 28;

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
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <LanguageProvider>
      <Navbar />
      <main ref={contentRef}>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Formation />
        <Contact />
      </main>
    </LanguageProvider>
  );
}

export default App;
