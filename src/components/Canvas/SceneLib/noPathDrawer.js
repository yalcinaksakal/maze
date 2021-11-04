import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
} from "three";

import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

const geometryCross1 = new BoxBufferGeometry(2, 5, 20);
geometryCross1.rotateY(Math.PI / 4);
const geometryCross2 = geometryCross1.clone();
geometryCross2.rotateY(-Math.PI / 2);

const matUp = new MeshBasicMaterial({ color: "red" });
const matDown = new MeshBasicMaterial({ color: "black" });
const positionHelper = new Object3D();

const noPathDrawer = (nodes, start) => {
  const up = [],
    down = [];
  const createCross = (g, x, y, dir) => {
    // const result = new Mesh(g, dir < 0 ? matUp : matDown);
    const result = g.clone();
    positionHelper.position.set(x, 3, y);
    positionHelper.updateWorldMatrix(true, false);
    result.applyMatrix4(positionHelper.matrixWorld);
    dir < 0 ? up.push(result) : down.push(result);
  };

  let x, y;
  for (const [node, dir] of Object.entries(nodes)) {
    y = node.split("-");
    x = +y[0] * 25 + 13 + start;
    y = +y[1] * 25 + 13 + start;
    createCross(geometryCross1, x, y, dir);
    createCross(geometryCross2, x, y, dir);
  }
  const result = new Group();
  if (up.length) {
    const mergedUps = mergeBufferGeometries(up, false);
    result.add(new Mesh(mergedUps, matUp));
  }
  if (down.length) {
    const mergedDowns = mergeBufferGeometries(down, false);
    result.add(new Mesh(mergedDowns, matDown));
  }

  return result;
};

export default noPathDrawer;
