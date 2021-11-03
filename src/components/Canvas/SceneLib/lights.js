import { DirectionalLight, AmbientLight, PointLight } from "three";

const createLights = () => {
  //lights
  const light = new DirectionalLight("white", 0.8);
  light.position.set(-500, 500, -500);
  light.target.position.set(0, 0, 0);

  const plight = new PointLight("white", 0.2);
  plight.position.set(-200, 500, -200);
  plight.castShadow = true;
  plight.shadow.mapSize.width = 2048; // default
  plight.shadow.mapSize.height = 2048; // default
  plight.shadow.camera.near = 0.5; // default
  plight.shadow.camera.far = 5000; // default

  return {
    d: light,
    a: new AmbientLight("white", 0.2),
    p1: plight,
  };
};

export default createLights;
