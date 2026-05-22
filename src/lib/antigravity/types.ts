export interface AntigravitySceneOptions {
  container: HTMLElement;
  theme?: "light" | "dark";
  mode?: "hero" | "ambient";
  ambientLayout?: "field" | "project-ribbons" | "project-tall-ribbons";
  particlesScale?: number;
  density?: number;
  alpha?: number;
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

export type PoissonPointTuple = [number, number];
