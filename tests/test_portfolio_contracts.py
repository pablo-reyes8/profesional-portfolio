from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def test_contact_email_is_not_exposed_as_static_text() -> None:
    source = "\n".join(path.read_text(encoding="utf-8") for path in SRC.rglob("*") if path.is_file())

    assert "alejoreyes229" not in source
    assert "gmail.com" not in source
    assert "mailto:" not in source


def test_contact_form_still_builds_runtime_mail_target() -> None:
    contact = read("src/components/Contact.tsx")

    assert "getContactTarget" in contact
    assert "decodeSequence" in contact
    assert "window.location.href" in contact


def test_particle_ambient_variants_stay_inside_performance_budget() -> None:
    ambient = read("src/components/AmbientParticleBackground.tsx")

    numeric_lines = [
        line for line in ambient.splitlines() if any(key in line for key in ("density:", "particlesScale:", "alpha:"))
    ]
    values = [float(match) for line in numeric_lines for match in re.findall(r"\b\d+(?:\.\d+)?\b", line)]

    assert max(values) <= 300
    assert "projectsTall" in ambient
    assert "contact" in ambient


def test_experience_history_does_not_remount_particle_variant() -> None:
    experience = read("src/components/Experience.tsx")

    assert 'variant="experience"' in experience
    assert "showPastExperience ? \"experienceLight\"" not in experience
    assert "expandedId ? \"experienceLight\"" not in experience
    assert "See past experience" in read("src/i18n.tsx")


def test_project_cards_toggle_closed_from_expanded_state() -> None:
    projects = read("src/components/Projects.tsx")

    assert "if (expandedId === projectId)" in projects
    assert "closeExpandedProject();" in projects
    assert 'window.matchMedia("(max-width: 760px)")' in projects
    assert "isMobileProjects" in projects
    assert "onClick={(event) => event.stopPropagation()}" in projects


def test_formation_cards_close_on_outside_click_and_scroll_on_mobile() -> None:
    formation = read("src/components/Formation.tsx")
    styles = read("src/styles/hero.css")

    assert "handleSectionClick" in formation
    assert 'target.closest(".formation-card")' in formation
    assert 'className="formation-section" onClick={handleSectionClick}' in formation
    assert ".formation-card.is-expanded" in styles
    assert "overflow-y: auto" in styles
    assert "overscroll-behavior: contain" in styles


def test_spanish_language_toggle_and_footer_copy_are_covered() -> None:
    navbar = read("src/components/Navbar.tsx")
    contact = read("src/components/Contact.tsx")
    i18n = read("src/i18n.tsx")

    assert "toggleLanguage" in navbar
    assert 'className="navbar-language-toggle"' in navbar
    assert 'aria-label={language === "en" ? "Traducir a español" : "Switch to English"}' in navbar
    assert "portfolio-footer" in contact
    assert "Economist & Data Scientist" in contact
    assert "Research, data systems, and machine learning built as professional code." in contact
    assert '"Research, data systems, and machine learning built as professional code.":' in i18n
    assert '"Investigación, sistemas de datos y machine learning como código profesional."' in i18n


def test_mobile_responsive_polish_for_stack_and_formation_is_preserved() -> None:
    styles = read("src/styles/hero.css")

    assert "@media (max-width: 760px)" in styles
    assert ".stack-panel" in styles
    assert "min-height: 548px" in styles
    assert ".skill-bubble:nth-child(18) { left: 82%; top: 86%; }" in styles
    assert "@media (max-width: 620px)" in styles
    assert "max-height: min(78vh, 34rem)" in styles
    assert "scrollbar-width: thin" in styles


def test_github_pages_cv_asset_exists() -> None:
    assert (ROOT / "public/cv/Hoja_de_Vida_Industria.pdf").is_file()


def test_vite_base_is_github_pages_safe() -> None:
    vite_config = read("vite.config.ts")

    assert 'base: "/"' in vite_config
