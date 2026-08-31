"use client";

// Adapted from the official React Bits ASCII Text component:
// https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/TextAnimations/ASCIIText

import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

const WAVE_AMPLITUDE_X = 0.5;
const WAVE_AMPLITUDE_Y = 0.25;
const WAVE_AMPLITUDE_Z = 1;
const ASCII_FONT_FAMILY = '"IBM Plex Mono", monospace';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
  vUv = uv;
  float time = uTime * 5.0;
  float waveFactor = uEnableWaves;

  vec3 transformed = position;
  transformed.x += sin(time + position.y) * ${WAVE_AMPLITUDE_X.toFixed(2)} * waveFactor;
  transformed.y += cos(time + position.z) * ${WAVE_AMPLITUDE_Y.toFixed(2)} * waveFactor;
  transformed.z += sin(time + position.x) * ${WAVE_AMPLITUDE_Z.toFixed(2)} * waveFactor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;
  vec2 pos = vUv;

  float move = sin(time + mouse) * 0.01;
  float r = texture2D(uTexture, pos + cos(time * 2.0 - time + pos.x) * 0.01).r;
  float g = texture2D(uTexture, pos + tan(time * 0.5 + pos.x - time) * 0.01).g;
  float b = texture2D(uTexture, pos - cos(time * 2.0 + time + pos.y) * 0.01).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}
`;

const DEFAULT_CHARSET =
  " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

interface AsciiFilterOptions {
  fontSize: number;
  fontFamily: string;
  color: string;
  enableHueInteraction: boolean;
  invert: boolean;
  pointerVectorRef?: RefObject<NormalizedPointerVector>;
}

class AsciiFilter {
  readonly domElement: HTMLDivElement;
  private readonly pre: HTMLPreElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly fontSize: number;
  private readonly fontFamily: string;
  private readonly enableHueInteraction: boolean;
  private readonly invert: boolean;
  private readonly pointerVectorRef?: RefObject<NormalizedPointerVector>;
  private readonly center = { x: 0, y: 0 };
  private readonly mouse = { x: 0, y: 0 };
  private hueDegrees = 0;
  private width = 0;
  private height = 0;

  constructor(renderer: THREE.WebGLRenderer, options: AsciiFilterOptions) {
    this.renderer = renderer;
    this.fontSize = options.fontSize;
    this.fontFamily = options.fontFamily;
    this.enableHueInteraction = options.enableHueInteraction;
    this.invert = options.invert;
    this.pointerVectorRef = options.pointerVectorRef;

    this.domElement = document.createElement("div");
    this.domElement.style.position = "absolute";
    this.domElement.style.inset = "0";
    this.domElement.style.overflow = "hidden";
    this.domElement.dataset.charset = DEFAULT_CHARSET;
    this.domElement.dataset.fontFamily = "IBM Plex Mono";

    this.pre = document.createElement("pre");
    this.pre.style.position = "absolute";
    this.pre.style.left = "50%";
    this.pre.style.top = "50%";
    this.pre.style.transform = "translate(-50%, -50%)";
    this.pre.style.margin = "0";
    this.pre.style.padding = "0";
    this.pre.style.color = options.color;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.fontVariantLigatures = "none";
    this.pre.style.fontWeight = "500";
    this.pre.style.letterSpacing = "0";
    this.pre.style.lineHeight = "1em";
    this.pre.style.userSelect = "none";

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.context = this.canvas.getContext("2d", { willReadFrequently: true });
    if (this.context) this.context.imageSmoothingEnabled = false;

    this.domElement.append(this.pre, this.canvas);
    this.onMouseMove = this.onMouseMove.bind(this);
    if (this.enableHueInteraction && !this.pointerVectorRef) {
      document.addEventListener("mousemove", this.onMouseMove, {
        passive: true,
      });
    }
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.resetGrid();
    this.center.x = width / 2;
    this.center.y = height / 2;
    this.mouse.x = this.center.x;
    this.mouse.y = this.center.y;
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);

    if (!this.context) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.context.clearRect(0, 0, width, height);
    this.context.drawImage(this.renderer.domElement, 0, 0, width, height);
    this.pre.textContent = this.asciify(this.context, width, height);
    this.updateHue();
  }

  dispose() {
    document.removeEventListener("mousemove", this.onMouseMove);
  }

  private resetGrid() {
    if (!this.context) return;

    this.context.font = `500 ${this.fontSize}px ${this.fontFamily}`;
    const charWidth = Math.max(this.context.measureText("A").width, 1);
    const columns = Math.max(Math.floor(this.width / charWidth), 1);
    const rows = Math.max(Math.floor(this.height / this.fontSize), 1);

    this.canvas.width = columns;
    this.canvas.height = rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
  }

  private asciify(context: CanvasRenderingContext2D, width: number, height: number) {
    const pixels = context.getImageData(0, 0, width, height).data;
    let output = "";

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = x * 4 + y * 4 * width;
        const alpha = pixels[index + 3];

        if (alpha === 0) {
          output += " ";
          continue;
        }

        const gray =
          (0.3 * pixels[index] +
            0.6 * pixels[index + 1] +
            0.1 * pixels[index + 2]) /
          255;
        let characterIndex = Math.floor(
          (1 - gray) * (DEFAULT_CHARSET.length - 1),
        );
        if (this.invert) {
          characterIndex = DEFAULT_CHARSET.length - characterIndex - 1;
        }
        output += DEFAULT_CHARSET[characterIndex];
      }
      output += "\n";
    }

    return output;
  }

  private onMouseMove(event: MouseEvent) {
    const bounds = this.domElement.getBoundingClientRect();
    this.mouse.x = event.clientX - bounds.left;
    this.mouse.y = event.clientY - bounds.top;
  }

  private updateHue() {
    if (!this.enableHueInteraction) {
      this.domElement.style.filter = "none";
      return;
    }

    const sharedPointer = this.pointerVectorRef?.current;
    const targetDegrees = sharedPointer
      ? (Math.atan2(sharedPointer.y, sharedPointer.x) * 180) / Math.PI
      : (Math.atan2(
            this.mouse.y - this.center.y,
            this.mouse.x - this.center.x,
          ) *
          180) /
        Math.PI;
    this.hueDegrees += (targetDegrees - this.hueDegrees) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.hueDegrees.toFixed(1)}deg)`;
    this.domElement.dataset.hueDegrees = this.hueDegrees.toFixed(1);
  }
}

