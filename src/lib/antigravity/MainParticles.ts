import * as THREE from "three";
import type { AntigravityScene } from "./AntigravityScene";
import { createAntigravityPoissonPoints } from "./poissonDisk";
import { ambientSimulationFragmentShader } from "../../shaders/antigravity/ambientSimulationFragment.glsl";
import { renderFragmentShader } from "../../shaders/antigravity/renderFragment.glsl";
import { renderVertexShader } from "../../shaders/antigravity/renderVertex.glsl";
import { simulationFragmentShader } from "../../shaders/antigravity/simulationFragment.glsl";
import { simulationVertexShader } from "../../shaders/antigravity/simulationVertex.glsl";

class ValueNoise {
  private readonly maxVertices = 256;
  private readonly values: number[] = [];

  constructor() {
    for (let i = 0; i < this.maxVertices; i += 1) {
      this.values.push(Math.random());
    }
  }

  getVal(value: number): number {
    const base = Math.floor(value);
    const local = value - base;
    const smooth = local * local * (3 - 2 * local);
    const indexA = base & (this.maxVertices - 1);
    const indexB = (indexA + 1) & (this.maxVertices - 1);
    return this.values[indexA] * (1 - smooth) + this.values[indexB] * smooth;
  }
}

const RING_FOLLOW_LERP = 0.2;
const IDLE_RING_FOLLOW_LERP = 0.035;
const SIMULATION_TIME_SCALE = 0.7;

export class MainParticles {
  readonly scene: AntigravityScene;
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  readonly colorScheme: number;

  mesh!: THREE.Points;
  renderMaterial!: THREE.ShaderMaterial;
  simMaterial!: THREE.ShaderMaterial;

  private simScene!: THREE.Scene;
  private simCamera!: THREE.OrthographicCamera;
  private simQuad!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private rt1!: THREE.WebGLRenderTarget;
  private rt2!: THREE.WebGLRenderTarget;
  private posTex!: THREE.DataTexture;
  private noise = new ValueNoise();
  private pointsData: number[] = [];
  private count = 0;
  private size = 256;
  private length = this.size * this.size;
  private lastTime = 0;
  private everRendered = false;
  private ringPos = new THREE.Vector2(0, 0);
  private cursorPos = new THREE.Vector2(0, 0);
  private particleScale = 1;
  private textureType: THREE.TextureDataType;

  constructor(scene: AntigravityScene) {
    this.scene = scene;
    this.renderer = scene.renderer;
    this.camera = scene.camera;
    this.colorScheme = scene.theme === "dark" ? 0 : 1;
    this.textureType = scene.floatTextureType;
    this.particleScale =
      (this.scene.renderer.domElement.width / this.scene.pixelRatio / 2000) *
      this.scene.particlesScale;

    this.createPoints();
    this.init();
  }

  private createPoints(): void {
    const points = createAntigravityPoissonPoints(this.scene.density);
    this.pointsData = [];

    for (let i = 0; i < points.length && i < this.length; i += 1) {
      if (this.scene.mode === "ambient") {
        const rawX = points[i][0] / 500;
        const rawY = points[i][1] / 500;
        const isProjectLayout =
          this.scene.ambientLayout === "project-ribbons" ||
          this.scene.ambientLayout === "project-tall-ribbons";
        const isTallProjectLayout = this.scene.ambientLayout === "project-tall-ribbons";
        const nx = (rawX - 0.5) * (isProjectLayout ? 1.36 : 1.15);
        const ribbon =
          Math.sin(rawX * 7.0 + rawY * 2.4) * 0.075 +
          Math.cos(rawX * 3.1 - rawY * 5.4) * 0.035;
        const ny =
          isProjectLayout
            ? (rawY - 0.5) * (isTallProjectLayout ? 1.18 : 0.66) + ribbon
            : (rawY - 0.5) * 0.72;
        this.pointsData.push(nx * 250, ny * 250);
      } else {
        this.pointsData.push(points[i][0] - 250, points[i][1] - 250);
      }
    }

    this.count = this.pointsData.length / 2;
  }

  private createDataTexturePosition(): THREE.DataTexture {
    const data = new Float32Array(this.length * 4);

    for (let i = 0; i < this.count; i += 1) {
      const offset = i * 4;
      data[offset] = this.pointsData[i * 2] * (1 / 250);
      data[offset + 1] = this.pointsData[i * 2 + 1] * (1 / 250);
      data[offset + 2] = 0;
      data[offset + 3] = 0;
    }

    const texture = new THREE.DataTexture(
      data,
      this.size,
      this.size,
      THREE.RGBAFormat,
      this.textureType
    );
    texture.needsUpdate = true;
    return texture;
  }

