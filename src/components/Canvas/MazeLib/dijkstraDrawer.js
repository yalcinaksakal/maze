import {
  BufferGeometry,
  ConeGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

const dDrawer = data => {
  const { path, direction } = data;
  const points = [];
  const shift = direction === "up" ? -2 : 2;

  const rndm = () => Math.floor(Math.random() * 256);
  const color = `rgb(${direction === "up" ? "255" : rndm()},0,${
    direction === "up" ? rndm() : "255"
  })`;
  for (const point of path)
    points.push(
      new Vector3(-487 + point.x * 25 + shift, 15, -487 + point.y * 25)
    );

  const material = new LineBasicMaterial({
    color,
  });

  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  line.castShadow = true;

  const geometryArrow = new ConeGeometry(10, 20, 16);
  geometryArrow.rotateX(((direction === "up" ? 1 : -1) * Math.PI) / 2);
  const arrow = new Mesh(geometryArrow, new MeshBasicMaterial({ color }));
  const firstPoint = points[0];
  arrow.position.set(firstPoint.x, firstPoint.y, firstPoint.z);
  arrow.castShadow = true;
  return [line, arrow];
};

export default dDrawer;
