const addPossibleCrossPathes = (pathes, mazeSizeX, mazeSizeY) => {
  let isUpPossible,
    isLeftPossible,
    isRightPossible,
    isFromUpToUpLeft,
    isFromUpToUpright,
    isFromLeftToUp,
    isFromRightToUp,
    upLeft,
    upRight;
  for (let i = 0; i < mazeSizeX; i++)
    for (let j = 0; j < mazeSizeY - 1; j++) {
      isUpPossible =
        pathes[`${i}-${j}:${i}-${j + 1}`] || pathes[`${i}-${j + 1}:${i}-${j}`];

      isLeftPossible =
        pathes[`${i}-${j}:${i + 1}-${j}`] || pathes[`${i + 1}-${j}:${i}-${j}`];

      isRightPossible =
        pathes[`${i}-${j}:${i - 1}-${j}`] || pathes[`${i - 1}-${j}:${i}-${j}`];

      isFromUpToUpLeft =
        pathes[`${i}-${j + 1}:${i + 1}-${j + 1}`] ||
        pathes[`${i + 1}-${j + 1}:${i}-${j + 1}`];

      isFromUpToUpright =
        pathes[`${i}-${j + 1}:${i - 1}-${j + 1}`] ||
        pathes[`${i - 1}-${j + 1}:${i}-${j + 1}`];

      isFromLeftToUp =
        pathes[`${i + 1}-${j}:${i + 1}-${j + 1}`] ||
        pathes[`${i + 1}-${j + 1}:${i + 1}-${j}`];

      isFromRightToUp =
        pathes[`${i - 1}-${j}:${i - 1}-${j + 1}`] ||
        pathes[`${i - 1}-${j + 1}:${i - 1}-${j}`];

      upLeft =
        isUpPossible && isFromUpToUpLeft && isLeftPossible && isFromLeftToUp;

      upRight =
        isUpPossible && isFromUpToUpright && isRightPossible && isFromRightToUp;

      if (upLeft) pathes[`${i}-${j}:${i + 1}-${j + 1}`] = 1.4;
      if (upRight) pathes[`${i}-${j}:${i - 1}-${j + 1}`] = 1.4;
    }
  return pathes;
};

export default addPossibleCrossPathes;
