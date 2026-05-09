export function checkBrightness(imageData) {
  const { data } = imageData;
  let total = 0;
  const pixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  return {
    average: total / pixels,
  };
}
