import {
  getColorSwatchBackground,
  getColorSwatchStops,
} from '../../utility/color-swatch';

const ColorSwatch = ({
  color,
  colorMap,
  className,
  onClick,
}: {
  color: string;
  colorMap: Record<string, string>;
  className?: string;
  onClick?: () => void;
}) => {
  const background = getColorSwatchBackground(
    getColorSwatchStops(color, colorMap)
  );

  return (
    <div
      title={color}
      onClick={onClick}
      className={className}
      style={{ background }}
    />
  );
};

export default ColorSwatch;
