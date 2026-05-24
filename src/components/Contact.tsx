import { useState, type FormEvent } from "react";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

const encodedRecipient = [
  108, 120, 114, 120, 126, 130, 118, 132, 113, 128, 64, 65, 73, 81, 114, 121, 110, 119, 123, 62,
  116, 122, 121
];
const encodedMailProtocol = [118, 107, 116, 120, 129, 120, 68];

function decodeSequence(values: number[], offsetBase: number, offsetCycle: number): string {
  return values
    .map((value, index) => String.fromCharCode(value - (index % offsetCycle) - offsetBase))
    .join("");
}

function getContactTarget(): string {
  return [
    decodeSequence(encodedMailProtocol, 9, 5),
    decodeSequence(encodedRecipient, 11, 7)
  ].join("");
}

function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const subject = encodeURIComponent(`${t("Portfolio contact from")} ${name || t("Visitor")}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message
      ].join("\n")
    );

    window.location.href = `${getContactTarget()}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="contact-section">
      <AmbientParticleBackground className="contact-particles" variant="contact" />
      <div className="contact-container">
        <p className="section-eyebrow contact-eyebrow">{t("Contact")}</p>

        <div className="contact-grid">
          <div className="contact-copy">
            <h2>
              {t("Interested in a data-driven solution for a complex research or quantitative problem?")}
            </h2>
            <p>
              {t("Send me a short note about the question, system, or research workflow you have in mind.")}
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              <span>{t("Name")}</span>
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
              <span>{t("Email")}</span>
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
              <span>{t("Message")}</span>
              <textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                required
              />
            </label>

            <button type="submit">{t("Send Message")}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
