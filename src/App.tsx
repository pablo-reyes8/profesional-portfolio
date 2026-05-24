import { useEffect } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";

function App() {
  useEffect(() => {
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
        ".about-container, .projects-container, .experience-container, .contact-container"
      );
      const scrollTarget = sectionContent || target;
      const targetTop =
        hash === "#top"
          ? 0
          : scrollTarget.getBoundingClientRect().top + window.scrollY - navbarHeight - 28;

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
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}

export default App;
