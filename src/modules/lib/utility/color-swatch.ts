const COLOR_SEPARATOR = /\s*(?:\band\b|&|,|\/|\+|\bwith\b|\bor\b)\s*/i;

const normalizeColorKey = (value: string) =>
  value.replaceAll(' ', '').toLowerCase();

const resolveColorStop = (
  part: string,
  colorMap: Record<string, string>
) => {
  const hex = colorMap[normalizeColorKey(part)];
  if (hex) return hex;
  return part;
};

export const getColorSwatchStops = (
  label: string,
  colorMap: Record<string, string>
) => {
  const parts = label
    .split(COLOR_SEPARATOR)
    .map((part) => part.replace(/^[-–—]+|[-–—]+$/g, '').trim())
    .filter(Boolean);

  const stops = (parts.length ? parts : [label]).map((part) =>
    resolveColorStop(part, colorMap)
  );

  return stops.length ? stops : [label];
};

export const getColorSwatchBackground = (stops: string[]) => {
  if (stops.length <= 1) return stops[0] ?? 'transparent';

  const slice = 100 / stops.length;
  return `linear-gradient(to right, ${stops
    .map((color, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      return `${color} ${start}% ${end}%`;
    })
    .join(', ')})`;
};
