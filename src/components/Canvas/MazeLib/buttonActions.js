const buttonActions = { pressed: false, type: null };

export let sceneController;

export const setSceneController = func => (sceneController = func);

//initial values for maze size 50
export const complexity = { c: 0.7, speed: 1, size: 50 };

//25 is dimension of nodes in maze
export const changeComplexity = val => {
  complexity.c = val;
  complexity.startPosition = (val * 25) / 2;
};
export const changeSpedd = val => {
  complexity.speed = val;
};

export const changeSize = val => {
  complexity.size = val;
};

export default buttonActions;
