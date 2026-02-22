import { useCallback, useRef } from 'react';

interface UseImagePickerOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  multiple?: boolean;
}

export function useImagePicker(options: UseImagePickerOptions = {}) {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    multiple = false,
  } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const resizeImage = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', quality);
            resolve(base64);
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    },
    [maxWidth, maxHeight, quality]
  );

  const pickImages = useCallback((): Promise<string[]> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = multiple;
      input.capture = 'environment';
      inputRef.current = input;

      input.onchange = async () => {
        const files = Array.from(input.files || []);
        if (files.length === 0) {
          resolve([]);
          return;
        }

        try {
          const results = await Promise.all(files.map(resizeImage));
          resolve(results);
        } catch (error) {
          console.error('Error processing images:', error);
          resolve([]);
        }
      };

      input.click();
    });
  }, [multiple, resizeImage]);

  return { pickImages };
}
