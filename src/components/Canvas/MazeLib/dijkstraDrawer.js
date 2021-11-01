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

const dDrawer = data => {
  const { path, direction } = data;
  const points = [];
  const shift = direction === "up" ? -2 : 2;

  const rndm = () => Math.floor(Math.random() * 256);
  let color = `rgb(0,${direction === "up" ? "255" : rndm()},${
    direction === "up" ? rndm() : "255"
  })`;
  for (const point of path)
    points.push(
      new Vector3(-487 + point.x * 25 + shift, 15, -487 + point.y * 25)
    );

  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.6,
  });

  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  line.castShadow = true;

  const firstPoint = points[0];
  let startFigure;

  const createStartFigure = geometry => {
    const result = new Mesh(geometry, new MeshBasicMaterial({ color }));

    result.position.set(firstPoint.x, firstPoint.y, firstPoint.z);
    result.castShadow = true;

    return result;
  };

  if (points.length > 1) {
    const geometryArrow = new ConeGeometry(10, 20, 16);
    geometryArrow.rotateX(((direction === "up" ? 1 : -1) * Math.PI) / 2);
    startFigure = createStartFigure(geometryArrow);
  } else {
    const geometryCross = new BoxBufferGeometry(2, 5, 20);
    geometryCross.rotateY(Math.PI / 4);
    color = "red";
    startFigure = new Group();
    startFigure.add(createStartFigure(geometryCross));
    startFigure.add(
      createStartFigure(geometryCross.clone().rotateY(-Math.PI / 2))
    );
  }
  return [line, startFigure];
};

export default dDrawer;
