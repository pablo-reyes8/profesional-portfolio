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


def test_github_pages_cv_asset_exists() -> None:
    assert (ROOT / "public/cv/Hoja_de_Vida_Industria.pdf").is_file()


def test_vite_base_is_github_pages_safe() -> None:
    vite_config = read("vite.config.ts")

    assert 'base: "/"' in vite_config
