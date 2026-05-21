function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar-brand" href="#top" aria-label="Pablo Reyes home">
        Pablo Reyes
      </a>
      <nav className="navbar-links" aria-label="Primary navigation">
        <a href="#projects">Research</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default Navbar;
