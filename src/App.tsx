import { useEffect } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Formation from "./components/Formation";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";

function App() {
  useEffect(() => {
    let smoothScrollTarget = window.scrollY;
    let smoothScrollFrame = 0;

    const isScrollableElement = (element: Element | null): boolean => {
      let current = element;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const canScroll = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;
        if (canScroll) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };

    const animateSmoothScroll = (): void => {
      const distance = smoothScrollTarget - window.scrollY;
      if (Math.abs(distance) < 0.6) {
        window.scrollTo(0, smoothScrollTarget);
        smoothScrollFrame = 0;
        return;
      }

      window.scrollTo(0, window.scrollY + distance * 0.085);
      smoothScrollFrame = window.requestAnimationFrame(animateSmoothScroll);
    };

    const handleWheel = (event: WheelEvent): void => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (
        prefersReducedMotion ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        isScrollableElement(event.target as Element | null)
      ) {
        return;
      }

      event.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      smoothScrollTarget = Math.max(0, Math.min(maxScroll, smoothScrollTarget + event.deltaY));

      if (!smoothScrollFrame) {
        smoothScrollFrame = window.requestAnimationFrame(animateSmoothScroll);
      }
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
      smoothScrollTarget = Math.max(0, targetTop);

      document.body.classList.add("is-section-scrolling");
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });
      window.history.pushState(null, "", hash);
      window.setTimeout(() => {
        document.body.classList.remove("is-section-scrolling");
      }, 760);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("wheel", handleWheel);
      if (smoothScrollFrame) {
        window.cancelAnimationFrame(smoothScrollFrame);
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Formation />
        <Contact />
      </main>
    </>
  );
}

export default App;
