"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  fallbackSrc: string;
  alt: string;
  className?: string; // <-- allow passing className
  [key: string]: any; // capture any other props like width, height, etc.
}

const isValidImageSrc = (src?: string) => {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
};

const ImageWithFallback = ({ src, fallbackSrc, alt = "Alt val", className, ...rest }: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(isValidImageSrc(src) ? src! : fallbackSrc);

  useEffect(() => {
    if (isValidImageSrc(src)) {
      setImgSrc(src!);
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  return <Image {...rest} src={imgSrc} alt={alt} className={className} onError={() => setImgSrc(fallbackSrc)} />;
};

export default ImageWithFallback;