  private createRenderTarget(): THREE.WebGLRenderTarget {
    return new THREE.WebGLRenderTarget(this.size, this.size, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: this.textureType,
      depthBuffer: false,
      stencilBuffer: false
    });
  }

  private init(): void {
    this.posTex = this.createDataTexturePosition();
    this.rt1 = this.createRenderTarget();
    this.rt2 = this.createRenderTarget();

    this.renderer.setRenderTarget(this.rt1);
    this.renderer.setClearColor(0, 0);
    this.renderer.clear();
    this.renderer.setRenderTarget(this.rt2);
    this.renderer.setClearColor(0, 0);
    this.renderer.clear();
    this.renderer.setRenderTarget(null);

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex },
        uPosRefs: { value: this.posTex },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRingRadius: { value: 0.2 },
        uDeltaTime: { value: 0 },
        uRingWidth: { value: 0.05 },
        uRingWidth2: { value: 0.015 },
        uRingDisplacement: { value: this.scene.ringDisplacement },
        uMotionStrength: { value: this.scene.mode === "ambient" ? 1 : 0 },
        uTime: { value: 0 }
      },
      vertexShader: simulationVertexShader,
      fragmentShader:
        this.scene.mode === "ambient"
          ? ambientSimulationFragmentShader(this.size, this.scene.ambientLayout)
          : simulationFragmentShader(this.size)
    });
    this.simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
    this.simScene.add(this.simQuad);

    const geometry = new THREE.BufferGeometry();
    const uvs = new Float32Array(this.count * 2);
    const positions = new Float32Array(this.count * 3);
    const seeds = new Float32Array(this.count * 4);

    for (let i = 0; i < this.count; i += 1) {
      const column = i % this.size;
      const row = Math.floor(i / this.size);
      uvs[i * 2] = column / this.size;
      uvs[i * 2 + 1] = row / this.size;
      seeds[i * 4] = Math.random();
      seeds[i * 4 + 1] = Math.random();
      seeds[i * 4 + 2] = Math.random();
      seeds[i * 4 + 3] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute("seeds", new THREE.BufferAttribute(seeds, 4));

    this.renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(this.scene.colorControls.color1) },
        uColor2: { value: new THREE.Color(this.scene.colorControls.color2) },
        uColor3: { value: new THREE.Color(this.scene.colorControls.color3) },
        uAlpha: { value: this.scene.alpha },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRez: {
          value: new THREE.Vector2(
            this.scene.renderer.domElement.width,
            this.scene.renderer.domElement.height
          )
        },
        uParticleScale: { value: this.particleScale },
        uPixelRatio: { value: this.scene.pixelRatio },
        uColorScheme: { value: this.colorScheme }
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    this.mesh = new THREE.Points(geometry, this.renderMaterial);
    this.mesh.position.set(0, 0, 0);
    this.mesh.scale.set(5, -5, 5);
    this.scene.scene.add(this.mesh);
  }

  resize(): void {
    this.renderMaterial.uniforms.uRez.value.set(
      this.scene.renderer.domElement.width,
      this.scene.renderer.domElement.height
    );
    this.renderMaterial.uniforms.uPixelRatio.value = this.scene.pixelRatio;
    this.renderMaterial.needsUpdate = true;
  }

  update(): void {
    const elapsed = this.scene.clock.getElapsedTime();
    const simulationTime = elapsed * SIMULATION_TIME_SCALE;
    const deltaTime = elapsed - this.lastTime;
    this.lastTime = elapsed;

    const noiseX = (this.noise.getVal(this.scene.time * 0.42 + 94.234) - 0.5) * 2;
    const noiseY = (this.noise.getVal(this.scene.time * 0.48 + 21.028) - 0.5) * 2;

    if (this.scene.mode === "ambient") {
      this.ringPos.set(0, 0);
    } else if (this.scene.isIntersecting) {
      this.cursorPos.set(
        this.scene.intersectionPoint.x * 0.175 + noiseX * 0.1,
        this.scene.intersectionPoint.y * 0.175 + noiseY * 0.1
      );
      this.ringPos.set(
        this.ringPos.x + (this.cursorPos.x - this.ringPos.x) * RING_FOLLOW_LERP,
        this.ringPos.y + (this.cursorPos.y - this.ringPos.y) * RING_FOLLOW_LERP
      );
    } else {
      this.cursorPos.set(noiseX * 0.2, noiseY * 0.1);
      this.ringPos.set(
        this.ringPos.x + (this.cursorPos.x - this.ringPos.x) * IDLE_RING_FOLLOW_LERP,
        this.ringPos.y + (this.cursorPos.y - this.ringPos.y) * IDLE_RING_FOLLOW_LERP
      );
    }

    this.particleScale =
      (this.scene.renderer.domElement.width / this.scene.pixelRatio / 2000) *
      this.scene.particlesScale;

    this.simMaterial.uniforms.uPosition.value = this.everRendered ? this.rt1.texture : this.posTex;
    this.simMaterial.uniforms.uTime.value = simulationTime;
    this.simMaterial.uniforms.uDeltaTime.value = deltaTime;
    if (this.scene.mode === "hero") {
      this.simMaterial.uniforms.uRingRadius.value =
        0.175 + Math.sin(this.scene.time * 0.72) * 0.03 + Math.cos(this.scene.time * 2.1) * 0.02;
      this.simMaterial.uniforms.uRingPos.value = this.ringPos;
      this.simMaterial.uniforms.uRingWidth.value = this.scene.ringWidth;
      this.simMaterial.uniforms.uRingWidth2.value = this.scene.ringWidth2;
      this.simMaterial.uniforms.uRingDisplacement.value = this.scene.ringDisplacement;
    }

    this.renderer.setRenderTarget(this.rt2);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);

    this.renderMaterial.uniforms.uPosition.value = this.everRendered ? this.rt2.texture : this.posTex;
    this.renderMaterial.uniforms.uTime.value = simulationTime;
    this.renderMaterial.uniforms.uRingPos.value = this.ringPos;
    this.renderMaterial.uniforms.uParticleScale.value = this.particleScale;
  }

  postRender(): void {
    const target = this.rt1;
    this.rt1 = this.rt2;
    this.rt2 = target;
    this.everRendered = true;
  }

  kill(): void {
    this.scene.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.renderMaterial.dispose();
    this.simScene.remove(this.simQuad);
    this.simQuad.geometry.dispose();
    this.simMaterial.dispose();
    this.rt1.dispose();
    this.rt2.dispose();
    this.posTex.dispose();
  }
}
