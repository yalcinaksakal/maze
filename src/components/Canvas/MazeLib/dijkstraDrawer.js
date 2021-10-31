import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

const dDrawer = data => {
  const { path, direction } = data;
  const points = [];
  const shift = direction === "up" ? -3 : 3;
  for (const point of path)
    points.push(
      new Vector3(-487 + point.x * 25 + shift, 10, -487 + point.y * 25)
    );

  const material = new LineBasicMaterial({
    color: direction === "up" ? "red" : "dodgerblue",
    transparent: true,
    opacity: 0.5,
  });
  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  line.castShadow = true;
  return line;
};

export default dDrawer;
