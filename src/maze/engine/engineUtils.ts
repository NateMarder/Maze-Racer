export function shuffle<T>(array: T[]): T[] {
  const result: T[] = [...array] // allocate an array of the correct size first
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function getOrthogonalKey(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  if (x1 === x2) {
    const high = Math.max(y1, y2);
    const low = Math.min(y1, y2);
    const distance = (high - low) / 2;
    const wallY = high - distance;

    return `${x1 - distance}.${wallY}.${x1 + distance}.${wallY}`;
  }

  const high = Math.max(x1, x2);
  const low = Math.min(x1, x2);
  const distance = (high - low) / 2;
  const wallX = high - distance;

  return `${wallX}.${y1 - distance}.${wallX}.${y1 + distance}`;
}
