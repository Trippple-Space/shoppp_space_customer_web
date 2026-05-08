import * as React from 'react';

interface SpinLoaderProps {
  loading?: boolean;
  size?: number;
  color?: string;
  trackColor?: string;
  thickness?: number;
  className?: string;
}

const KEYFRAMES_ID = 'spin-loader-keyframes';

const SpinLoader = ({
  loading = true,
  size = 16,
  color = '#0B9378',
  trackColor,
  thickness = 3,
  className = '',
}: SpinLoaderProps): JSX.Element | null => {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(KEYFRAMES_ID)) return;

    const style = document.createElement('style');
    style.id = KEYFRAMES_ID;
    style.appendChild(
      document.createTextNode(
        `@keyframes spin-loader-rotate { to { transform: rotate(360deg); } }`
      )
    );
    document.head.appendChild(style);
  }, []);

  if (!loading) return null;

  const resolvedTrack =
    trackColor ?? (color.startsWith('#') ? `${color}33` : color);

  return (
    <span
      className={className}
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        lineHeight: 0,
        animation: 'spin-loader-rotate 0.8s linear infinite',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={resolvedTrack}
          strokeWidth={thickness}
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

export default SpinLoader;
