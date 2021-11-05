import { PlaneGeometry, MeshStandardMaterial, DoubleSide, Mesh } from "three";

//Plane
const createPlane = dimension => {
  //distance from edges is 250
  dimension += 200;
  const plane = new Mesh(
    new PlaneGeometry(dimension, dimension + 300, 1, 1),
    new MeshStandardMaterial({
      color: "white",
      transparent: true,
      opacity: 0.5,
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
