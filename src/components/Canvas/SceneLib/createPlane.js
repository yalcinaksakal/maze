import { PlaneGeometry, MeshStandardMaterial, DoubleSide, Mesh } from "three";

//Plane
const createPlane = () => {
  const plane = new Mesh(
    new PlaneGeometry(1500, 1500, 2, 2),
    new MeshStandardMaterial({
      color: "#ffe0b3",
      // transparent: true,
      // opacity: 0.3,
    })
  );

  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  plane.material.side = DoubleSide;
  plane.position.set(0, 0, 0);
  return plane;
};

export default createPlane;
