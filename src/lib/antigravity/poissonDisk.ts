import type { PoissonPointTuple } from "./types";

function linearMap(x: number, a: number, b: number, c: number, d: number): number {
  return ((x - a) * (d - c)) / (b - a) + c;
}

function squaredDistance(a: PoissonPointTuple, b: PoissonPointTuple): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

export function createAntigravityPoissonPoints(density: number): PoissonPointTuple[] {
  const width = 500;
  const height = 500;
  const minDistance = linearMap(density, 0, 300, 10, 2);
  const maxDistance = linearMap(density, 0, 300, 11, 3);
  const tries = 20;
  const cellSize = minDistance / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid: Array<PoissonPointTuple | null> = Array.from(
    { length: gridWidth * gridHeight },
    () => null
  );
  const active: PoissonPointTuple[] = [];
  const points: PoissonPointTuple[] = [];

  const gridIndex = (x: number, y: number): number => x + y * gridWidth;

  const addPoint = (point: PoissonPointTuple): void => {
    points.push(point);
    active.push(point);
    const gx = Math.floor(point[0] / cellSize);
    const gy = Math.floor(point[1] / cellSize);
    grid[gridIndex(gx, gy)] = point;
  };

  const isValid = (point: PoissonPointTuple): boolean => {
    if (point[0] < 0 || point[0] >= width || point[1] < 0 || point[1] >= height) {
      return false;
    }

    const gx = Math.floor(point[0] / cellSize);
    const gy = Math.floor(point[1] / cellSize);
    const minDistanceSq = minDistance * minDistance;

    for (let y = Math.max(0, gy - 2); y <= Math.min(gridHeight - 1, gy + 2); y += 1) {
      for (let x = Math.max(0, gx - 2); x <= Math.min(gridWidth - 1, gx + 2); x += 1) {
        const neighbor = grid[gridIndex(x, y)];
        if (neighbor && squaredDistance(point, neighbor) < minDistanceSq) {
          return false;
        }
      }
    }

    return true;
  };

  addPoint([Math.random() * width, Math.random() * height]);

  while (active.length > 0) {
    const activeIndex = Math.floor(Math.random() * active.length);
    const origin = active[activeIndex];
    let accepted = false;

    for (let i = 0; i < tries; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = minDistance + Math.random() * Math.max(0, maxDistance - minDistance);
      const candidate: PoissonPointTuple = [
        origin[0] + Math.cos(angle) * distance,
        origin[1] + Math.sin(angle) * distance
      ];

      if (isValid(candidate)) {
        addPoint(candidate);
        accepted = true;
        break;
      }
    }

    if (!accepted) {
      active.splice(activeIndex, 1);
    }
  }

  return points;
}
