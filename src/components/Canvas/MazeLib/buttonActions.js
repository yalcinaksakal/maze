const buttonActions = { pressed: false, type: null };

export const complexity = { c: 0.7, speed: 1, size: 50 };

export const changeComplexity = val => (complexity.c = val);
export const changeSpedd = val => (complexity.speed = val);
export const changeSize = val => (complexity.size = val);

export default buttonActions;
