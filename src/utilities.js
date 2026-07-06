export const getScreenDimensions = () => ({
  height: 800,
  width: 800,
});

export const defaultColumnCount = 10;

export const defaultRowCount = 10;

export const mazeGraphDefaults = {
  desktopSpacing: 60,
  mobileSpacing: 50,
};

export const DEVICETYPES = {
  MOBILE: 0,
  DESKTOP: 1,
  TABLET: 2,
};

export const KEYCODEMAP = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,
};

export const KeyEventKeyValues = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
};

export const KeyEventKeyValuesIEEdge = {
  UP: 'Up',
  DOWN: 'Down',
  RIGHT: 'Right',
  LEFT: 'Left',
};

export const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const getNewCoordinates = (direction, x, y, offSet) => {
  console.log('getting coordinates with: ');
  console.log({ direction, x, y, offSet });

  const newPoint = { x, y }; // make a quick clone

  switch (direction) {
    case 3:
      newPoint.x -= offSet;
      break;
    case 1:
      newPoint.x += offSet;
      break;
    case 0:
      newPoint.y -= offSet;
      break;
    case 2:
      newPoint.y += offSet;
      break;
    default:
      break;
  }

  return newPoint;
};
