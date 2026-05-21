import About from "./components/About";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <section id="projects" className="placeholder-section">
          <p>Projects</p>
        </section>
        <section id="experience" className="placeholder-section">
          <p>Experience</p>
        </section>
        <section id="contact" className="placeholder-section">
          <p>Contact</p>
        </section>
      </main>
    </>
  );
}

export default App;
