import { X } from 'lucide-react';

interface PhotoGridProps {
  photos: string[];
  onRemove?: (index: number) => void;
  editable?: boolean;
}

export function PhotoGrid({ photos, onRemove, editable = false }: PhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((photo, index) => (
        <div key={index} className="relative aspect-square">
          <img
            src={photo}
            alt={`Photo ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {editable && onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-danger rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
