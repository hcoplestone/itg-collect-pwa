import { Camera, ImagePlus } from 'lucide-react';
import { useImagePicker } from '@/hooks/useImagePicker';

interface PhotoPickerProps {
  onPhotosSelected: (photos: string[]) => void;
  maxPhotos?: number;
  currentCount?: number;
}

export function PhotoPicker({ onPhotosSelected, maxPhotos = 5, currentCount = 0 }: PhotoPickerProps) {
  const { pickImages } = useImagePicker({ multiple: true });

  const handlePick = async () => {
    const remaining = maxPhotos - currentCount;
    if (remaining <= 0) return;

    const photos = await pickImages();
    if (photos.length > 0) {
      onPhotosSelected(photos.slice(0, remaining));
    }
  };

  const isMaxed = currentCount >= maxPhotos;

  return (
    <button
      onClick={handlePick}
      disabled={isMaxed}
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-accent/30 rounded-lg hover:border-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-secondary/50"
    >
      <div className="flex items-center gap-2 mb-2">
        <Camera className="w-5 h-5 text-text-secondary" />
        <ImagePlus className="w-5 h-5 text-text-secondary" />
      </div>
      <span className="text-sm text-text-secondary">
        {isMaxed ? `Maximum ${maxPhotos} photos` : 'Tap to add photos'}
      </span>
      <span className="text-xs text-text-secondary mt-1">
        {currentCount}/{maxPhotos} photos
      </span>
    </button>
  );
}
