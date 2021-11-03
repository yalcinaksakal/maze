import {
  BoxBufferGeometry,
  BufferGeometry,
  ConeGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

const geometryCross1 = new BoxBufferGeometry(2, 5, 20);
geometryCross1.rotateY(Math.PI / 4);
const geometryCross2 = geometryCross1.clone();
geometryCross2.rotateY(-Math.PI / 2);

const geometryArrowUp = new ConeGeometry(10, 20, 16);
geometryArrowUp.rotateX(Math.PI / 2);

const geometryArrowDown = new ConeGeometry(10, 20, 16);
geometryArrowDown.rotateX(-Math.PI / 2);

const dDrawer = (data, start) => {
  const { path, direction, doesPathExist } = data;
  const points = [];

  const shift =
    ((doesPathExist ? (direction === "up" ? -1 : 1) : 0) * path[0].x) / 10;

  const rndm = () => Math.floor(Math.random() * 256);

  let color = doesPathExist
    ? `rgb(${direction === "up" ? 255 : 0},${rndm()},${rndm()})`
    : direction === "up"
    ? "red"
    : "black";

  for (const point of path)
    points.push(
      new Vector3(
        start + 13 + point.x * 25,
        15 + shift,
        start + 13 + point.y * 25
      )
    );

  const lineMaterial = new LineBasicMaterial({
    color,
  });

  const result = [];
  const firstPoint = points[0];

  const createStartFigure = geometry => {
    const result = new Mesh(geometry, new MeshBasicMaterial({ color }));
    result.position.set(firstPoint.x, firstPoint.y, firstPoint.z);
    result.castShadow = true;
    return result;
  };

  if (doesPathExist) {
    result.push(
      createStartFigure(
        direction === "up" ? geometryArrowUp : geometryArrowDown
      )
    );
    //path
    const lineGeometry = new BufferGeometry().setFromPoints(points);
    result.push(new Line(lineGeometry, lineMaterial));
  } else {
    //cross sign
    let cross = new Group();
    cross.add(createStartFigure(geometryCross1));
    cross.add(createStartFigure(geometryCross2));
    result.push(cross);
  }
  if (points[0].y === 1) console.log(points);
  return result;
};

export default dDrawer;
