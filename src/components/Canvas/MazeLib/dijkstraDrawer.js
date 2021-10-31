import { BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from "three";

const material = new LineBasicMaterial({
  color: "red",
  //   transparent: true,
  //   opacity: 0.2,
});

const dDrawer = pathes => {
  let points;
  const group = new Group();

  for (const item of Object.values(pathes)) {
    points = [];
    for (const point of item.path)
      points.push(new Vector3(-487 + point.x * 25, 10, -487 + point.y * 25));

    const geometry = new BufferGeometry().setFromPoints(points);
    group.add(new Line(geometry, material));
  }
  return group;
};

export default dDrawer;
