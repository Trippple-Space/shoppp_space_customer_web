import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface SpinningLoaderProps {
  spinningLoaderText?: string;
  size?: number;
}

const SpinningLoader: React.FC<SpinningLoaderProps> = ({ spinningLoaderText, size = 30 }) => {
  const controls = useAnimation();

  useEffect(() => {
    const animate = async () => {
      while (true) {
        // rotate forward
        await controls.start({
          rotate: 0,
          transition: { duration: 2, ease: "easeInOut" },
        });
        // rotate backward
        await controls.start({
          rotate: 360,
          transition: { duration: 2, ease: "easeInOut" },
        });
      }
    };
    animate();
  }, [controls]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <motion.img
        src="/images/logos/shoppp-icon.svg"
        alt="spinningLoader"
        style={{ width: size, height: size }}
        animate={controls}
      />
      {spinningLoaderText && (
        <p
          style={{
            marginTop: 16,
            fontSize: 16,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            color: "#333", // match AppColors.textPrimary
            textAlign: "center",
          }}
        >
          {spinningLoaderText}
        </p>
      )}
    </div>
  );
};

export default SpinningLoader;
