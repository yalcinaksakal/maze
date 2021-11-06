import {
  BufferGeometry,
  ConeGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

const geometryArrowUp = new ConeGeometry(4, 20, 16);
geometryArrowUp.rotateX(Math.PI / 2);

const geometryArrowDown = new ConeGeometry(4, 20, 16);
geometryArrowDown.rotateX(-Math.PI / 2);

const dDrawer = (data, start) => {
  const { path, direction } = data;
  const points = [];

  const shift = direction === "up" ? -5 : 5;

  const rndm = () => Math.floor(Math.random() * 256);

  let color = `rgb(${direction === "up" ? 255 : 0},${rndm()},${rndm()})`;

  for (const point of path)
    points.push(
      new Vector3(
        start + 13 + point.x * 25 + shift,
        4,
        start + 13 + point.y * 25 + shift
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

  result.push(
    createStartFigure(direction === "up" ? geometryArrowUp : geometryArrowDown)
  );

  const lineGeometry = new BufferGeometry().setFromPoints(points);
  result.push(new Line(lineGeometry, lineMaterial));

  return result;
};

export default dDrawer;
