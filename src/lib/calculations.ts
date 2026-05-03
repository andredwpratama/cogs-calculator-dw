export type MaterialShape = "plate" | "h-beam" | "round-bar" | "pipe" | "unp" | "angle";

export interface MaterialDimensions {
  length: number;
  width?: number;
  thickness?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  height?: number;
  webThickness?: number;
  flangeWidth?: number;
  flangeThickness?: number;
}

export const DENSITY = {
  steel: 7.85e-6, // kg/mm3
};

export function calculateArea(shape: MaterialShape, dim: MaterialDimensions): number {
  const { width, thickness, outerDiameter, innerDiameter, height, webThickness, flangeWidth, flangeThickness } = dim;

  switch (shape) {
    case "plate":
      return (width || 0) * (thickness || 0);

    case "round-bar":
      const radius = (outerDiameter || 0) / 2;
      return Math.PI * Math.pow(radius, 2);

    case "pipe":
      const R = (outerDiameter || 0) / 2;
      const r = (innerDiameter || (outerDiameter || 0) - 2 * (thickness || 0)) / 2;
      return Math.PI * (Math.pow(R, 2) - Math.pow(r, 2));

    case "h-beam":
    case "unp":
      const webHeight = (height || 0) - (2 * (flangeThickness || 0));
      return (webHeight * (webThickness || 0)) + (2 * (flangeWidth || 0) * (flangeThickness || 0));

    case "angle":
      return ((height || 0) + (width || 0) - (thickness || 0)) * (thickness || 0);

    default:
      return 0;
    }
    }

    export function calculateWeight(shape: MaterialShape, dim: MaterialDimensions, density: number = 7.85e-6): number {
    const area = calculateArea(shape, dim);        
    return area * (dim.length || 0) * density;     
    }
export function calculateCost(weight: number, pricePerKg: number, quantity: number): number {
  return weight * pricePerKg * quantity;
}
