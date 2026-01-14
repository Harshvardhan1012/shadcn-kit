// Simple bucket aggregation (averaging)
export function downsampleData(data: any[], threshold: number, yKeys: string[]) {
  if (data.length <= threshold) return data;

  const sampled = [];
  const every = Math.ceil(data.length / threshold);

  for (let i = 0; i < data.length; i += every) {
    const chunk = data.slice(i, i + every);
    const item = { ...chunk[0] }; // Copy metadata from first item

    // Average the numeric values
    yKeys.forEach(key => {
        if(typeof chunk[0][key] !== 'number') return;
        const sum = chunk.reduce((acc, curr) => acc + ((curr[key])), 0);
        item[key] = sum / chunk.length;
    });

    sampled.push(item);
  }
  console.log(`Downsampled data from ${data.length} to ${sampled.length} points.`);
  return sampled;
}