"use client";

import React, { useState } from "react";
import { CardMedia, CardMediaProps } from "@mui/material";

type Props = {
  src: string;
  fallbackSrc: string;
  alt: string;
} & CardMediaProps;

const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <CardMedia
      component="img"
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
