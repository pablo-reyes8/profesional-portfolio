import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import AmbientParticleBackground from "./AmbientParticleBackground";
import { useLanguage } from "../i18n";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

type Status = "idle" | "sending" | "success" | "error";

const CONTACT_TARGET = [109, 97, 105, 108, 116, 111, 58, 97, 108, 101, 106, 111, 114, 101, 121, 101, 115, 50, 50, 57, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];

function decodeSequence(sequence: number[]): string {
  return String.fromCharCode(...sequence);
}

function getContactTarget(name: string, email: string, message: string): string {
  const params = new URLSearchParams({
    subject: `Portfolio contact from ${name}`,
    body: `${message}\n\nReply to: ${email}`,
  });

  return `${decodeSequence(CONTACT_TARGET)}?${params.toString()}`;
}

function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setStatus("sending");

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      window.location.href = getContactTarget(name, email, message);
      setStatus("idle");
      return;
    }

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: name, from_email: email, message },
        { publicKey: PUBLIC_KEY }
      )
      .then(() => {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch(() => {
        setStatus("error");
      });
  };

  const isSending = status === "sending";

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
                disabled={isSending}
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
                disabled={isSending}
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
                disabled={isSending}
              />
            </label>

            {status === "success" && (
              <p className="contact-status contact-status--success">
                {t("Message sent!")}
              </p>
            )}

            {status === "error" && (
              <p className="contact-status contact-status--error">
                {t("Failed to send. Try again.")}
              </p>
            )}

            <button type="submit" disabled={isSending}>
              {isSending ? t("Sending…") : t("Send Message")}
            </button>
          </form>
        </div>

      </div>

      <footer className="portfolio-footer" aria-label={t("Portfolio footer")}>
        <div className="portfolio-footer-inner">
          <div className="portfolio-footer-identity">
            <strong>Pablo Reyes</strong>
            <span>{t("Economist & Data Scientist")}</span>
          </div>

          <p>{t("Research, data systems, and machine learning built as professional code.")}</p>

          <nav aria-label={t("Footer links")}>
            <a href="https://github.com/pablo-reyes8" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/pablo-alejandro-reyes-granados/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="/cv/Hoja_de_Vida_Industria.pdf" target="_blank" rel="noreferrer">
              CV
            </a>
          </nav>
        </div>
      </footer>
    </section>
  );
}

export default Contact;