interface CanvasTextOptions {
  fontSize: number;
  fontFamily: string;
  color: string;
}

class CanvasText {
  readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly text: string;
  private readonly font: string;
  private readonly color: string;

  constructor(text: string, options: CanvasTextOptions) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.text = text;
    this.color = options.color;
    this.font = `600 ${options.fontSize}px ${options.fontFamily}`;
  }

  resize() {
    if (!this.context) return;

    this.context.font = this.font;
    const metrics = this.context.measureText(this.text);
    this.canvas.width = Math.ceil(metrics.width) + 20;
    this.canvas.height =
      Math.ceil(
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      ) + 20;
  }

  render() {
    if (!this.context) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.text);
    this.context.fillText(this.text, 10, 10 + metrics.actualBoundingBoxAscent);
  }
}

interface CanvasAsciiOptions {
  text: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  enableWaves: boolean;
  animate: boolean;
  enablePointerInteraction: boolean;
  fontFamily: string;
  fitWidthRatio: number;
  extremeFitWidthRatio: number;
  maxPointerRotationX: number;
  maxPointerRotationY: number;
  pointerFollow: number;
  rotationFollow: number;
  pointerVectorRef?: RefObject<NormalizedPointerVector>;
  smoothedPointerRef?: RefObject<NormalizedPointerVector>;
  drivesPointerSmoothing: boolean;
  interactionScaleRef?: RefObject<SharedInteractionScale>;
  drivesInteractionScale: boolean;
  sharedScreenPlaneHeight?: number;
  onScreenPlaneHeightFit?: (height: number) => void;
}

class CanvasAscii {
  private readonly container: HTMLElement;
  private readonly options: CanvasAsciiOptions;
  private width: number;
  private height: number;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly scene = new THREE.Scene();
  private readonly mouse: { x: number; y: number };
  private readonly smoothedPointer = { x: 0, y: 0 };
  private textCanvas?: CanvasText;
  private textAspect = 1;
  private texture?: THREE.CanvasTexture;
  private geometry?: THREE.PlaneGeometry;
  private material?: THREE.ShaderMaterial;
  private mesh?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private renderer?: THREE.WebGLRenderer;
  private filter?: AsciiFilter;
  private animationFrameId = 0;
  private fittedPlaneHeight = 0;

