function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar-brand" href="#top" aria-label="Pablo Reyes home">
        Pablo Reyes
      </a>

      <nav className="navbar-links" aria-label="Main navigation">
        <a href="#about">About Me</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#formation">Formation</a>
        <a href="#contact">Contact</a>
        <a href="/cv/Hoja_de_Vida_Industria.pdf" target="_blank" rel="noreferrer">
          CV
        </a>
      </nav>

      <nav className="navbar-socials" aria-label="External links">
        <a
          className="navbar-social-link"
          href="https://github.com/pablo-reyes8"
          target="_blank"
          rel="noreferrer"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="navbar-social-icon">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.58 2 12.24c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.98c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.05 10.05 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"
            />
          </svg>
          <span>GitHub</span>
        </a>
        <a
          className="navbar-social-link"
          href="https://www.linkedin.com/in/pablo-alejandro-reyes-granados/"
          target="_blank"
          rel="noreferrer"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="navbar-social-icon">
            <path
              fill="currentColor"
              d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.35 8.1h4.3V23H.35V8.1ZM8.2 8.1h4.12v2.04h.06c.57-1.08 1.98-2.22 4.08-2.22 4.36 0 5.16 2.87 5.16 6.6V23h-4.3v-7.52c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V23H8.2V8.1Z"
            />
          </svg>
          <span>LinkedIn</span>
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
