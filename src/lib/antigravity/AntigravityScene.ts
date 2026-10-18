import * as THREE from "three";
import { cursorTracker } from "./cursor";
import { MainParticles } from "./MainParticles";
import type { AntigravityColorControls, AntigravitySceneOptions } from "./types";

export class AntigravityScene {
  readonly options: AntigravitySceneOptions;
  readonly container: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly clock: THREE.Clock;
  readonly raycaster: THREE.Raycaster;
  readonly mouse: THREE.Vector2;
  readonly intersectionPoint: THREE.Vector3;
  readonly raycastPlane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  readonly colorControls: AntigravityColorControls;
  readonly theme: "light" | "dark";
  readonly interactive: boolean;
  readonly pixelRatio: number;
  readonly particlesScale: number;
  readonly density: number;
  readonly mode: "hero" | "ambient";
  readonly ambientLayout:
    | "field"
    | "project-ribbons"
    | "project-tall-ribbons"
    | "contact-field"
    | "experience-stream"
    | "formation-bands";
  readonly alpha: number;
  readonly colorFloor: number;
  readonly floatTextureType: THREE.TextureDataType;

  ringWidth: number;
  ringWidth2: number;
  ringDisplacement: number;
  particles!: MainParticles;
  loaded = false;
  isPaused = false;
  isIntersecting = false;
  mouseIsOver = false;
  time = 0;
  lastTime = 0;
  dt = 0;

  private readonly onWindowResize = (): void => {
    this.resize();
  };

  resize(): void {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    if (!width || !height) {
      return;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.camera.aspect = this.canvas.width / this.canvas.height;
    this.camera.updateProjectionMatrix();
    this.particles?.resize();
  }

  constructor(options: AntigravitySceneOptions) {
    this.options = options;
    this.container = options.container;
    this.theme = options.theme || "light";
    this.interactive = options.interactive || false;
    this.mode = options.mode || "hero";
    this.ambientLayout = options.ambientLayout || "field";
    this.pixelRatio = Math.min(options.pixelRatio || window.devicePixelRatio || 1, 2);
    this.particlesScale = options.particlesScale || 0.75;
    this.density = options.density || 200;
    this.alpha = options.alpha ?? 1;
    this.colorFloor = options.colorFloor ?? 0;
    this.ringWidth = options.ringWidth || 0.107;
    this.ringWidth2 = options.ringWidth2 || 0.05;
    this.ringDisplacement = options.ringDisplacement || 0.15;

    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.canvas.setAttribute("aria-hidden", "true");
    this.container.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      precision: "highp"
    });
    const floatExtension = this.renderer.extensions.get("EXT_color_buffer_float");
    this.floatTextureType =
      this.renderer.capabilities.isWebGL2 || floatExtension ? THREE.FloatType : THREE.HalfFloatType;
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setClearAlpha(0);

