import { MaterialGrade } from "./types";

export const MATERIAL_GRADES: MaterialGrade[] = [
  { id: "ss400", name: "SS400 / A36", density: 7.85e-6, basePrice: 12500 },
  { id: "sus304", name: "SUS304 / Stainless", density: 8.0e-6, basePrice: 45000 },
  { id: "sus316", name: "SUS316 / Stainless", density: 8.0e-6, basePrice: 65000 },
  { id: "hardox400", name: "Hardox 400", density: 7.85e-6, basePrice: 35000 },
];

export const LABOR_RATES = {
  welder: 45000,
  fitter: 35000,
  helper: 25000,
  foreman: 65000,
};
