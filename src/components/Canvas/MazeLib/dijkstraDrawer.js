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
        start + 13 + point.x * 25 + shift,
        15 + shift,
        start + 13 + point.y * 25
      )
    );

  const material = new LineBasicMaterial({
    color,
  });

  let geos;
  const firstPoint = points[0];
  let startFigure;

  const createStartFigure = geometry => {
    const result = new Mesh(geometry, new MeshBasicMaterial({ color }));

    result.position.set(firstPoint.x, firstPoint.y, firstPoint.z);
    result.castShadow = true;

    return result;
  };

  if (doesPathExist) {
    const geometryArrow = new ConeGeometry(10, 20, 16);
    geometryArrow.rotateX(((direction === "up" ? 1 : -1) * Math.PI) / 2);
    startFigure = createStartFigure(geometryArrow);

    //path
    const geometry = new BufferGeometry().setFromPoints(points);
    geos = new Line(geometry, material);
  } else {
    //cross sign
    const geometryCross = new BoxBufferGeometry(2, 5, 20);
    geometryCross.rotateY(Math.PI / 4);
    startFigure = new Group();
    startFigure.add(createStartFigure(geometryCross));
    startFigure.add(
      createStartFigure(geometryCross.clone().rotateY(-Math.PI / 2))
    );
  }
  return [geos, startFigure];
};

export default dDrawer;
