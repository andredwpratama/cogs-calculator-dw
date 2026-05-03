import { describe, it, expect } from "vitest";
import { calculateWeight } from "./calculations";

describe("calculateWeight", () => {
  it("calculates plate weight correctly", () => {
    const dim = { length: 1000, width: 1000, thickness: 10 };
    const weight = calculateWeight("plate", dim);
    // 1000 * 1000 * 10 * 7.85e-6 = 78.5
    expect(weight).toBeCloseTo(78.5);
  });

  it("calculates round-bar weight correctly", () => {
    const dim = { length: 1000, outerDiameter: 100 };
    const weight = calculateWeight("round-bar", dim);
    // PI * 50^2 * 1000 * 7.85e-6 = 61.65
    expect(weight).toBeCloseTo(61.65, 1);
  });

  it("calculates pipe weight correctly", () => {
    const dim = { length: 1000, outerDiameter: 100, thickness: 10 };
    const weight = calculateWeight("pipe", dim);
    // PI * (50^2 - 40^2) * 1000 * 7.85e-6 = 22.19
    expect(weight).toBeCloseTo(22.19, 1);
  });

  it("calculates angle weight correctly", () => {
    const dim = { length: 1000, height: 100, width: 100, thickness: 10 };
    const weight = calculateWeight("angle", dim);
    // (100 + 100 - 10) * 10 * 1000 * 7.85e-6 = 14.915
    expect(weight).toBeCloseTo(14.915, 2);       
    });

    it("calculates h-beam weight correctly", () => {
    const dim = { length: 1000, height: 200, webThickness: 10, flangeWidth: 100, flangeThickness: 10 };
    const weight = calculateWeight("h-beam", dim);
    // webHeight = 200 - 20 = 180
    // area = (180 * 10) + 2 * (100 * 10) = 1800 + 2000 = 3800
    // weight = 3800 * 1000 * 7.85e-6 = 29.83
    expect(weight).toBeCloseTo(29.83, 2);
    });
    });