    this.camera = new THREE.PerspectiveCamera(
      40,
      this.renderer.domElement.width / this.renderer.domElement.height,
      0.1,
      1000
    );
    this.camera.position.z = 3.1;

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersectionPoint = new THREE.Vector3();
    this.raycastPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 12.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false, side: THREE.DoubleSide })
    );
    if (this.interactive) {
      this.scene.add(this.raycastPlane);
    }

    const defaultColors = {
      color1: this.theme === "dark" ? "#7189ff" : "#2c64ed",
      color2: this.theme === "dark" ? "#3074f9" : "#f84242",
      color3: this.theme === "dark" ? "#000000" : "#ffcf03"
    };
    this.colorControls = { ...defaultColors, ...options.colors };

    this.initParticles();
    this.initEvents();
    this.onLoaded();
  }

  private initEvents(): void {
    window.addEventListener("resize", this.onWindowResize);
  }

  private initParticles(): void {
    this.particles = new MainParticles(this);
  }

  /**
   * A click pulls nearby particles into a shape around the pointer for a moment.
   * Position is in simulation units; `amount` eases in, holds, then releases.
   */
  readonly click = {
    x: 0,
    y: 0,
    start: -100,
    /** Which shape to form (see the ambient shader), chosen by the section and how crowded the spot is. */
    variant: 0,
    scale: 1,
    amount(now: number): number {
      const age = now - this.start;
      if (age < 0 || age > 3.2) {
        return 0;
      }
      const rise = Math.min(1, age / 0.45);
      const fall = age < 1.9 ? 1 : Math.max(0, 1 - (age - 1.9) / 1.3);
      const eased = rise * rise * (3 - 2 * rise);
      return eased * fall * fall * (3 - 2 * fall);
    }
  };

  /**
   * Points of interest on the page, in simulation units: x, y and a free value (z).
   * The Experience background grows a node and a branch at each role.
   */
  anchors: THREE.Vector3[] = [];

  private unitsPerPx(): number {
    return (2 * Math.tan((20 * Math.PI) / 180) * 3.1) / 5 / (this.container.offsetHeight || 1);
  }

  /** Convert CSS pixels relative to the canvas into simulation units. */
  toUnits(x: number, y: number): THREE.Vector2 {
    const unitsPerPx = this.unitsPerPx();
    return new THREE.Vector2(
      (x - (this.container.offsetWidth || 1) / 2) * unitsPerPx,
      (y - (this.container.offsetHeight || 1) / 2) * unitsPerPx
    );
  }

  /** Pull particles toward a point given in CSS pixels relative to the canvas. */
  triggerClick(x: number, y: number, variant = 0, scale = 1): void {
    const point = this.toUnits(x, y);
    this.click.x = point.x;
    this.click.y = point.y;
    this.click.variant = variant;
    this.click.scale = scale;
    this.click.start = this.elapsed();
  }

  /** Anchors in CSS pixels relative to the canvas; z is passed through untouched. */
  setAnchors(points: { x: number; y: number; z: number }[]): void {
    this.anchors = points.map((point) => {
      const units = this.toUnits(point.x, point.y);
      return new THREE.Vector3(units.x, units.y, point.z * this.unitsPerPx());
    });
  }

  private accumulatedTime = 0;
  private lastNow = performance.now();

  /**
   * Seconds of running time. Unlike THREE.Clock it does not reset when the scene is paused
   * off-screen, so continuous motions (orbits, currents) resume where they left off.
   */
  elapsed(): number {
    const now = performance.now();
    if (!this.isPaused) {
      this.accumulatedTime += Math.min(0.1, (now - this.lastNow) / 1000);
    }
    this.lastNow = now;
    return this.accumulatedTime;
  }

  stop(): void {
    this.elapsed();
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
    this.lastNow = performance.now();
  }

  killParticles(): void {
    this.particles.kill();
  }

  kill(): void {
    this.stop();
    window.removeEventListener("resize", this.onWindowResize);
    this.killParticles();
    this.scene.remove(this.raycastPlane);
    this.raycastPlane.geometry.dispose();
    this.raycastPlane.material.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }

  onLoaded(): void {
    this.loaded = true;
  }

  preRender(): void {
    const elapsed = this.elapsed();
    this.dt = elapsed - this.lastTime;
    this.lastTime = elapsed;
    this.time += this.dt;
    this.particles.update();

    if (this.interactive) {
      const rect = this.canvas.getBoundingClientRect();

      this.mouse.x = (cursorTracker.cursor.x - rect.left) * (cursorTracker.screenWidth / rect.width);
      this.mouse.y = (cursorTracker.cursor.y - rect.top) * (cursorTracker.screenHeight / rect.height);
      this.mouse.x = (this.mouse.x / cursorTracker.screenWidth) * 2 - 1;
      this.mouse.y = -(this.mouse.y / cursorTracker.screenHeight) * 2 + 1;
      this.mouseIsOver =
        this.mouse.x >= -1 &&
        this.mouse.x <= 1 &&
        this.mouse.y >= -1 &&
        this.mouse.y <= 1;
    }

    if (!this.interactive) {
      this.isIntersecting = false;
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObject(this.raycastPlane);

    if (hits.length > 0 && this.mouseIsOver) {
      this.intersectionPoint.copy(hits[0].point);
      this.isIntersecting = true;
    } else {
      this.isIntersecting = false;
    }
  }

  render(): void {
    if (!this.loaded || this.isPaused) {
      return;
    }

    this.preRender();
    this.renderer.setRenderTarget(null);
    this.renderer.autoClear = false;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.postRender();
  }

  postRender(): void {
    this.particles.postRender();
  }
}
