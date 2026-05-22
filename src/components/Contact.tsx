import { useState, type FormEvent } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";

const contactEmail = "alejoreyes229@gmail.com";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const subject = encodeURIComponent(`Portfolio contact from ${name || "Visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message
      ].join("\n")
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="contact-section">
      <AmbientParticleBackground className="contact-particles" variant="contact" />
      <div className="contact-container">
        <p className="section-eyebrow contact-eyebrow">Contact</p>

        <div className="contact-grid">
          <div className="contact-copy">
            <h2>
              Interested in a data-driven solution for a complex research or
              quantitative problem?
            </h2>
            <p>
              Send me a short note about the question, system, or research workflow
              you have in mind.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Message</span>
              <textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                required
              />
            </label>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
