export function range(start: number, end?: number): number[] {
  const s = end != null ? start : 0;
  const e = end != null ? end : start;
  const dicrection = s < e ? 1 : -1;
  const length = Math.abs(e - s);
  const result = Array(length);

  for (let i = 0; i < length; i += 1) {
    result[i] = s + i * dicrection;
  }

  return result;
}

export function sliceByNumber(array: any, number: number) {
  const length = Math.ceil(array.length / number);
  return new Array(length)
    .fill(null)
    .map((_, i) => array.slice(i * number, (i + 1) * number));
}
