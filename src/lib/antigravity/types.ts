export interface AntigravitySceneOptions {
  container: HTMLElement;
  theme?: "light" | "dark";
  mode?: "hero" | "ambient";
  ambientLayout?:
    | "field"
    | "project-ribbons"
    | "project-tall-ribbons"
    | "contact-field"
    | "experience-stream"
    | "formation-bands";
  particlesScale?: number;
  density?: number;
  alpha?: number;
  colorFloor?: number;
  colors?: AntigravityColorOverrides;
  interactive?: boolean;
  gui?: boolean;
  verbose?: boolean;
  ringWidth?: number;
  ringWidth2?: number;
  ringDisplacement?: number;
  pixelRatio?: number;
}

export interface AntigravityColorControls {
  color1: string;
  color2: string;
  color3: string;
}

export type AntigravityColorOverrides = Partial<AntigravityColorControls>;

export type PoissonPointTuple = [number, number];
