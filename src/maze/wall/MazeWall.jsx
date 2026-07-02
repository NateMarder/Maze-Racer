export const MazeWall = ({ id, x1, y1, x2, y2 }) => <line id={id} className="mz-wall" x1={x1} y1={y1} x2={x2} y2={y2} />;

export const MazeWallFactory = ({ rows, cols, spacing, carvedWallKeys }) => {
  const walls = [];
  let x1;
  let y1;
  let x2;
  let y2;
  let nextWallKey;
  let isCarvedWallKey;
  for (let i = 1; i <= cols - 1; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      x1 = x2 = i * spacing;
      y1 = j * spacing;
      y2 = y1 + spacing;
      isCarvedWallKey = undefined;
      nextWallKey = `${x1}.${y1}.${x2}.${y2}`
      isCarvedWallKey = carvedWallKeys.find(nextWallKey);
      if (!isCarvedWallKey) {
        walls.push({ id: nextWallKey, x1, y1, x2, y2 });
      }
      //buffer.push({ id: nextWallKey, x1, y1, x2, y2 });
    }
  }
  for (let i = 1; i <= rows - 1; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      y1 = y2 = i * spacing;
      x1 = j * spacing;
      x2 = x1 + spacing;
      isCarvedWallKey = undefined;
      nextWallKey = `${x1}.${y1}.${x2}.${y2}`
      isCarvedWallKey = carvedWallKeys.find(nextWallKey);
      if (!isCarvedWallKey) {
        walls.push({ id: nextWallKey, x1, y1, x2, y2 });
      }
      //buffer.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
    }
  }
  
  return [...walls];
  //return filter(buffer, w => !includes(carvedWallKeys, w.id));
};
