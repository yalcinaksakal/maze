import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
} from "three";

const geometry = new CylinderBufferGeometry(1, 1, 5, 16);
const material = new MeshBasicMaterial({ color: "dodgerblue" });
const materialStart = new MeshBasicMaterial({ color: "red" });
const boxGeometryHorizantal = new BoxBufferGeometry(25, 5, 1);
const boxGeometryVertical = new BoxBufferGeometry(1, 5, 25);
const boxMaterial = new MeshBasicMaterial({ color: "gray" });

const createNodes = () => {
  const nodes = new Group();
  for (let i = 0; i < 40; i++)
    for (let j = 0; j < 40; j++) {
      const cylinder = new Mesh(geometry, !i && !j ? materialStart : material);
      cylinder.position.set(-487 + i * 25, 2.6, -487 + j * 25);
      cylinder.castShadow = true;
      nodes.add(cylinder);
    }
  return nodes;
};

export const createWalls = () => {
  const walls = new Group();
  for (let i = 0; i < 41; i++)
    for (let j = 0; j < 41; j++) {
      if (i < 40) {
        const wallH = new Mesh(boxGeometryHorizantal, boxMaterial);
        wallH.position.set(-487 + i * 25, 2.51, -500 + j * 25);
        wallH.castShadow = true;
        wallH.receiveShadow = true;
        walls.add(wallH);
      }
      if (j > 39) continue;
      const wallV = new Mesh(boxGeometryVertical, boxMaterial);
      wallV.position.set(-500 + i * 25, 2.51, -487 + j * 25);
      wallV.castShadow = true;
      wallV.receiveShadow = true;
      walls.add(wallV);
    }
  return walls;
};

export default createNodes;
