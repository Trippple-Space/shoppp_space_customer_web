import * as React from "react";

interface PuffLoaderProps {
  loading?: boolean;
  color?: string;
  size?: number;
  className?: string
}

function PuffLoader({ loading = true, color = "#000000", size = 60, className = '' }: PuffLoaderProps): React.JSX.Element | null {
  const wrapperStyle: React.CSSProperties = {
    display: "inline-block",
    position: "relative",
    width: size,
    height: size,
  };

  const dotStyle: React.CSSProperties = {
    position: "absolute",
    height: size,
    width: size,
    border: `thick solid ${color}`,
    borderRadius: "50%",
    opacity: "1",
    top: 0,
    left: 0,
    animationFillMode: "both",
    animation: `puff-animation 2s infinite cubic-bezier(0.165, 0.84, 0.44, 1), puff-animation 2s -1s infinite cubic-bezier(0.3, 0.61, 0.355, 1)`,
  };

  const keyFrames = `
    @keyframes puff-animation {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(1.0); opacity: 0; }
    }
  `;

  React.useEffect(() => {
    const styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    const styleSheet = styleEl.sheet;

    if (styleSheet) {
      styleSheet.insertRule(keyFrames, 0);
    }

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []); // Run the effect only once during component mount

  if (!loading) {
    return null;
  }

  return (
    <span className={className} style={wrapperStyle}>
      <span style={dotStyle} />
      <span style={{ ...dotStyle, animationDelay: "0s" }} />
    </span>
  );
}

export default PuffLoader;
