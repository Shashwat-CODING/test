import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

export function useColorThief(imageUrl: string) {
  const [colors, setColors] = useState<{
    background: string;
    foreground: string;
    accent: string;
  }>({
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 0%)',
    accent: 'hsl(250 95% 60%)'
  });

  useEffect(() => {
    const img = new Image();
    const colorThief = new ColorThief();

    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, 3);
        const [primary, secondary, tertiary] = palette;

        setColors({
          background: `rgb(${primary[0]}, ${primary[1]}, ${primary[2]})`,
          foreground: `rgb(${secondary[0]}, ${secondary[1]}, ${secondary[2]})`,
          accent: `rgb(${tertiary[0]}, ${tertiary[1]}, ${tertiary[2]})`
        });
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };
  }, [imageUrl]);

  return colors;
}