  constructor(
    options: CanvasAsciiOptions,
    container: HTMLElement,
    width: number,
    height: number,
  ) {
    this.options = options;
    this.container = container;
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.mouse = { x: width / 2, y: height / 2 };
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  async init() {
    await Promise.all([
      document.fonts.load(
        `600 ${this.options.textFontSize}px ${this.options.fontFamily}`,
      ),
      document.fonts.load(
        `500 ${this.options.asciiFontSize}px ${this.options.fontFamily}`,
      ),
    ]);
    await document.fonts.ready;
    this.container.dataset.asciiFontReady = document.fonts
      .check(`500 ${this.options.asciiFontSize}px ${this.options.fontFamily}`)
      .toString();
    this.createMesh();
    this.createRenderer();
  }

  start() {
    if (!this.options.animate) {
      this.render(0);
      return;
    }

    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render(performance.now() * 0.001);
    };
    animateFrame();
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(true);
    this.filter?.setSize(width, height);
    this.fitMeshToView();
    this.mouse.x = width / 2;
    this.mouse.y = height / 2;
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    document.removeEventListener("pointermove", this.onPointerMove);
    this.filter?.dispose();
    this.filter?.domElement.remove();
    this.scene.clear();
    this.geometry?.dispose();
    this.material?.dispose();
    this.texture?.dispose();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
  }

  private createMesh() {
    this.textCanvas = new CanvasText(this.options.text, {
      fontSize: this.options.textFontSize,
      fontFamily: this.options.fontFamily,
      color: this.options.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.canvas);
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;

    this.textAspect =
      this.textCanvas.canvas.width / this.textCanvas.canvas.height;
    const planeHeight = this.options.planeBaseHeight;
    const planeWidth = planeHeight * this.textAspect;

    this.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 36, 36);
    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      transparent: true,
      uniforms: {
        mouse: { value: 1 },
        uEnableWaves: { value: this.options.enableWaves ? 1 : 0 },
        uTexture: { value: this.texture },
        uTime: { value: 0 },
      },
      vertexShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  private createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(1);

    this.filter = new AsciiFilter(this.renderer, {
      color: this.options.textColor,
      enableHueInteraction: this.options.enablePointerInteraction,
      fontFamily: this.options.fontFamily,
      fontSize: this.options.asciiFontSize,
      invert: true,
      pointerVectorRef: this.options.pointerVectorRef,
    });
    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);

