import { observer } from 'mobx-react-lite';
import { useFeedbackStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { PhotoPicker } from '@/components/photos/PhotoPicker';
import { PhotoGrid } from '@/components/photos/PhotoGrid';

const FeedbackScreenshots = observer(function FeedbackScreenshots() {
  const feedbackStore = useFeedbackStore();

  const handleAddPhotos = (photos: string[]) => {
    photos.forEach((photo) => feedbackStore.addMedia(photo));
  };

  return (
    <div className="flex flex-col h-dvh w-full bg-primary">
      <Header title="Screenshots" showBack />

      <div className="flex-1 px-4 py-4 overflow-y-auto w-full">
        <PhotoPicker
          onPhotosSelected={handleAddPhotos}
          maxPhotos={5}
          currentCount={feedbackStore.media.length}
        />

        <div className="mt-4">
          <PhotoGrid
            photos={feedbackStore.media}
            onRemove={(index) => feedbackStore.removeMedia(index)}
            editable
          />
        </div>
      </div>
    </div>
  );
});

export default FeedbackScreenshots;
