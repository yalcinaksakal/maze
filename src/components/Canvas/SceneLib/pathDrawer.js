import { BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from "three";

const material = new LineBasicMaterial({
  color: "red",
  //   transparent: true,
  //   opacity: 0.2,
});

const drawer = pathes => {
  const group = new Group();
  for (const key of Object.keys(pathes)) {
    const [p1, p2] = key.split(":");
    const [x1, y1] = p1.split("-");
    const [x2, y2] = p2.split("-");
    const oldPoint = new Vector3(-487 + x1 * 25, 10, -487 + y1 * 25);
    const newPoint = new Vector3(-487 + x2 * 25, 10, -487 + y2 * 25);
    const geometry = new BufferGeometry().setFromPoints([oldPoint, newPoint]);
    group.add(new Line(geometry, material));
  }
  return group;
};

export default drawer;
