export interface PoissonPoint {
  x: number;
  y: number;
}

interface GridPoint {
  x: number;
  y: number;
}

function linearMap(x: number, a: number, b: number, c: number, d: number): number {
  return ((x - a) * (d - c)) / (b - a) + c;
}

function distanceSq(a: GridPoint, b: GridPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function createPoissonPoints(density: number): PoissonPoint[] {
  const width = 500;
  const height = 500;
  const minDistance = linearMap(density, 0, 300, 10, 2);
  const maxDistance = linearMap(density, 0, 300, 11, 3);
  const tries = 20;
  const cellSize = minDistance / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid: Array<GridPoint | null> = Array.from({ length: gridWidth * gridHeight }, () => null);
  const active: GridPoint[] = [];
  const points: GridPoint[] = [];

  const gridIndex = (x: number, y: number): number => x + y * gridWidth;

  const insert = (point: GridPoint): void => {
    points.push(point);
    active.push(point);
    const gx = Math.floor(point.x / cellSize);
    const gy = Math.floor(point.y / cellSize);
    grid[gridIndex(gx, gy)] = point;
  };

  const isValid = (point: GridPoint): boolean => {
    if (point.x < 0 || point.x >= width || point.y < 0 || point.y >= height) {
      return false;
    }

    const gx = Math.floor(point.x / cellSize);
    const gy = Math.floor(point.y / cellSize);
    const minDistanceSq = minDistance * minDistance;

    for (let y = Math.max(0, gy - 2); y <= Math.min(gridHeight - 1, gy + 2); y += 1) {
      for (let x = Math.max(0, gx - 2); x <= Math.min(gridWidth - 1, gx + 2); x += 1) {
        const neighbor = grid[gridIndex(x, y)];

        if (neighbor && distanceSq(point, neighbor) < minDistanceSq) {
          return false;
        }
      }
    }

    return true;
  };

  insert({ x: width * 0.5, y: height * 0.5 });

  while (active.length > 0) {
    const activeIndex = Math.floor(Math.random() * active.length);
    const origin = active[activeIndex];
    let accepted = false;

    for (let i = 0; i < tries; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = minDistance + Math.random() * (maxDistance - minDistance);
      const candidate = {
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius
      };

      if (isValid(candidate)) {
        insert(candidate);
        accepted = true;
        break;
      }
    }

    if (!accepted) {
      active.splice(activeIndex, 1);
    }
  }

  return points.map((point) => ({
    x: (point.x - width * 0.5) / (width * 0.5),
    y: (point.y - height * 0.5) / (height * 0.5)
  }));
}