    if (
      this.options.enablePointerInteraction &&
      !this.options.pointerVectorRef
    ) {
      document.addEventListener("pointermove", this.onPointerMove, {
        passive: true,
      });
    }
  }

  private onPointerMove(event: PointerEvent) {
    const bounds = this.container.getBoundingClientRect();
    this.mouse.x = event.clientX - bounds.left;
    this.mouse.y = event.clientY - bounds.top;
  }

  private render(time: number) {
    if (!this.mesh || !this.material || !this.filter || !this.textCanvas) {
      return;
    }

    this.textCanvas.render();
    if (this.texture) this.texture.needsUpdate = true;
    this.material.uniforms.uTime.value = Math.sin(time);

    if (this.options.enablePointerInteraction) {
      const sharedPointer = this.options.pointerVectorRef?.current;
      const normalizedX = sharedPointer
        ? sharedPointer.x
        : THREE.MathUtils.clamp((this.mouse.x / this.width) * 2 - 1, -1, 1);
      const normalizedY = sharedPointer
        ? sharedPointer.y
        : THREE.MathUtils.clamp((this.mouse.y / this.height) * 2 - 1, -1, 1);

      const sharedSmoothedPointer = this.options.smoothedPointerRef?.current;
      if (sharedSmoothedPointer && this.options.drivesPointerSmoothing) {
        sharedSmoothedPointer.x +=
          (normalizedX - sharedSmoothedPointer.x) * this.options.pointerFollow;
        sharedSmoothedPointer.y +=
          (normalizedY - sharedSmoothedPointer.y) * this.options.pointerFollow;
      } else if (!sharedSmoothedPointer) {
        this.smoothedPointer.x +=
          (normalizedX - this.smoothedPointer.x) * this.options.pointerFollow;
        this.smoothedPointer.y +=
          (normalizedY - this.smoothedPointer.y) * this.options.pointerFollow;
      }

      const smoothedX = sharedSmoothedPointer
        ? sharedSmoothedPointer.x
        : this.smoothedPointer.x;
      const smoothedY = sharedSmoothedPointer
        ? sharedSmoothedPointer.y
        : this.smoothedPointer.y;
      const targetX = -smoothedY * this.options.maxPointerRotationX;
      const targetY = smoothedX * this.options.maxPointerRotationY;
      this.mesh.rotation.x +=
        (targetX - this.mesh.rotation.x) * this.options.rotationFollow;
      this.mesh.rotation.y +=
        (targetY - this.mesh.rotation.y) * this.options.rotationFollow;
      this.container.dataset.pointerX = normalizedX.toFixed(3);
      this.container.dataset.pointerY = normalizedY.toFixed(3);
      this.container.dataset.smoothedPointerX = smoothedX.toFixed(3);
      this.container.dataset.smoothedPointerY = smoothedY.toFixed(3);
      this.container.dataset.rotationX = this.mesh.rotation.x.toFixed(3);
      this.container.dataset.rotationY = this.mesh.rotation.y.toFixed(3);
    }

    let interactionScale = 1;
    if (
      this.options.enablePointerInteraction &&
      this.options.drivesInteractionScale
    ) {
      interactionScale = this.calculateInteractionScale(
        this.mesh.rotation.x,
        this.mesh.rotation.y,
      );
      if (this.options.interactionScaleRef?.current) {
        this.options.interactionScaleRef.current.value = interactionScale;
      }
    } else if (this.options.interactionScaleRef?.current) {
      interactionScale = this.options.drivesInteractionScale
        ? 1
        : this.options.interactionScaleRef.current.value;
    }
    this.mesh.scale.setScalar(interactionScale);
    this.container.dataset.interactionScale = interactionScale.toFixed(3);

    this.filter.render(this.scene, this.camera);
  }

  private fitMeshToView() {
    if (!this.mesh) return;

    let fittedHeight: number;
    if (this.options.sharedScreenPlaneHeight !== undefined) {
      fittedHeight = this.worldHeightForScreenPixels(
        this.options.sharedScreenPlaneHeight,
      );
    } else {
      let lowerBound = 0.1;
      let upperBound = this.options.planeBaseHeight;

      for (let index = 0; index < 28; index += 1) {
        const candidate = (lowerBound + upperBound) / 2;
        if (this.fitsAtHeight(candidate)) {
          lowerBound = candidate;
        } else {
          upperBound = candidate;
        }
      }

      fittedHeight = lowerBound;
    }

    const fittedWidth = fittedHeight * this.textAspect;
    const screenPlaneHeight = this.screenPixelsForWorldHeight(fittedHeight);
    this.fittedPlaneHeight = fittedHeight;
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.PlaneGeometry(
      fittedWidth,
      fittedHeight,
      36,
      36,
    );

    this.container.dataset.fittedPlaneHeight = fittedHeight.toFixed(3);
    this.container.dataset.fittedPlaneWidth = fittedWidth.toFixed(3);
    this.container.dataset.screenPlaneHeight = screenPlaneHeight.toFixed(3);
    this.container.dataset.fitMode =
      this.options.sharedScreenPlaneHeight === undefined
        ? "source"
        : "shared";
    this.container.dataset.fitWidthRatio =
      this.options.fitWidthRatio.toFixed(2);
    this.container.dataset.extremeFitWidthRatio =
      this.options.extremeFitWidthRatio.toFixed(2);
    this.container.dataset.maxPointerRotationX =
      this.options.maxPointerRotationX.toFixed(2);
    this.container.dataset.maxPointerRotationY =
      this.options.maxPointerRotationY.toFixed(2);
    this.container.dataset.pointerFollow = this.options.pointerFollow.toFixed(2);
    this.container.dataset.rotationFollow =
      this.options.rotationFollow.toFixed(2);

    if (this.options.sharedScreenPlaneHeight === undefined) {
      this.options.onScreenPlaneHeightFit?.(screenPlaneHeight);
    }
  }

  private screenPixelsForWorldHeight(worldHeight: number) {
    const cameraDistance = Math.abs(this.camera.position.z);
    const visibleWorldHeight =
      2 *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) *
      cameraDistance;
    return (worldHeight / visibleWorldHeight) * this.height;
  }

  private worldHeightForScreenPixels(screenHeight: number) {
    const cameraDistance = Math.abs(this.camera.position.z);
    const visibleWorldHeight =
      2 *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) *
      cameraDistance;
    return (screenHeight / this.height) * visibleWorldHeight;
  }

  private fitsAtHeight(planeHeight: number) {
    const planeWidth = planeHeight * this.textAspect;
    const halfWidth = planeWidth / 2;
    const halfHeight = planeHeight / 2;
    const rotationsX = [0];
    const rotationsY = [0];
    const waveTimes = this.options.enableWaves
      ? Array.from({ length: 21 }, (_, index) => -5 + index * 0.5)
      : [0];
    const sampleColumns = 19;
    const sampleRows = 7;
    const point = new THREE.Vector3();
    const euler = new THREE.Euler();

    for (const rotationX of rotationsX) {
      for (const rotationY of rotationsY) {
        euler.set(rotationX, rotationY, 0, "XYZ");
        const horizontalLimit = this.options.fitWidthRatio;

        for (const waveTime of waveTimes) {
          for (let row = 0; row < sampleRows; row += 1) {
            const sourceY =
              -halfHeight + (planeHeight * row) / (sampleRows - 1);

            for (let column = 0; column < sampleColumns; column += 1) {
              const sourceX =
                -halfWidth + (planeWidth * column) / (sampleColumns - 1);
              const offsetX = this.options.enableWaves
                ? Math.sin(waveTime + sourceY) * WAVE_AMPLITUDE_X
                : 0;
              const offsetY = this.options.enableWaves
                ? Math.cos(waveTime) * WAVE_AMPLITUDE_Y
                : 0;
              const offsetZ = this.options.enableWaves
                ? Math.sin(waveTime + sourceX) * WAVE_AMPLITUDE_Z
                : 0;

              point
                .set(sourceX + offsetX, sourceY + offsetY, offsetZ)
                .applyEuler(euler)
                .project(this.camera);

              if (
                Math.abs(point.x) > horizontalLimit ||
                Math.abs(point.y) > 0.92
              ) {
                return false;
              }
            }
          }
        }
      }
    }

    return true;
  }

  private calculateInteractionScale(rotationX: number, rotationY: number) {
    if (
      this.fittedPlaneHeight <= 0 ||
      (Math.abs(rotationX) < 0.001 && Math.abs(rotationY) < 0.001)
    ) {
      return 1;
    }

    if (this.fitsInteractionScale(1, rotationX, rotationY)) return 1;

    let lowerBound = 0.35;
    let upperBound = 1;
    for (let index = 0; index < 14; index += 1) {
      const candidate = (lowerBound + upperBound) / 2;
      if (this.fitsInteractionScale(candidate, rotationX, rotationY)) {
        lowerBound = candidate;
      } else {
        upperBound = candidate;
      }
    }

    return lowerBound;
  }

  private fitsInteractionScale(
    scale: number,
    rotationX: number,
    rotationY: number,
  ) {
    const planeHeight = this.fittedPlaneHeight;
    const planeWidth = planeHeight * this.textAspect;
    const halfWidth = planeWidth / 2;
    const halfHeight = planeHeight / 2;
    const waveX = this.options.enableWaves
      ? [-WAVE_AMPLITUDE_X, WAVE_AMPLITUDE_X]
      : [0];
    const waveY = this.options.enableWaves
      ? [-WAVE_AMPLITUDE_Y, WAVE_AMPLITUDE_Y]
      : [0];
    const waveZ = this.options.enableWaves
      ? [-WAVE_AMPLITUDE_Z, WAVE_AMPLITUDE_Z]
      : [0];
    const point = new THREE.Vector3();
    const euler = new THREE.Euler(rotationX, rotationY, 0, "XYZ");

    for (const cornerX of [-halfWidth, halfWidth]) {
      for (const cornerY of [-halfHeight, halfHeight]) {
        for (const offsetX of waveX) {
          for (const offsetY of waveY) {
            for (const offsetZ of waveZ) {
              point
                .set(
                  (cornerX + offsetX) * scale,
                  (cornerY + offsetY) * scale,
                  offsetZ * scale,
                )
                .applyEuler(euler)
                .project(this.camera);

              if (
                Math.abs(point.x) > this.options.extremeFitWidthRatio ||
                Math.abs(point.y) > 0.92
              ) {
                return false;
              }
            }
          }
        }
      }
    }

    return true;
  }
}

