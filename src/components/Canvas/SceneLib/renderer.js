import { PCFShadowMap, WebGLRenderer } from "three";

const createR = () => {
  //set up renderer
  // const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  const renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
};

export default createR;
