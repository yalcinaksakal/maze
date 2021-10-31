import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

const dDrawer = path => {
  let points = [];
  for (const point of path)
    points.push(new Vector3(-487 + point.x * 25, 10, -487 + point.y * 25));

  const material = new LineBasicMaterial({
    color: "red",
    //   transparent: true,
    //   opacity: 0.2,
  });
  const geometry = new BufferGeometry().setFromPoints(points);
  return new Line(geometry, material);
};

export default dDrawer;
