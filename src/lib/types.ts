export type CostItemType = "local_purchase" | "consumable" | "service" | "labor" | "material" | "manufacturing";

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

export interface CostItemMetadata {
  materialId?: string;
  shape?: MaterialShape;
  dimensions?: MaterialDimensions;
  density?: number;
  weight?: number;
  gradeId?: string;
  level?: string;
  hours?: number;
  cutting?: number;
  forming?: number;
  welding?: number;
  painting?: number;
  [key: string]: unknown;
}

export interface CostItem {
  id: string;
  projectId?: string;
  type: CostItemType;
  name: string;
  quantity: number;
  unitPrice: number;
  metadata?: CostItemMetadata;
}

export interface Project {
  id: string;
  name: string;
  overheadPercent: number;
  gpPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialGrade {
  id: string;
  name: string;
  density: number;
  basePrice: number;
}
