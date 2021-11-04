import { BoxBufferGeometry, Group, Mesh, MeshBasicMaterial } from "three";

const geometryCross1 = new BoxBufferGeometry(2, 5, 20);
geometryCross1.rotateY(Math.PI / 4);
const geometryCross2 = geometryCross1.clone();
geometryCross2.rotateY(-Math.PI / 2);

const matUp = new MeshBasicMaterial({ color: "red" });
const matDown = new MeshBasicMaterial({ color: "black" });

const noPathDrawer = nodes => {
  const createCross = (g, x, y, dir) => {
    const result = new Mesh(g, dir > 0 ? matUp : matDown);
    result.position.set(x, 3, y);
    result.castShadow = true;
    return result;
  };

  const result = new Group();

  let x, y;
  for (const [node, dir] of Object.entries(nodes)) {
    y = node.split("-");
    x = +y[0] * 25 + 13;
    y = +y[1] * 25 + 13;
    result.add(createCross(geometryCross1, x, y, dir));
    result.add(createCross(geometryCross2, x, y, dir));
  }

  return result;
};

export default noPathDrawer;
