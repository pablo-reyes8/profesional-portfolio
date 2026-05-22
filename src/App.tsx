import { useEffect } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
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
      document.body.classList.add("is-section-scrolling");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <Contact />
      </main>
    </>
  );
}

export default App;
