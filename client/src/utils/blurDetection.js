export function analyzeBlur(imageData) {
  const { data, width, height } = imageData;
  const grayscale = new Float32Array(width * height);

  for (let i = 0, pixelIndex = 0; i < data.length; i += 4, pixelIndex += 1) {
    grayscale[pixelIndex] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  const laplacianValues = [];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const center = grayscale[index] * 4;
      const top = grayscale[index - width];
      const bottom = grayscale[index + width];
      const left = grayscale[index - 1];
      const right = grayscale[index + 1];
      laplacianValues.push(center - top - bottom - left - right);
    }
  }

  let sum = 0;

  for (const value of laplacianValues) {
    sum += value;
  }

  const mean = sum / laplacianValues.length;

  let varianceSum = 0;

  for (const value of laplacianValues) {
    varianceSum += (value - mean) ** 2;
  }

  return {
    variance: varianceSum / laplacianValues.length,
  };
}
