"use client";
// import React, { useState, useEffect } from "react";

const CustomSvg = ({
  svgCode,
  width = 65,
  height = 84,
  color = "#03847D",
  hoverColor = "#025D57",
  size,
  className,
  isHovered = false,
}) => {
  const style = {
    width: size ? `${size}px` : `${width}px`,
    height: size ? `${size}px` : `${height}px`,
    transition: "fill 0.3s ease",
  };

  // Dynamically replace fill with the current color based on hover state
  const currentColor = isHovered ? hoverColor : color;
  const svgWithColor = svgCode.replace(
    /fill="[^"]*"/g,
    `fill="${currentColor}"`
  );

  return (
    <div className={className} style={{ display: "inline-block", ...style }}>
      <div dangerouslySetInnerHTML={{ __html: svgWithColor }} />
    </div>
  );
};

export default CustomSvg;