export interface NormalizedPointerVector {
  x: number;
  y: number;
}

export interface SharedInteractionScale {
  value: number;
}

export interface ASCIITextProps {
  text: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  animate?: boolean;
  enablePointerInteraction?: boolean;
  fitWidthRatio?: number;
  extremeFitWidthRatio?: number;
  maxPointerRotationX?: number;
  maxPointerRotationY?: number;
  pointerFollow?: number;
  rotationFollow?: number;
  pointerVectorRef?: RefObject<NormalizedPointerVector>;
  smoothedPointerRef?: RefObject<NormalizedPointerVector>;
  drivesPointerSmoothing?: boolean;
  interactionScaleRef?: RefObject<SharedInteractionScale>;
  drivesInteractionScale?: boolean;
  sharedScreenPlaneHeight?: number;
  onScreenPlaneHeightFit?: (height: number) => void;
  className?: string;
}

export function ASCIIText({
  text,
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = "#f2f2ef",
  planeBaseHeight = 8,
  enableWaves = true,
  animate = true,
  enablePointerInteraction = true,
  fitWidthRatio = 0.84,
  extremeFitWidthRatio = 0.96,
  maxPointerRotationX = 0.38,
  maxPointerRotationY = 0.16,
  pointerFollow = 0.07,
  rotationFollow = 0.07,
  pointerVectorRef,
  smoothedPointerRef,
  drivesPointerSmoothing = false,
  interactionScaleRef,
  drivesInteractionScale = false,
  sharedScreenPlaneHeight,
  onScreenPlaneHeightFit,
  className,
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let instance: CanvasAscii | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const setup = async () => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0 || cancelled) return;

      const fontFamily = ASCII_FONT_FAMILY;
      const nextInstance = new CanvasAscii(
        {
          animate,
          asciiFontSize,
          enablePointerInteraction,
          enableWaves,
          extremeFitWidthRatio,
          fitWidthRatio,
          fontFamily,
          drivesPointerSmoothing,
          drivesInteractionScale,
          interactionScaleRef,
          maxPointerRotationX,
          maxPointerRotationY,
          pointerVectorRef,
          pointerFollow,
          rotationFollow,
          smoothedPointerRef,
          onScreenPlaneHeightFit,
          planeBaseHeight,
          sharedScreenPlaneHeight,
          text,
          textColor,
          textFontSize,
        },
        container,
        width,
        height,
      );

      try {
        await nextInstance.init();
      } catch {
        nextInstance.dispose();
        return;
      }

      if (cancelled) {
        nextInstance.dispose();
        return;
      }

      instance = nextInstance;
      instance.start();

      resizeObserver = new ResizeObserver(([entry]) => {
        if (!entry || !instance) return;
        const { width: nextWidth, height: nextHeight } = entry.contentRect;
        if (nextWidth > 0 && nextHeight > 0) {
          instance.setSize(nextWidth, nextHeight);
        }
      });
      resizeObserver.observe(container);
    };

    void setup();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      instance?.dispose();
    };
  }, [
    animate,
    asciiFontSize,
    enablePointerInteraction,
    enableWaves,
    extremeFitWidthRatio,
    fitWidthRatio,
    drivesPointerSmoothing,
    drivesInteractionScale,
    interactionScaleRef,
    maxPointerRotationX,
    maxPointerRotationY,
    onScreenPlaneHeightFit,
    planeBaseHeight,
    pointerVectorRef,
    pointerFollow,
    rotationFollow,
    smoothedPointerRef,
    sharedScreenPlaneHeight,
    text,
    textColor,
    textFontSize,
  ]);

  return <div ref={containerRef} className={className} />;
}
