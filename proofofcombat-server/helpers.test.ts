import { findTerrainType } from "./helpers";
import { LocationData } from "./constants";

test("findTerrainType spirals outward to locate target terrain", () => {
  const [x, y] = findTerrainType(60, 50, "water");
  const terrain = LocationData.default.locations[x][y].terrain;
  expect(terrain).toBe("water");
});
